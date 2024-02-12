"use client";

import { Metadata } from "next";
import { useState } from "react";

import RetroInput from "@/components/forms/retro-input";
import { TwoColumnPage } from "@/components/layout/two-column-page";
import { BodyCopy } from "@/components/typography/typography";

export const metadata: Metadata = {
  title: "Newsletter | Le Rétro Projecteur - Cinéma de patrimoine à Paris",
};

export default function NewsletterPage() {
  return <TwoColumnPage left={<Description />} right={<SignupForm />} />;
}

function Description() {
  return (
    <BodyCopy>
      Chaque semaine dans votre boîte mail quo cognito Constantius ultra
      mortalem modum exarsit ac nequo casu idem Gallus de futuris incertus
      agitare quaedam conducentia saluti suae per itinera conaretur, remoti sunt
      omnes de industria milites agentes in civitatibus perviis. Eius populus ab
      incunabulis primis ad usque pueritiae tempus extremum, quod annis
      circumcluditur fere trecentis, circummurana pertulit bella, deinde aetatem
      ingressus adultam post multiplices bellorum aerumnas.
    </BodyCopy>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [decouvert, setDecouvert] = useState("");
  return (
    <form
      action="https://leretroprojecteur.us6.list-manage.com/subscribe/post?u=00a9245e71d3375ef4542a588&amp;id=3270cdb251&amp;f_id=00e804e3f0"
      method="post"
      target="_blank"
      className="flex flex-col gap-10px lg:gap-15px"
    >
      <RetroInput
        value={email}
        setValue={setEmail}
        name="EMAIL"
        placeholder="adresse@mail.com*"
      />
      <RetroInput
        value={decouvert}
        setValue={setDecouvert}
        name="MMERGE1"
        placeholder="comment nous avez-vous découvert ?"
      />
      <input
        type="submit"
        value="s'inscrire"
        className="h-33px cursor-pointer border bg-retro-gray text-center text-15px font-medium uppercase text-white hover:bg-white hover:text-retro-gray lg:h-48px lg:text-20px"
      />
      <div className="font-medium leading-20px text-retro-gray">
        *champs obligatoires
      </div>
    </form>
  );
}