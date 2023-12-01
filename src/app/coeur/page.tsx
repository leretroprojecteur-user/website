"use client";

import { sortBy } from "lodash-es";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";

import RetroInput from "@/components/forms/retro-input";
import PageHeader from "@/components/layout/page-header";
import {
  fetcher,
  formatDDMMYYWithDots,
  movie_info_containsFilteringTerm,
  safeDate,
} from "@/lib/util";

export default function CoupsDeCoeurPage() {
  const [filter, setFilter] = useState("");

  const { data: fetchedReviews, isLoading } = useSWR(
    "/api/movies/all-reviewed",
    fetcher,
    { fallbackData: [] },
  );

  const reviews = useMemo(
    () =>
      sortBy(
        fetchedReviews,
        (review) => -safeDate(review.review_date).valueOf(),
      ),
    [fetchedReviews],
  );

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
      <div className="flex pb-4">
        <PageHeader text="coups de coeur" />
      </div>
      <div className="flex flex-col gap-4 lg:gap-5">
        <div className="flex border-b border-retro-gray py-4 text-xl/6 font-semibold uppercase text-retro-gray lg:border-t lg:bg-retro-green lg:px-5 lg:text-3xl/6">
          archive des critiques
        </div>
        <div className="flex lg:pl-5">
          <RetroInput
            placeholder="recherche"
            value={filter}
            setValue={setFilter}
          />
        </div>
        {filteredReviews.length !== 0 || isLoading ? null : (
          <div className="flex text-lg/5 font-medium uppercase text-retro-gray lg:pl-5 lg:text-xl/5">
            désolé, nous n&apos;avons rien trouvé qui corresponde à votre
            recherche !
          </div>
        )}
        {filteredReviews.length === 0 ? null : (
          <div className="flex grow flex-col lg:pl-5">
            {filteredReviews.map((review) => (
              <div key={review.id} className="group flex">
                <div className="flex border-r border-retro-gray pr-2 lg:pr-5">
                  <div className="w-[80px] grow gap-1 border-b border-retro-gray px-1 py-2 font-medium text-retro-black group-first:border-t group-odd:bg-retro-green lg:w-[88px] lg:px-3 lg:py-4 lg:text-lg/6 lg:group-odd:bg-white">
                    {formatDDMMYYWithDots(safeDate(review.review_date))}
                  </div>
                </div>
                <div className="flex grow border-retro-gray pl-2 lg:pl-5">
                  <div className="grow border-b border-retro-gray px-1 py-2 font-medium uppercase text-retro-black group-first:border-t group-odd:bg-retro-green lg:px-3 lg:py-4 lg:text-lg/6 lg:group-odd:bg-white">
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
        )}
      </div>
    </div>
  );
}
