import { capitalize, size, sortBy, toPairs } from "lodash-es";
import Image from "next/image";
import { useMemo } from "react";

import { isAfter, isEqual } from "date-fns";

import coupDeCoeur from "@/assets/coup-de-coeur.png";
import PageHeader from "@/components/layout/page-header";
import { TwoColumnPage } from "@/components/layout/two-column-page";
import {
  BodyCopy,
  MetaCopy,
  SousTitre1,
  SousTitre2,
} from "@/components/typography/typography";
import { MovieDetail, ShowtimesTheater } from "@/lib/types";
import {
  TAG_MAP,
  blurProps,
  floatHourToString,
  formatDDMMYYWithSlashes,
  formatMerJJMM,
  getImageUrl,
  getMovieTags,
  getStartOfDayInParis,
  getStartOfTodayInParis,
  safeDate,
  splitIntoSubArrays,
} from "@/lib/util";

export default function Film({ movie }: { movie: MovieDetail }) {
  return (
    <>
      <PageHeader text={"Film"}>
        <MovieHeader movie={movie} />
      </PageHeader>
      <TwoColumnPage
        left={<MovieInfo movie={movie} />}
        right={<MovieScreenings movie={movie} />}
      />
    </>
  );
}

function MovieHeader({ movie }: { movie: MovieDetail }) {
  return (
    <div className="text-center lg:text-left">
      <SousTitre1>
        <u>{movie.title}</u>, {movie.directors} ({movie.year})
      </SousTitre1>
    </div>
  );
}

function MovieInfo({ movie }: { movie: MovieDetail }) {
  return (
    <>
      {movie.review && movie.review_date && (
        <div className="flex flex-col pb-20px">
          <div className="flex grow basis-0 pb-15px lg:pb-20px">
            <Image
              width={1200}
              height={675}
              className="h-auto w-full"
              src={getImageUrl(movie)}
              alt="movie-screenshot"
              {...blurProps}
            />
          </div>
          <BodyCopy className="border-b pb-20px lg:border-0 lg:pb-0">
            <div dangerouslySetInnerHTML={{ __html: movie.review }}></div>
            <div className="flex items-center pt-6px">
              <div className="pr-6px">
                <Image
                  className="w-25px"
                  alt="coup de coeur"
                  src={coupDeCoeur}
                />
              </div>
              <div>
                Critique du{" "}
                {formatDDMMYYWithSlashes(safeDate(movie.review_date))}
              </div>
            </div>
          </BodyCopy>
        </div>
      )}

      <div className="flex lg:border-y lg:py-20px">
        <MetaCopy>
          <div>Titre original&nbsp;: {movie.original_title}</div>
          {movie.duration == null ? (
            "Durée inconnue"
          ) : (
            <div>
              Durée&nbsp;: {Math.floor(parseInt(movie.duration) / 60)} minutes
            </div>
          )}
          {movie.language == null ? (
            ""
          ) : (
            <div>Langue&nbsp;: {movie.language}</div>
          )}
          {movie.screenwriters == null ? (
            ""
          ) : (
            <div>Scénario&nbsp;: {movie.screenwriters}</div>
          )}
          {movie.countries == null ? (
            ""
          ) : (
            <div>Pays&nbsp;: {movie.countries}</div>
          )}
          {movie.distributor == null ? (
            ""
          ) : (
            <div>Distribué par {movie.distributor}</div>
          )}
        </MetaCopy>
      </div>
      <Tags movie={movie} />
    </>
  );
}

function MovieScreenings({ movie }: { movie: MovieDetail }) {
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
    <>
      <div className="flex justify-center border-y bg-retro-green py-13px text-center lg:px-20px lg:py-16px">
        <SousTitre2>Prochaines séances à Paris</SousTitre2>
      </div>
      <div className="flex flex-col">
        {size(screenings) > 0 ? (
          <Screenings screenings={screenings} />
        ) : (
          <div className="border-b py-12px text-center lg:grow lg:py-16px">
            <BodyCopy>Pas de séances prévues pour le moment</BodyCopy>
          </div>
        )}
      </div>
    </>
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
    <div className="grid-auto-rows grid grid-cols-[auto_1fr] gap-x-50px">
      {sortedByDateAndTheater.map(([date, theaters]) => (
        <DateScreenings key={date} date={date} theaters={theaters} />
      ))}
    </div>
  );
}

function DateScreenings({
  date,
  theaters,
}: {
  date: string;
  theaters: ShowtimesTheater[];
}) {
  return (
    <div className="col-span-full grid grid-cols-[subgrid] border-b py-12px lg:py-16px lg:hover:bg-retro-pale-green">
      <BodyCopy>{capitalize(formatMerJJMM(safeDate(date)))}</BodyCopy>
      <div className="flex flex-col">
        {theaters.map((theater) => (
          <TheaterScreenings
            key={theater.clean_name}
            showtimesTheater={theater}
          />
        ))}
      </div>
    </div>
  );
}

function TheaterScreenings({
  showtimesTheater,
}: {
  showtimesTheater: ShowtimesTheater;
}) {
  return (
    <div className="flex">
      <div className="grow">
        <BodyCopy>
          {showtimesTheater.clean_name} ({showtimesTheater.zipcode_clean})
        </BodyCopy>
      </div>
      <div className="flex shrink-0 flex-col lg:pl-8px">
        {splitIntoSubArrays(showtimesTheater.showtimes, 3).map(
          (showtimes, i) => (
            <ThreeScreenings showtimes={showtimes} key={i} />
          ),
        )}
      </div>
    </div>
  );
}

function ThreeScreenings({ showtimes }: { showtimes: number[] }) {
  return (
    <div className="flex flex-col justify-end lg:flex-row">
      {showtimes.map((showtime) => (
        <div key={showtime} className="group flex justify-end">
          <BodyCopy>{floatHourToString(showtime)}</BodyCopy>
          <div className="hidden group-last:hidden lg:block">
            <BodyCopy>&nbsp;•&nbsp;</BodyCopy>
          </div>
        </div>
      ))}
    </div>
  );
}

function Tags({ movie }: { movie: MovieDetail }) {
  const tags = useMemo(() => getMovieTags(movie), [movie]);

  return (
    tags.length > 0 && (
      <div className="flex hidden flex-wrap gap-8px pt-15px lg:gap-10px lg:pt-20px">
        {tags.map((tag) => (
          <div
            key={tag}
            className="rounded-2xl bg-retro-gray px-15px py-6px text-19px font-medium uppercase text-white lg:px-12px lg:text-20px lg:tracking-[-0.02em]"
          >
            {TAG_MAP[tag]}
          </div>
        ))}
      </div>
    )
  );
}
