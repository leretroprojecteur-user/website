/* eslint-disable @next/next/no-img-element */
"use client";

import classNames from "classnames";
import { size, sortBy, toPairs } from "lodash-es";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { isAfter, isEqual } from "date-fns";

import PageHeader from "@/components/layout/page-header";
import { MovieDetail, ShowtimesTheater } from "@/lib/types";
import {
  floatHourToString,
  formatDDMMYYWithDots,
  getStartOfDayInParis,
  getStartOfTodayInParis,
  safeDate,
} from "@/lib/util";

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

export default function ArchivesPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetail | undefined>();

  useEffect(() => {
    (async () => {
      setMovie(await (await fetch(`/api/movies/by-id/${movieId}`)).json());
    })();
  }, [movieId]);

  const screenings = useMemo(
    () =>
      toPairs(movie?.screenings ?? []).filter(
        ([date]) =>
          isAfter(getStartOfDayInParis(date), getStartOfTodayInParis()) ||
          isEqual(getStartOfDayInParis(date), getStartOfTodayInParis()),
      ),
    [movie],
  );

  return (
    <div className="flex grow flex-col">
      <div className="flex">
        <PageHeader text="archives" />
      </div>
      {movie == null ? null : (
        <div className="flex flex-col">
          <div className="flex flex-col gap-3">
            <div className="border-b border-retro-gray py-4 text-center text-xl font-semibold uppercase text-retro-gray">
              <u className="underline">{movie.title}</u> ({movie.year}),{" "}
              {movie.directors}
            </div>
            {movie.image_file == null ? null : (
              <div className="flex">
                <img
                  className="grow"
                  src={`data:image/png;base64,${movie.image_file}`}
                  alt="movie-screenshot"
                />
              </div>
            )}
            {movie.review == null ? null : (
              <div
                className="pb-4 font-medium leading-tight"
                dangerouslySetInnerHTML={{ __html: movie.review }}
              ></div>
            )}
            <div className="text-l flex font-medium uppercase text-retro-gray">
              titre original : {movie.original_title}
              <br />
              {movie.duration == null
                ? "Durée inconnue"
                : `Durée ${Math.floor(parseInt(movie.duration) / 60)} minutes`}
            </div>
            <div className="text-l flex justify-center border-y border-retro-gray bg-retro-green py-4 font-semibold uppercase text-retro-gray">
              prochaines scéances à paris
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {size(screenings) > 0 ? (
              <div className="flex">
                <Screenings screenings={screenings} />
              </div>
            ) : (
              <div className="border-b border-retro-gray py-4 font-medium">
                Pas de séances prévues pour le moment
              </div>
            )}
            <div className="mb-4 h-40 w-1/2 self-start border-r border-retro-gray" />
          </div>
        </div>
      )}
    </div>
  );
}

function Screenings({
  screenings,
}: {
  screenings: [string, ShowtimesTheater[]][];
}) {
  const sortedByDateAndTheater = useMemo(
    () =>
      sortBy(screenings).map<[string, ShowtimesTheater[]]>(
        ([date, theaters]) => [
          date,
          sortBy(theaters, (theater) => theater.clean_name),
        ],
      ),
    [screenings],
  );

  return (
    <div className="flex grow flex-col">
      {sortedByDateAndTheater.map(([date, theaters]) => (
        <div
          key={date}
          className={classNames(
            "flex border-b border-retro-gray py-4 font-medium",
          )}
        >
          <div className="shrink-0 pr-3">
            {formatDDMMYYWithDots(safeDate(date))}
          </div>
          <div className="flex grow flex-col gap-2">
            {theaters.map((theater) => (
              <div key={theater.clean_name} className="flex">
                <div className="grow">
                  {theater.clean_name} ({theater.zipcode_clean})
                </div>
                <div className="flex shrink-0 flex-col pl-3">
                  {theater.showtimes.map((showtime) => (
                    <div key={showtime}>{floatHourToString(showtime)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
