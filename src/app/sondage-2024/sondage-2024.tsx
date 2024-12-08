"use client";

import clsx from "clsx";
import React, { ReactNode, useState } from "react";
import { useEffect, useRef } from "react";

import { SearchResults } from "@/app/recherche/recherche";
import RetroInput from "@/components/forms/retro-input";
import { SuspenseWithLoading } from "@/components/icons/loading";
import PageHeader from "@/components/layout/page-header";
import { TextBox } from "@/components/layout/text-boxes";
import { SousTitre1, SousTitre2 } from "@/components/typography/typography";
import { SearchMovie } from "@/lib/types";

import { MiddleColumn, ThreeColumnLayout } from "../actualites/components";
import LoadingPage from "../loading";

function OpenQuestion({
  question,
  value,
  onChangeFunction,
}: {
  question: string;
  value: string;
  onChangeFunction: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col pt-20px">
      <label className="pb-5px">{question}</label>
      <textarea
        placeholder={"Réponse facultative".toUpperCase()}
        value={value}
        onChange={(e) => onChangeFunction(e.target.value)}
        className="h-[75px] resize-none p-10px"
      />
    </div>
  );
}

function TextInputBox({
  placeholder,
  value,
  onChangeFunction,
  className,
}: {
  placeholder: string;
  value: string;
  onChangeFunction: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) {
  return (
    <div className={clsx(className, "flex flex-col py-10px")}>
      <input
        value={value}
        onChange={(e) => onChangeFunction(e.target.value)}
        className="border p-10px"
        placeholder={placeholder.toUpperCase()}
      />
    </div>
  );
}

function SondageRow({ cell1, cell2 }: { cell1: ReactNode; cell2: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-10px">
      <div className="w-42px lg:w-48px">{cell1}</div>
      <div className="flex grow basis-0">{cell2}</div>
    </div>
  );
}

function MovieRow({
  index,
  allMoviesPromise,
  onUpdate,
}: {
  index: number;
  allMoviesPromise: Promise<SearchMovie[]>;
  onUpdate: (data: { movie: string; id: string }) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [_, setMovieId] = useState("");
  const [showResults, setShowResults] = useState(false);
  const setSearchFind = (st: string, id: string = "") => {
    setSearchTerm(st);
    setMovieId(id);
    setShowResults(true);
    onUpdate({ movie: st, id: id });
  };
  return (
    <SondageRow
      cell1={
        <div className="flex h-full items-center justify-center border text-center text-retro-gray">
          {index + 1}
          {index < 5 && <span className="text-retro-red">*</span>}
        </div>
      }
      cell2={
        <div className="flex grow flex-col">
          <RetroInput
            value={searchTerm}
            setValue={(st) => setSearchFind(st)}
            leftAlignPlaceholder
            customTypography
            placeholder={"Rechercher un film...".toUpperCase()}
            transparentPlaceholder
          />
          <SuspenseWithLoading hideLoading={searchTerm.length === 0}>
            {showResults && (
              <SearchResults
                className="border-x px-5px py-2px"
                nbResults={5}
                searchTerm={searchTerm}
                allDataPromise={allMoviesPromise}
                noResultsText="Nous ne trouvons pas votre film, mais vous pouvez le renseigner manuellement."
                onClick={(movie) => {
                  setSearchFind(
                    `${movie.title}, ${movie.directors} (${movie.year})`,
                    movie.id,
                  );
                  setShowResults(false);
                }}
              />
            )}
          </SuspenseWithLoading>
        </div>
      }
    />
  );
}

interface ShareableContentProps {
  rowsData: {
    movie: string;
    id: string;
  }[];
  fullName: string;
}

const BASE = {
  width: 500, // SVG width
  padding: {
    side: 20, // Side padding
    stripe: 30, // Movie stripe height
    movieGap: 7, // Gap between movies
  },
  height: {
    title: 120, // Title section height
    footer: 80, // Footer height
  },
} as const;

function ShareableContent({ rowsData, fullName }: ShareableContentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Get colors from Tailwind classes
  const getColors = () => {
    // Create temporary elements to get computed colors
    const greenEl = document.createElement("div");
    const grayEl = document.createElement("div");
    greenEl.className = "bg-retro-green";
    grayEl.className = "bg-retro-gray";
    document.body.appendChild(greenEl);
    document.body.appendChild(grayEl);

    const green = window.getComputedStyle(greenEl).backgroundColor;
    const gray = window.getComputedStyle(grayEl).backgroundColor;

    document.body.removeChild(greenEl);
    document.body.removeChild(grayEl);

    return { green, gray };
  };

  // Update scale based on container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setScale(containerWidth / BASE.width);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Draw the content whenever scale changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = getColors();
    const filteredMovies = rowsData.filter((row) => row.movie !== "");
    const moviesHeight =
      filteredMovies.length * (BASE.padding.movieGap + BASE.padding.stripe);
    const totalHeight = BASE.height.title + moviesHeight + BASE.height.footer;

    // Set canvas dimensions with scaling
    canvas.width = BASE.width * scale;
    canvas.height = totalHeight * scale;
    ctx.scale(scale, scale);

    // Draw background
    ctx.fillStyle = colors.green;
    ctx.fillRect(0, 0, BASE.width, totalHeight);

    // Draw header
    ctx.fillStyle = colors.gray;
    ctx.font = "bold 14px degular";
    ctx.textAlign = "left";
    ctx.fillText("TOP 2024", BASE.padding.side, 26);

    // Draw title
    ctx.fillStyle = colors.gray;
    ctx.font = "bold 40px degular";
    ctx.textAlign = "center";
    ctx.fillText("MA RÉTRO", BASE.width / 2, 40);
    ctx.fillText("2024", BASE.width / 2, 75); // Adjusted for leading-35px

    // Draw right header text
    ctx.textAlign = "right";
    ctx.font = "bold 14px degular";
    ctx.fillText(
      fullName ? `PAR ${fullName.toUpperCase()}` : "#MARÉTRO",
      BASE.width - BASE.padding.side,
      26,
    );

    // Draw movies
    filteredMovies.forEach((movie, index) => {
      const yPos =
        BASE.height.title +
        index * (BASE.padding.movieGap + BASE.padding.stripe);

      // Draw stripe (90% width, centered)
      ctx.fillStyle = colors.gray;
      const stripeWidth = BASE.width * 1; // 90% of total width
      const stripeX = (BASE.width - stripeWidth) / 2; // Center the stripe
      ctx.fillRect(stripeX, yPos, stripeWidth, BASE.padding.stripe);

      // Draw text
      ctx.fillStyle = colors.green;
      ctx.font = "bold 16px degular";
      ctx.textAlign = "center";
      ctx.fillText(
        `${index + 1}. ${movie.movie}`,
        BASE.width / 2,
        yPos + BASE.padding.stripe / 2 + 6,
      );
    });

    // Draw footer text
    ctx.fillStyle = colors.gray;
    ctx.textAlign = "left";
    ctx.font = "bold 14px degular";
    ctx.fillText("TOP 2024", BASE.padding.side, totalHeight - 20);

    // Load and draw logo
    const logo = new Image();
    logo.src = "/img/logo-gray.png";
    logo.onload = () => {
      ctx.drawImage(logo, BASE.width / 2 - 78.5, totalHeight - 55, 157, 40);
    };

    // Draw right footer text
    ctx.textAlign = "right";
    ctx.fillText("#MARÉTRO", BASE.width - BASE.padding.side, totalHeight - 20);
  }, [scale, rowsData, fullName]);

  return (
    <div ref={containerRef} className="w-full lg:w-500px">
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
    </div>
  );
}

function SharePage({ rowsData, fullName }: ShareableContentProps) {
  const handleDownload = () => {
    const canvas = document.querySelector(
      "#shareableContent canvas",
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "ma-retro-2024.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <>
      <div id="shareableContent" className="flex justify-center pb-20px">
        <ShareableContent rowsData={rowsData} fullName={fullName} />
      </div>
      <div className="border-t py-20px">
        Merci pour votre participation&nbsp;! N&apos;hésitez pas à partager
        votre rétrospective 2024 et à encourager vos ami.e.s à venir
        voter&nbsp;!
      </div>
      <div className="flex flex-col gap-y-10px">
        <TextBox link="/sondage-2024">Modifier ma rétrospective</TextBox>
        <TextBox onClick={handleDownload}>Télécharger ma rétrospective</TextBox>
      </div>
    </>
  );
}

export default function Sondage2024({
  allMoviesPromise,
}: {
  allMoviesPromise: Promise<SearchMovie[]>;
}) {
  const numSubmissions = 10;
  const [responseMessage, setResponseMessage] = useState("");
  const [rowsData, setRowsData] = useState(
    Array(numSubmissions).fill({
      movie: "",
      id: "",
    }),
  );
  const [fullName, setFullName] = useState("");
  const [showSharePage, setShowSharePage] = useState(false);
  const [real, setReal] = useState("");
  const [nombreDeFois, setNombreDeFois] = useState("");
  const [autreInformation, setAutreInformation] = useState("");
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateRowData = (
    index: number,
    data: {
      movie: string;
      id: string;
    },
  ) => {
    const newRowsData = [...rowsData];
    newRowsData[index] = data;
    setRowsData(newRowsData);
  };
  const handleSubmit = async () => {
    // Check if at least one movie has been filled
    const hasAtLeastTwoMovies =
      rowsData.filter((row) => row.movie.trim() !== "").length >= 2;
    if (!hasAtLeastTwoMovies) {
      setResponseMessage("Veuillez sélectionner au moins deux films.");
      return;
    }
    setIsSubmitting(true);
    try {
      const API_ENDPOINT =
        "https://europe-west1-website-cine.cloudfunctions.net/trigger_upload_poll_data_to_db";
      const transformedData = rowsData
        .filter((row) => row.movie !== "")
        .map((row) => ({
          movie: row.movie,
          id: row.id,
        }));
      const payload = {
        collection_name: "sondage-2024",
        votes: transformedData,
        director_requests: real,
        cinema_visits: nombreDeFois,
        additional_feedback: autreInformation,
        full_name: fullName,
        email: email,
        newsletter_signup: newsletter,
      };
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setResponseMessage("Données envoyées avec succès!");
      setShowSharePage(true);
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Erreur lors de l'envoi. Veuillez réessayer.");
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <PageHeader text="Ma Rétro 2024">
        <SousTitre1>Votez pour vos meilleures ressorties cinéma</SousTitre1>
      </PageHeader>
      {isSubmitting ? (
        <LoadingPage />
      ) : (
        <ThreeColumnLayout>
          <MiddleColumn>
            {showSharePage ? (
              <SharePage rowsData={rowsData} fullName={fullName} />
            ) : (
              <>
                {/* Name */}
                <TextInputBox
                  placeholder="Votre nom/pseudo (facultatif)"
                  value={fullName}
                  onChangeFunction={setFullName}
                  className="pb-20px"
                />
                {/* Top */}
                <div className="flex flex-col gap-y-10px">
                  <div className="border-y bg-retro-green uppercase">
                    <SondageRow
                      cell1={
                        <div className="py-6px text-center font-bold lg:py-17px">
                          <SousTitre2>#</SousTitre2>
                        </div>
                      }
                      cell2={
                        <div className="py-6px text-center font-bold lg:py-17px">
                          <SousTitre2>Film</SousTitre2>
                        </div>
                      }
                    />
                  </div>
                  {rowsData.map((_, index) => (
                    <MovieRow
                      key={index}
                      index={index}
                      allMoviesPromise={allMoviesPromise}
                      onUpdate={(data) => updateRowData(index, data)}
                    />
                  ))}
                </div>
                <div className="pt-10px">
                  {/* Additional Questions */}
                  <OpenQuestion
                    question="Y a-t-il des films ou des réalisateurs·rices en particulier que vous aimeriez voir plus souvent programmé·e·s en salle&nbsp;?"
                    value={real}
                    onChangeFunction={setReal}
                  />
                  <OpenQuestion
                    question="À combien estimez-vous le nombre de fois où vous êtes allé·e·s voir un film en ressortie au cinéma cette année&nbsp;?"
                    value={nombreDeFois}
                    onChangeFunction={setNombreDeFois}
                  />
                  <OpenQuestion
                    question="Des retours supplémentaires sur notre projet ou sur notre site web&nbsp;?"
                    value={autreInformation}
                    onChangeFunction={setAutreInformation}
                  />
                  {/* Newsletter Signup */}
                  <div className="flex flex-col py-30px">
                    <div className="flex items-start gap-x-10px">
                      <div
                        onClick={() => setNewsletter(!newsletter)}
                        className={clsx(
                          "tw-ring-color-black flex h-42px min-w-42px cursor-pointer items-center justify-center border accent-black lg:h-48px lg:min-w-48px",
                          newsletter ? "bg-retro-blue" : "text-retro-blue",
                        )}
                      >
                        {newsletter && <p className="text-retro-gray">✓</p>}
                      </div>
                      <label className="border bg-retro-blue p-5px px-12px py-8px uppercase text-retro-gray">
                        Je souhaite m&apos;inscrire à «&nbsp;Up Close&nbsp;», la
                        newsletter hebdomadaire du Rétro Projecteur pour
                        recevoir l&apos;actualité des ressorties cinéma chaque
                        semaine&nbsp;!
                      </label>
                    </div>
                    {newsletter && (
                      <TextInputBox
                        placeholder="Votre adresse email*"
                        value={email}
                        onChangeFunction={setEmail}
                      />
                    )}
                  </div>
                </div>
                <TextBox
                  onClick={handleSubmit}
                  className="bg-retro-gray text-retro-white"
                >
                  Envoyer mon top 2024&nbsp;!
                </TextBox>
                <p className="mt-4 font-bold">{responseMessage}</p>
              </>
            )}
          </MiddleColumn>
        </ThreeColumnLayout>
      )}
    </>
  );
}
