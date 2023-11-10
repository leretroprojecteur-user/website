"use client";

import { capitalize, size, sortBy, toPairs } from "lodash-es";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

import SetTitle from "@/app/details/set-title";
import { MovieDetail } from "@/lib/types";
import { checkNotNull, floatHourToString, safeDate } from "@/lib/util";

export default function Details() {
  const params = useSearchParams();
  const id = params.get("id");

  const [movie, setMovie] = useState<MovieDetail | undefined>();

  useEffect(() => {
    (async () => {
      setMovie(await (await fetch(`/details/api/${id}`)).json());
    })();
  }, [id]);

  return movie == null ? (
    <></>
  ) : (
    <>
      <h2>
        <span id="title">
          <i>{movie.title}</i>, {movie.directors} ({movie.year})
        </span>
      </h2>
      <div style={{ textAlign: "center" }}>
        <span id="fiche-technique">
          Titre original&nbsp;: <i>{movie.original_title}</i>
          <br />
          {movie.duration == null
            ? "Durée inconnue"
            : `Durée : ${Math.floor(parseInt(movie.duration) / 60)} minutes`}
        </span>
      </div>
      <br />
      {movie.review != null ? (
        <span id="review_box">
          <div className="moviebox">
            {movie.image_file != null ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`data:image/png;base64,${movie.image_file}`}
                alt="movie-screenshot"
              />
            ) : null}
            <h3 style={{ color: "grey" }}>COUP DE CŒUR</h3>
            <div dangerouslySetInnerHTML={{ __html: movie.review }}></div>
            <div style={{ textAlign: "right" }}>
              Critique du{" "}
              {format(safeDate(checkNotNull(movie.review_date)), "d MMMM y", {
                locale: fr,
              })}
            </div>
          </div>
          <br />
        </span>
      ) : null}
      <span id="next-screenings">
        <div className="moviebox">
          <h3>Prochaines séances à Paris&nbsp;:</h3>
          {size(movie.screenings) > 0 ? (
            sortBy(toPairs(movie.screenings), ([date]) => safeDate(date)).map(
              ([date, screenings]) => (
                <div key={date}>
                  <p style={{ lineHeight: "10px" }}></p>
                  <b>
                    {capitalize(
                      format(safeDate(date), "EEEE d MMMM", { locale: fr }),
                    )}
                  </b>{" "}
                  {sortBy(screenings, (theater) => theater.clean_name)
                    .map(
                      (theater) =>
                        `${theater.clean_name} (${
                          theater.zipcode_clean
                        }) : ${sortBy(theater.showtimes)
                          .map((showtime) => floatHourToString(showtime))
                          .join(", ")}`,
                    )
                    .join(" ; ")}
                </div>
              ),
            )
          ) : (
            <b>Pas de séance prévue pour le moment.</b>
          )}
        </div>
      </span>
      <br />
      <SetTitle movie={movie} />
    </>
  );
}