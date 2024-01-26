"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

import { useCalendrierStore } from "@/lib/calendrier-store";
import { openMenu } from "@/lib/menu-store";

import logoAnime from "../../assets/logo-anime.gif";
import BurgerIcon from "../menu/burger-icon";

export default function TopBar() {
  const onClickLogo = useCallback(() => {
    useCalendrierStore.getState().reset();
  }, []);

  return (
    <div className="relative flex grow items-center">
      <div className="absolute cursor-pointer" onClick={openMenu}>
        <BurgerIcon />
      </div>
      <div className="flex grow justify-center">
        <Link href="/" onClick={onClickLogo}>
          <Image src={logoAnime} alt="logo" className="w-225px" />
        </Link>
      </div>
    </div>
  );
}
