"use client";

import React, { Fragment, useCallback, useEffect } from "react";
import { create } from "zustand";

import { Results } from "@/app/recherche/recherche";
import RetroInput from "@/components/forms/retro-input";
import { SuspenseWithLoading } from "@/components/icons/loading";
import PageHeader from "@/components/layout/page-header";
import { SousTitre1 } from "@/components/typography/typography";
import { SearchMovie } from "@/lib/types";

const useRechercheStore = create<{
  selected: number | undefined;
  searchTerm: string;
}>()(() => ({
  searchTerm: "",
  selected: undefined,
}));

const setSelected = (selected: number | undefined) =>
  useRechercheStore.setState({ selected });
const setSearchTerm = (searchTerm: string) =>
  useRechercheStore.setState({ searchTerm });

export default function SubmitScreenings({
  allMoviesPromise,
}: {
  allMoviesPromise: Promise<SearchMovie[]>;
}) {
  const numSubmissions = 5;
  const inputs = Array.from(Array(numSubmissions).keys());

  useEffect(() => {
    setSelected(undefined);
    setSearchTerm("");
  }, []);
  const onChangeSearchTerm = useCallback((s: string) => {
    setSelected(undefined);
    setSearchTerm(s);
  }, []);
  const searchTerm = useRechercheStore((s) => s.searchTerm);

  return (
    <>
      <PageHeader text="Rajouter des séances">
        <SousTitre1>Le Méliès Montreuil</SousTitre1>
      </PageHeader>
      <div className="flex grow flex-col pb-10px lg:pl-20px">
        <strong>Instructions&nbsp;:</strong>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
        <br />
        <br />
        <div style={{ textAlign: "center", padding: "5px" }}>
          <form>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            ></div>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Film</th>
                  <th style={{ width: "10%" }}>Date</th>
                  <th style={{ width: "5%" }}>Horaire</th>
                  <th style={{ width: "45%" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {inputs.map((k) => (
                  <Fragment key={k}>
                    <tr style={{ backgroundColor: "var(--white)" }}>
                      <td className="py-5px">
                        <div className={"flex grow flex-col"}>
                          <RetroInput
                            value={searchTerm}
                            setValue={onChangeSearchTerm}
                            leftAlignPlaceholder
                            customTypography
                            placeholder="Recherchez un film..."
                            transparentPlaceholder
                            className={"flex grow"}
                          />
                          <SuspenseWithLoading
                            hideLoading={searchTerm.length === 0}
                          >
                            <Results
                              nb_results={5}
                              {...{ searchTerm, allMoviesPromise }}
                            />
                          </SuspenseWithLoading>
                        </div>
                      </td>
                      <td className="py-5px" style={{ verticalAlign: "top" }}>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="flex h-42px grow lg:h-48px"
                        />
                      </td>
                      <td className="py-5px" style={{ verticalAlign: "top" }}>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          className="flex h-42px grow lg:h-48px"
                        />
                      </td>
                      <td className="flex grow py-5px">
                        <input
                          type="text"
                          className="flex h-42px grow lg:h-48px"
                        />
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                alignItems: "center",
              }}
            >
              <label htmlFor="comments">
                {" "}
                Avez-vous autre chose à signaler&nbsp;?
              </label>
              <textarea
                value=""
                rows={5}
                style={{
                  fontSize: "15px",
                  wordWrap: "break-word",
                  width: "min(95%, 400px)",
                  height: "100px",
                  padding: "5px",
                }}
              />
            </div>
          </form>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>
            <button
              style={{
                fontSize: "16px",
                padding: "15px",
                backgroundColor: "#E2FF46",
                color: "black",
                border: "1",
                borderColor: "black",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Envoyez vos séances&nbsp;!
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
