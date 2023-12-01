"use client";

import classNames from "classnames";
import { sortBy } from "lodash-es";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import RetroInput from "@/components/forms/retro-input";
import PageHeader from "@/components/layout/page-header";
import { Review } from "@/lib/types";
import {
  formatDDMMYYWithDots,
  isCoupDeCoeur,
  movie_info_containsFilteringTerm,
  safeDate,
} from "@/lib/util";

export default function CoupsDeCoeurPage() {
  const [filter, setFilter] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    (async () => {
      setReviews(
        sortBy(
          (await (await fetch("/api/movies/all-reviewed")).json()).filter(
            isCoupDeCoeur,
          ),
          (review) => -safeDate(review.review_date).valueOf(),
        ),
      );
    })();
  }, []);

  const filteredReviews = useMemo(
    () =>
      filter === ""
        ? reviews
        : reviews.filter((review) =>
            movie_info_containsFilteringTerm(review, filter),
          ),
    [filter, reviews],
  );

  return (
    <div className="flex grow flex-col pb-4">
      <div className="flex">
        <PageHeader text="coups de coeur" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex border-b border-retro-gray py-4 text-xl/6 font-semibold uppercase text-retro-gray">
          archive des critiques
        </div>
        <div className="flex">
          <RetroInput
            placeholder="recherche"
            value={filter}
            setValue={setFilter}
          />
        </div>
        <div className="flex grow flex-col">
          {filteredReviews.map((review) => (
            <div key={review.id} className="group flex">
              <div className="flex w-1/2 border-r border-retro-gray pr-2">
                <div
                  className={classNames(
                    "grow gap-1 border-b border-retro-gray px-1 py-2 font-medium text-retro-black group-first:border-t group-odd:bg-retro-green",
                  )}
                >
                  {formatDDMMYYWithDots(safeDate(review.review_date))}
                </div>
              </div>
              <div className="flex w-1/2 border-retro-gray pl-2">
                <div
                  className={classNames(
                    "grow border-b border-retro-gray px-1 py-2 font-medium uppercase text-retro-black group-first:border-t group-odd:bg-retro-green",
                  )}
                >
                  <Link href={`/archives/${review.id}`} className="underline">
                    {review.title}
                  </Link>{" "}
                  ({review.year}), {review.directors}
                </div>
              </div>
            </div>
          ))}
          <div className="flex h-40">
            <div className="w-1/2 border-r border-retro-gray pr-2"></div>
            <div className="w-1/2 pl-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}