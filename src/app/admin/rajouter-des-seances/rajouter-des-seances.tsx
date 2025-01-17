"use client";

import React, { ReactNode, useState } from "react";

import { SearchResults, TheaterSearchResults } from "@/app/recherche/recherche";
import { Breakout, MiddleColumn } from "@/components/articles/articles";
import RetroInput from "@/components/forms/retro-input";
import { SuspenseWithLoading } from "@/components/icons/loading";
import { ThreeColumnPage } from "@/components/layout/page";
import PageHeader from "@/components/layout/page-header";
import { TextBox } from "@/components/layout/text-boxes";
import { BodyCopy, SousTitre1 } from "@/components/typography/typography";
import { SearchMovie, SearchTheater } from "@/lib/types";

import LoadingPage from "../../loading";

function Row({
  cell1,
  cell2,
  cell3,
  cell4,
}: {
  cell1: ReactNode;
  cell2: ReactNode;
  cell3: ReactNode;
  cell4: ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-x-10px">
      <div className="w-100px lg:w-250px">{cell1}</div>
      <div className="w-167px">{cell2}</div>
      <div className="w-103px">{cell3}</div>
      <div className="flex grow basis-0">{cell4}</div>
    </div>
  );
}

function SharePage() {
  return (
    <MiddleColumn>
      <BodyCopy>Merci d&apos;avoir rajouté vos séances&nbsp;!</BodyCopy>
      <div className="flex flex-col gap-y-10px pt-30px">
        <TextBox onClick={() => window.location.reload()}>
          Rajouter des nouvelles séances
        </TextBox>
        <TextBox link="/">Retour sur le site principal</TextBox>
      </div>
    </MiddleColumn>
  );
}

export default function SubmitScreenings({
  allMoviesPromise,
  allTheatersPromise,
}: {
  allMoviesPromise: Promise<SearchMovie[]>;
  allTheatersPromise: Promise<SearchTheater[]>;
}) {
  const numSubmissions = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSharePage, setShowSharePage] = useState(false);
  const handleCommentsChange = (
    event: React.ChangeEvent<{ value: string }>,
  ) => {
    setComments(event.target.value);
  };
  const [responseMessage, setResponseMessage] = useState("");
  const [rowsData, setRowsData] = useState(
    Array(numSubmissions).fill({
      movie: "",
      movie_id: "",
      date: "",
      time: "",
      note: "",
    }),
  );
  const [comments, setComments] = useState("");
  const [theaterData, setTheaterData] = useState({ name: "", theater_id: "" });

  const updateRowData = (
    index: number,
    data: {
      movie: string;
      movie_id: string;
      date: string;
      time: string;
      note: string;
    },
  ) => {
    const newRowsData = [...rowsData];
    newRowsData[index] = data;
    setRowsData(newRowsData);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const API_ENDPOINT =
        "https://europe-west1-website-cine.cloudfunctions.net/trigger_upload_data_to_db";
      // Transform the rowsData to the new format
      const transformedData = rowsData.map((row) => {
        const [year, month, day] = row.date.split("-").map(Number);
        const [hour, minute] = row.time.split(":").map(Number);
        // Check if any required field is missing or NaN
        if (!(row.movie == "" || isNaN(year) || isNaN(month) || isNaN(day))) {
          return {
            movie: row.movie,
            id: row.movie_id,
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            notes: row.note,
          };
        }
      });
      const payload = {
        collection_name: "raw-submit-screenings",
        theater_name: theaterData.name,
        theater_id: theaterData.theater_id,
        include_time_in_doc_name: false,
        key_for_doc_name: "theater_id",
        showtimes: transformedData,
        comments: comments,
      };
      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
      });
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        JSON.stringify(Object.fromEntries(response.headers), null, 2),
      );
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${responseText}`,
        );
      }
      // Format showtimes for Slack
      const showtimesText = rowsData
        .filter((row) => row.movie && row.date)
        .map((row) => `${row.movie} - ${row.date} ${row.time}`)
        .join("\n");
      const warningMessage = `*Nouvelles séances ajoutées*\n\n*Cinéma:* ${
        theaterData.name
      }\n\n*Séances:*\n${showtimesText}\n\n*Commentaires:* ${
        comments || "Aucun"
      }`;
      const slackEndpoint =
        "https://europe-west1-website-cine.cloudfunctions.net/trigger_send_warning";
      await fetch(
        `${slackEndpoint}?warning=${encodeURIComponent(
          warningMessage,
        )}&type=submit_screenings`,
        {
          method: "GET",
          mode: "cors",
        },
      );
      setResponseMessage("Données envoyées avec succès!");
      setShowSharePage(true);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error instanceof Error) {
        setResponseMessage(
          `Erreur de connexion: ${error.message}. Veuillez vérifier votre connexion internet et réessayer.`,
        );
      } else {
        setResponseMessage(
          "Une erreur inconnue est survenue. Veuillez vérifier votre connexion internet et réessayer.",
        );
      }
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <PageHeader text="Portail séances">
        <SousTitre1>Rajouter des séances à notre calendrier</SousTitre1>
      </PageHeader>
      {isSubmitting ? (
        <LoadingPage />
      ) : (
        <>
          {isSubmitting ? (
            <LoadingPage />
          ) : (
            <ThreeColumnPage>
              {showSharePage ? (
                <SharePage />
              ) : (
                <>
                  <MiddleColumn>
                    <BodyCopy>
                      Bienvenu sur notre portail de séances, utilisé par les
                      ciné-clubs, exploitants, ou autres acteurs du cinéma pour
                      rajouter des séances à notre calendrier. Si vous avez des
                      questions, n&apos;hésitez pas à{" "}
                      <a
                        className="underline"
                        href="mailto:contact@leretroprojecteur.com"
                      >
                        nous contacter
                      </a>
                      .
                    </BodyCopy>
                    <div className="py-10px">
                      <BodyCopy className="pb-5px">
                        Pour quelle salle souhaitez-vous renseigner des
                        séances&nbsp;?
                      </BodyCopy>
                      <TheaterSearch
                        allTheatersPromise={allTheatersPromise}
                        onUpdate={setTheaterData}
                      />
                    </div>
                  </MiddleColumn>
                  <Breakout>
                    <div className="border-y py-6px text-17px uppercase text-retro-gray">
                      <Row
                        cell1={<div>Film</div>}
                        cell2={<div>Date</div>}
                        cell3={<div>Horaire</div>}
                        cell4={<div>Notes (séance spéciale)</div>}
                      />
                    </div>
                    <div className="flex flex-col gap-y-5px pt-5px">
                      {rowsData.map((_, index) => (
                        <ScreeningRow
                          key={index}
                          allMoviesPromise={allMoviesPromise}
                          onUpdate={(data) => updateRowData(index, data)}
                        />
                      ))}
                    </div>
                  </Breakout>
                  <MiddleColumn>
                    <div className="flex flex-col pt-10px">
                      <BodyCopy className="pb-5px">
                        Avez-vous autre chose à signaler&nbsp;?
                      </BodyCopy>
                      <textarea
                        id="comments"
                        placeholder={"Réponse facultative".toUpperCase()}
                        value={comments}
                        onChange={handleCommentsChange}
                        className="h-[75px] resize-none p-10px"
                      />
                    </div>
                    <br />
                    <TextBox onClick={handleSubmit} className="bg-retro-green">
                      Rajoutez vos séances
                    </TextBox>
                    <BodyCopy className="pt-10px">{responseMessage}</BodyCopy>
                  </MiddleColumn>
                </>
              )}
            </ThreeColumnPage>
          )}
        </>
      )}
    </>
  );
}

function ScreeningRow({
  allMoviesPromise,
  onUpdate,
}: {
  allMoviesPromise: Promise<SearchMovie[]>;
  onUpdate: (data: {
    movie: string;
    movie_id: string;
    date: string;
    time: string;
    note: string;
  }) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieId, setMovieId] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const setSearchFind = (st: string, id: string = "") => {
    setSearchTerm(st);
    setMovieId(id);
    setShowResults(true);
    onUpdate({ movie: st, movie_id: id, date, time, note });
  };

  return (
    <Row
      cell1={
        <div className="flex grow flex-col">
          <RetroInput
            value={searchTerm}
            setValue={(st) => setSearchFind(st)}
            leftAlignPlaceholder
            customTypography
            placeholder="Recherchez un film..."
            transparentPlaceholder
          />
          <SuspenseWithLoading hideLoading={searchTerm.length === 0}>
            {showResults && (
              <SearchResults
                className="border-x px-5px py-2px"
                nbResults={5}
                searchTerm={searchTerm}
                allDataPromise={allMoviesPromise}
                onClick={(movie) => {
                  setSearchFind(
                    movie.title +
                      ", " +
                      movie.directors +
                      " (" +
                      movie.year +
                      ")",
                    movie.id,
                  );
                  setShowResults(false);
                }}
              />
            )}
          </SuspenseWithLoading>
        </div>
      }
      cell2={
        <input
          id="date"
          type="date"
          className="flex w-167px grow border"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            onUpdate({
              movie: searchTerm,
              movie_id: movieId,
              date: e.target.value,
              time,
              note,
            });
          }}
        />
      }
      cell3={
        <input
          id="time"
          type="time"
          className="flex w-103px grow border"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            onUpdate({
              movie: searchTerm,
              movie_id: movieId,
              date,
              time: e.target.value,
              note,
            });
          }}
        />
      }
      cell4={
        <input
          id="note"
          type="text"
          className="flex grow flex-col border"
          value={note}
          placeholder="Facultatif"
          onChange={(e) => {
            setNote(e.target.value);
            onUpdate({
              movie: searchTerm,
              movie_id: movieId,
              date,
              time,
              note: e.target.value,
            });
          }}
        />
      }
    />
  );
}

function TheaterSearch({
  allTheatersPromise,
  onUpdate,
}: {
  allTheatersPromise: Promise<SearchTheater[]>;
  onUpdate: (data: { name: string; theater_id: string }) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const setSearchFind = (theater: { name: string; theater_id: string }) => {
    setSearchTerm(theater.name);
    setShowResults(true);
    onUpdate(theater);
  };

  return (
    <div className="flex grow flex-col">
      <RetroInput
        value={searchTerm}
        setValue={(st) => setSearchFind({ name: st, theater_id: "" })}
        leftAlignPlaceholder
        customTypography
        placeholder="Recherchez un cinéma..."
        transparentPlaceholder
        className="flex grow"
      />
      <SuspenseWithLoading hideLoading={searchTerm.length === 0}>
        {showResults && (
          <TheaterSearchResults
            extraClass="text-left px-5px py-2px border-x border-b"
            nbResults={5}
            searchTerm={searchTerm}
            allDataPromise={allTheatersPromise}
            onClick={(theater) => {
              setSearchFind({
                name: theater.name,
                theater_id: theater.theater_id,
              });
              setShowResults(false);
            }}
          />
        )}
      </SuspenseWithLoading>
    </div>
  );
}
