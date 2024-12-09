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
        <div className="flex h-full items-center justify-center border text-center text-retro-bordeaux">
          {index + 1}
          {index < 5 && <span className="text-retro-bordeaux">*</span>}
        </div>
      }
      cell2={
        <div className="flex grow flex-col">
          <RetroInput
            value={searchTerm}
            setValue={(st) => setSearchFind(st)}
            blue={true}
            leftAlignPlaceholder
            customTypography
            placeholder={"Rechercher un film...".toUpperCase()}
            transparentPlaceholder
          />
          <SuspenseWithLoading hideLoading={searchTerm.length === 0}>
            {showResults && (
              <SearchResults
                altColor="retro-blue"
                className="border-x px-5px py-2px"
                nbResults={5}
                searchTerm={searchTerm}
                allDataPromise={allMoviesPromise}
                noResultsText="Nous ne trouvons pas votre film, mais vous pouvez le renseigner manuellement."
                lowercase={true}
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
  width: 500,
  padding: 20,
  stripe: {
    paddingX: 10,
    paddingY: 5,
    height: 40, // Explicit height for each movie stripe
  },
  height: {
    title: 120,
    footer: 120, // Increased footer height to ensure visibility
  },
} as const;

// Corner text configuration
const CORNER_TEXT = {
  style: {
    fontSize: 20, // Now using a number for fontSize
    fontWeight: "semibold",
    fontFamily: "system-ui",
    color: "text-retro-blue",
  },
  position: {
    topOffset: 26,
    bottomOffset: 40, // Increased to make bottom text more visible
    sideOffset: 20,
  },
  content: {
    topLeft: "TOP 2024",
    bottomLeft: "TOP 2024",
    bottomRight: "#MARÉTRO2024",
  },
} as const;

function ShareableContent({ rowsData, fullName }: ShareableContentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Get colors from Tailwind classes
  const getColors = () => {
    const bordeauxEl = document.createElement("div");
    const blueEl = document.createElement("div");
    bordeauxEl.className = "bg-retro-bordeaux";
    blueEl.className = CORNER_TEXT.style.color.replace("text-", "bg-");
    document.body.appendChild(bordeauxEl);
    document.body.appendChild(blueEl);

    const bordeaux = window.getComputedStyle(bordeauxEl).backgroundColor;
    const blue = window.getComputedStyle(blueEl).backgroundColor;

    document.body.removeChild(bordeauxEl);
    document.body.removeChild(blueEl);

    return { bordeaux, blue };
  };

  const drawCornerText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    align: CanvasTextAlign,
  ) => {
    // Construct the font string properly
    ctx.font = `${CORNER_TEXT.style.fontWeight} ${CORNER_TEXT.style.fontSize}px ${CORNER_TEXT.style.fontFamily}`;
    ctx.textAlign = align;
    // Add underline
    ctx.textDecoration = "underline";
    ctx.fillText(text.toUpperCase(), x, y);

    // Manual underline since textDecoration doesn't work in canvas
    const metrics = ctx.measureText(text.toUpperCase());
    const lineWidth = metrics.width;
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (align === "left") {
      ctx.moveTo(x, y + 3);
      ctx.lineTo(x + lineWidth, y + 3);
    } else if (align === "right") {
      ctx.moveTo(x - lineWidth, y + 3);
      ctx.lineTo(x, y + 3);
    }
    ctx.stroke();
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

    // Calculate total height with explicit sections
    const titleSectionHeight = BASE.height.title; // 120px
    const contentHeight = filteredMovies.length * 40; // 40px per movie
    const footerSectionHeight = BASE.height.footer; // 80px
    const totalHeight =
      titleSectionHeight + contentHeight + footerSectionHeight;

    console.log({
      titleSectionHeight,
      contentHeight,
      footerSectionHeight,
      totalHeight,
      moviesCount: filteredMovies.length,
    });

    // Set canvas dimensions with scaling
    canvas.width = BASE.width * scale;
    canvas.height = totalHeight * scale;
    ctx.scale(scale, scale);

    // Draw background
    ctx.fillStyle = colors.bordeaux;
    ctx.fillRect(0, 0, BASE.width, totalHeight);

    // Set color for all corner text
    ctx.fillStyle = colors.blue;

    // Draw corner texts
    drawCornerText(
      ctx,
      CORNER_TEXT.content.topLeft,
      CORNER_TEXT.position.sideOffset,
      CORNER_TEXT.position.topOffset,
      "left",
    );

    drawCornerText(
      ctx,
      fullName ? `PAR ${fullName}` : CORNER_TEXT.content.bottomRight,
      BASE.width - CORNER_TEXT.position.sideOffset,
      CORNER_TEXT.position.topOffset,
      "right",
    );

    // Draw title
    ctx.fillStyle = colors.blue;
    ctx.font = "bold 40px degular";
    ctx.textAlign = "center";
    ctx.fillText("MA RÉTRO", BASE.width / 2, 45);
    ctx.fillText("2024", BASE.width / 2, 80);

    // Draw movies section
    const moviesStart = BASE.height.title;
    const moviesLinewidth = 1.25;
    const moviesHeight =
      filteredMovies.length * BASE.stripe.height +
      (filteredMovies.length - 1) * length * moviesLinewidth;
    const moviesEnd = moviesStart + moviesHeight;

    // Draw movies background
    ctx.fillStyle = colors.blue;
    ctx.fillRect(0, moviesStart, BASE.width, moviesHeight);

    // Draw movies with proper spacing
    filteredMovies.forEach((movie, index) => {
      const yPos =
        2 +
        BASE.stripe.height / 2 +
        moviesStart +
        index * (BASE.stripe.height + moviesLinewidth);
      ctx.fillStyle = colors.bordeaux;
      ctx.font = "normal 16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${index + 1}. ${movie.movie}`, BASE.width / 2, yPos);

      if (index < filteredMovies.length - 1) {
        ctx.strokeStyle = colors.bordeaux;
        ctx.lineWidth = moviesLinewidth;
        ctx.beginPath();
        ctx.moveTo(BASE.padding, yPos + BASE.stripe.height / 2);
        ctx.lineTo(BASE.width - BASE.padding, yPos + BASE.stripe.height / 2);
        ctx.stroke();
      }
    });

    // Calculate footer positions
    const footerStart = moviesEnd;
    const logoHeight = 40;
    const logoWidth = 157;
    const logoY = footerStart + (BASE.height.footer - logoHeight) / 2;
    const bottomTextY = footerStart + BASE.height.footer - 20; // Position text below logo

    // Draw bottom corner texts
    ctx.fillStyle = colors.blue;
    drawCornerText(
      ctx,
      CORNER_TEXT.content.bottomLeft,
      CORNER_TEXT.position.sideOffset,
      bottomTextY,
      "left",
    );

    // Load and draw logo centered in footer
    const logo = new Image();
    logo.src = "/img/logo-blue.png";
    logo.onload = () => {
      ctx.drawImage(
        logo,
        BASE.width / 2 - logoWidth / 2,
        logoY,
        logoWidth,
        logoHeight,
      );
    };

    // Draw bottom right text
    drawCornerText(
      ctx,
      CORNER_TEXT.content.bottomRight,
      BASE.width - CORNER_TEXT.position.sideOffset,
      bottomTextY,
      "right",
    );
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
        <TextBox link="/ma-retro-2024">Modifier ma rétrospective</TextBox>
        <TextBox onClick={handleDownload}>Télécharger ma rétrospective</TextBox>
      </div>
    </>
  );
}

export default function MaRetro2024({
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
                  <div className="border-y bg-retro-blue uppercase">
                    <SondageRow
                      cell1={
                        <div className="retro-bordeaux py-6px text-center font-bold lg:py-17px">
                          <SousTitre2 textColor="retro-bordeaux">#</SousTitre2>
                        </div>
                      }
                      cell2={
                        <div className="py-6px text-center font-bold lg:py-17px">
                          <SousTitre2 textColor="retro-bordeaux">
                            Film
                          </SousTitre2>
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
