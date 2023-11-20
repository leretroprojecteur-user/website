"use client";

import { useClickAway } from "@uidotdev/usehooks";
import { sortBy, take } from "lodash-es";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { safeFetch } from "@/lib/offline";
import { SearchMovie } from "@/lib/types";
import { string_match } from "@/lib/util";

export default function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef: React.MutableRefObject<HTMLInputElement> = useClickAway(() =>
    setTimeout(() => setSearchTerm(""), 100),
  );

  const onChangeSearchTerm = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target?.value);
    },
    [setSearchTerm],
  );

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div className="dropdown">
          <label htmlFor="movie-search"></label>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={onChangeSearchTerm}
            className="movie-search"
            placeholder="Recherchez un film..."
          />
          <Suspense fallback={<></>}>
            <Dropdown searchTerm={searchTerm} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function Dropdown({ searchTerm }: { searchTerm: string }) {
  useSearchParams();
  const [movies, setMovies] = useState<SearchMovie[]>([]);

  useEffect(() => {
    (async () => {
      setMovies(await (await safeFetch([], "/api/all-movies")).json());
    })();
  }, []);

  const filtered = useMemo(
    () =>
      searchTerm.length > 0
        ? take(
            sortBy(
              movies.filter((movie) =>
                string_match(searchTerm, movie.search_field),
              ),
              (movie) => -movie.relevance_score,
            ),
            5,
          )
        : [],
    [movies, searchTerm],
  );

  return (
    <div id="my-dropdown" className="dropdown-content show">
      {filtered.map((movie) => (
        <Link key={movie.id} href={`/details/${movie.id}`}>
          <i>{movie.title}</i>, {movie.directors} ({movie.year})
        </Link>
      ))}
    </div>
  );
}
