import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { keyBy, omit, uniq } from "lodash-es";
import { unstable_cache } from "next/cache";
import "server-only";

import { format } from "date-fns";

import { getFirebase } from "./firebase";
import {
  Movie,
  MovieDetail,
  MovieDetailWithImage,
  MovieWithShowtimesByDay,
  Review,
  SearchMovie,
} from "./types";
import { checkNotNull, getNextMovieWeek } from "./util";

export const getWeekMovies = async () => {
  const nextMovieWeek = getNextMovieWeek();

  const moviesByDay = await Promise.all(
    nextMovieWeek.map<
      Promise<[date: Date, movies: { [index: string]: Movie }]>
    >(async (day) => {
      return [day, keyBy(await getDayMovies(day), (movie) => movie.id)];
    }),
  );

  const allMovieIds = uniq(
    moviesByDay.flatMap(([_, dayMovies]) => Object.keys(dayMovies)),
  );

  return allMovieIds.map((movieId) => {
    const daysShowing = moviesByDay.filter(
      ([_, movies]) => movies[movieId] != null,
    );

    const movie: MovieWithShowtimesByDay = {
      ...daysShowing[0][1][movieId],
      showtimes_by_day: {},
    };

    return daysShowing.reduce<MovieWithShowtimesByDay>(
      (movieWithAllDays, [day, movieOnDay]) => ({
        ...movieWithAllDays,
        showtimes_by_day: {
          ...movieWithAllDays.showtimes_by_day,
          [format(day, "y-MM-dd")]:
            movieOnDay[movieWithAllDays.id].showtimes_theater,
        },
      }),
      movie,
    );
  });
};

export const getDayMovies = unstable_cache(
  async (date: Date, options?: { allMovies?: boolean }) => {
    const { db } = getFirebase();
    const q = query(
      collection(
        db,
        `website-by-date-screenings${
          options?.allMovies ?? false ? "-all" : ""
        }`,
      ),
      where("date", "==", format(date, "y_MM_dd")),
    );
    const docs: Movie[] = [];
    (await getDocs(q)).forEach((doc) => docs.push(...doc.data().movies));
    return docs;
  },
  ["day-movies"],
  { revalidate: 1 },
);

export const getMovies = unstable_cache(
  async () => {
    const { db } = getFirebase();
    const q = doc(db, "website-extra-docs", "all-movies");
    const querySnapshot = await getDoc(q);
    return checkNotNull(querySnapshot.data()).elements as SearchMovie[];
  },
  ["all-movies"],
  { revalidate: 1 },
);

export const getReviewedMovies = unstable_cache(
  async () => {
    const { db } = getFirebase();
    const q = doc(db, "website-extra-docs", "all-reviews");
    const querySnapshot = await getDoc(q);
    return checkNotNull(querySnapshot.data()).elements as Review[];
  },
  ["reviewed-movies"],
  { revalidate: 1 },
);

export const getMovie = unstable_cache(
  async (id: string) => {
    const { db } = getFirebase();
    const q = query(
      collection(db, "website-by-movie-screenings"),
      where("id", "==", id),
    );
    const querySnapshot = await getDocs(q);
    const data_aux: MovieDetail[] = [];
    querySnapshot.forEach((doc) => {
      data_aux.push({
        ...omit(doc.data() as MovieDetailWithImage, "image_file"),
      });
    });
    return data_aux[0];
  },
  ["single-movie"],
  { revalidate: 1 },
);
