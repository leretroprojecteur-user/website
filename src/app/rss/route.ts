// app/rss/route.ts
import { orderBy } from "lodash-es";

import { getReviewedMovies } from "@/lib/movies";
import { Review } from "@/lib/types";
import { getImageUrl, isCoupDeCoeur, safeDate } from "@/lib/util";
import { getReviewSortKey } from "@/lib/util";

function generateRssItem(review: Review) {
  const imageUrl = getImageUrl(review);
  const reviewDate = safeDate(review.review_date);
  const pubDate = reviewDate.toJSDate().toUTCString();

  return `
    <item>
      <title><![CDATA[${review.title} (${review.year}) - ${
        review.directors
      }]]></title>
      <link>https://leretroprojecteur.com/film/${review.id}</link>
      <guid>https://leretroprojecteur.com/film/${review.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${imageUrl}" type="image/jpeg" />
      <description><![CDATA[
        <img src="${imageUrl}" alt="${
          review.title
        }" style="max-width: 100%; height: auto;"/>
        <h2>${review.title}, ${review.directors} (${review.year})</h2>
        ${review.review || ""}
      ]]></description>
    </item>
  `;
}

function generateRss(reviews: Review[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>Le Rétroprojecteur - Coups de coeur</title>
        <link>https://leretroprojecteur.com/coeur</link>
        <description>Critiques des films coups de coeur - Le Rétroprojecteur</description>
        <language>fr</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="https://leretroprojecteur.com/rss" rel="self" type="application/rss+xml"/>
        ${reviews.map(generateRssItem).join("")}
      </channel>
    </rss>
  `;
}

export async function GET() {
  // Fetch reviews
  const reviews = await getReviewedMovies();

  // Filter and sort reviews
  const coupDeCoeurReviews = reviews.filter(isCoupDeCoeur);
  const sortedReviews = orderBy(coupDeCoeurReviews, getReviewSortKey, "desc");

  // Generate RSS feed
  const rss = generateRss(sortedReviews);

  // Return the RSS feed with proper headers
  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
