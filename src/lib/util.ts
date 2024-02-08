import { every, omit, padStart, some } from "lodash-es";
import { DateTime } from "luxon";
import Image from "next/image";
import { ComponentProps, useMemo } from "react";
import { useWindowSize } from "usehooks-ts";

import {
  Movie,
  MovieWithNoShowtimes,
  MovieWithShowtimesByDay,
  Review,
} from "./types";

export function isCoupDeCoeur({ category }: { category?: string }) {
  return category === "COUP DE CŒUR";
}

export function getNextMovieWeek() {
  const today = nowInParis();
  const startOfNextWeek = today
    .startOf("week")
    .plus({ weeks: [1, 2, 3, 4, 5, 7].includes(today.weekday) ? 0 : 1 })
    .plus({ days: 2 });

  return [...Array(7)].map((_, i) => startOfNextWeek.plus({ days: i }));
}

export function checkNotNull<T>(check: T | null | undefined): T {
  if (check == null) {
    throw new Error();
  }
  return check;
}

export function floatHourToString(hour: number) {
  return `${Math.floor(hour)}h${padStart(
    parseInt((60 * (hour - Math.floor(hour))).toPrecision(2)).toString(),
    2,
    "0",
  )}`;
}

export function safeDate(date: string) {
  return DateTime.fromISO(date.replaceAll("_", "-"), {
    zone: "Europe/Paris",
    locale: "fr",
  });
}

export function nowInParis() {
  return DateTime.local({ zone: "Europe/Paris", locale: "fr" });
}

export function getStartOfTodayInParis() {
  return nowInParis().startOf("day");
}

export function clean_string(str: string) {
  str = str.replaceAll("-", " ");
  str = str.replaceAll(/['’]/g, "'");
  str = str.replaceAll("'", " ");
  str = str.replaceAll("&", " and ");
  str = str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  str = str.replaceAll(/[^a-zA-Z0-9 #]/g, "");
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.toLowerCase();
  return str;
}

function at_least_one_word_starts_with_substring(
  list: string[],
  substring: string,
) {
  return some(list, (word) => word.startsWith(substring));
}

export function string_match(term: string, searchField: string) {
  const fields = getFields(searchField);
  return string_match_fields(term, fields);
}

export function getFields(searchField: string) {
  return clean_string(searchField).split(" ");
}

export function string_match_fields(term: string, fields: string[]) {
  const keywords = clean_string(term).split(" ");
  return every(keywords, (keyword) =>
    at_least_one_word_starts_with_substring(fields, keyword),
  );
}

export function movie_info_containsFilteringTerm(
  f: MovieWithNoShowtimes | Review,
  filteringTerm: string,
) {
  if (filteringTerm.slice(-1) === "|") {
    filteringTerm = filteringTerm.slice(0, -1);
  }
  const filtering_field = get_movie_info_string(omit(f, "year"));
  const filteringTerms = filteringTerm.split("|");
  return some(filteringTerms, (filteringTerm) =>
    string_match(filteringTerm, filtering_field),
  );
}

function get_movie_info_string(f: Record<string, string>) {
  return (
    [
      "language",
      "title",
      "original_title",
      "directors",
      "countries",
      "tags",
    ] as Array<keyof MovieWithNoShowtimes>
  )
    .map((key) => {
      return f[key] == null ? "" : `${f[key]}`;
    })
    .join(" ");
}

// lundi 1 janvier
export function formatLundi1Janvier(date: DateTime) {
  return date.toFormat("EEEE d MMMM");
}

// 2024-12-31
export function formatYYYYMMDD(date: DateTime) {
  return date.toFormat("yyyy-MM-dd");
}

// 2024_12_31
export function formatYYYY_MM_DD(date: DateTime) {
  return date.toFormat("yyyy_MM_dd");
}

// 31/12/04
export function formatDDMMYYWithSlashes(date: DateTime) {
  return date.toFormat("dd/MM/yy");
}

// Ven. 31/12
export function formatMerJJMM(date: DateTime) {
  return date.toFormat("EEE dd/MM");
}

// lundi
export function formatLundi(date: DateTime) {
  return date.toFormat("EEEE");
}

export function splitIntoSubArrays<T>(array: T[], subArraySize: number) {
  return [...Array(Math.ceil(array.length / subArraySize))].map((_, i) =>
    array.slice(i * subArraySize, i * subArraySize + subArraySize),
  );
}

export function useIsMobile() {
  const { width } = useWindowSize();
  return useMemo(() => width > 1 && width < 1024, [width]);
}

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function getMovieTags({ tags }: { tags: string }) {
  return Array.from(tags.matchAll(/#([^\s]+)/g)).map(([_, tag]) => tag);
}

export const TAG_MAP: Record<string, string> = {
  cdc: "coup de coeur",
  curio: "on est curieux",
  female: "femmes réalisatrices",
  jamesbond: "james bond",
  "s&s": "top 100 du sondage sight & sound",
};

export function getImageUrl({ id }: { id: string }) {
  return `https://firebasestorage.googleapis.com/v0/b/website-cine.appspot.com/o/images%2F${id}.jpg?alt=media`;
}

export function getReviewSortKey(review: Review) {
  return `${formatYYYYMMDD(safeDate(review.review_date))}-${review.id}`;
}

export const blurProps: Partial<ComponentProps<typeof Image>> = {
  placeholder: "blur",
  blurDataURL:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1I\
    w1AUhU9Ti6IVBTuIOGSoThZERRy1CkWoEGqFVh1MXvoHTRqSFBdHwbXg4M9i1cHFWVcHV0EQ/AFxdnBSdJES70sKLWK88Hgf591zeO8\
    +QKiXmWZ1jAOabpupRFzMZFfFzlcE0I8QehCSmWXMSVISvvV1T91UdzGe5d/3Z/WqOYsBAZF4lhmmTbxBPL1pG5z3iSOsKKvE58RjJl\
    2Q+JHrisdvnAsuCzwzYqZT88QRYrHQxkobs6KpEU8RR1VNp3wh47HKeYuzVq6y5j35C8M5fWWZ67SGkcAiliBBhIIqSijDRox2nRQLK\
    TqP+/iHXL9ELoVcJTByLKACDbLrB/+D37O18pMTXlI4DoReHOdjBOjcBRo1x/k+dpzGCRB8Bq70lr9SB2Y+Sa+1tOgR0LcNXFy3NGUP\
    uNwBBp8M2ZRdKUhLyOeB9zP6piwwcAt0r3lza57j9AFI06ySN8DBITBaoOx1n3d3tc/t357m/H4A00xyZ4zFmDgAAAAGYktHRAD/AP8\
    A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfoARAFFzB+KzuxAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU\
    1QV4EOFwAAAA1JREFUCNdj+PJ/+38ACT8DquQRMKUAAAAASUVORK5CYII=",
};

export function isMovieWithShowtimesByDay(
  movie: MovieWithNoShowtimes,
): movie is MovieWithShowtimesByDay {
  return "showtimes_by_day" in movie;
}

export function isMoviesWithShowtimesByDay(
  movies: Movie[] | MovieWithShowtimesByDay[],
): movies is MovieWithShowtimesByDay[] {
  return some(movies, isMovieWithShowtimesByDay);
}
