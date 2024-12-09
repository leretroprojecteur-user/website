import { Metadata } from "next";

import { getMovies } from "@/lib/movies";

import MaRetro2024 from "./ma-retro-2024";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ma Rétrospective 2024",
  description: "Votez pour vos meilleures découvertes de cinéma cette annéee !",
};

export default function SubmitScreeningsPage() {
  const allMovies = getMovies();

  return <MaRetro2024 allMoviesPromise={allMovies} />;
}
