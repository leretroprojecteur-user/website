"use client";

import { sortBy } from "lodash-es";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { safeFetch } from "@/lib/offline";
import { Review } from "@/lib/types";
import { safeDate } from "@/lib/util";

export default function Coeur() {
  const _ = useSearchParams();
  const [_reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    (async () => {
      setReviews(await (await safeFetch([], "/coeur/api")).json());
    })();
  }, []);

  const reviews = useMemo(
    () => _reviews.filter((review) => review?.category === "COUP DE CŒUR"),
    [_reviews],
  );

  console.log(reviews);

  return sortBy(
    reviews,
    (review) => -safeDate(review.review_date).valueOf(),
  ).map((movie) => (
    <tr key={movie.id}>
      <td>
        Critique du{" "}
        {format(safeDate(movie.review_date), "d MMMM y", { locale: fr })} :{" "}
        <Link href={`/details/${movie.id}`}>
          <b>{movie.title}</b>, {movie.directors} ({movie.year})
        </Link>
      </td>
    </tr>
  ));
}
