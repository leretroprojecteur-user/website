import { Metadata } from "next";

import { searchMovies } from "@/lib/movies";

import Recherche from "./recherche";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez un film qui passe en salle à Paris",
};

export default function RecherchePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const movies = searchMovies(query);

  return <Recherche initialQuery={query} searchPromise={movies} />;
}
