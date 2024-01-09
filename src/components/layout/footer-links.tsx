import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

import { ButtonCopy } from "../typography/typography";

export default function FooterLinks({
  color,
  bigLineHeight,
}: {
  color: "gray" | "black";
  newsletterGreen?: boolean;
  bigLineHeight: boolean;
}) {
  return (
    <div className="gap-y-10px flex grow flex-col">
      <LinkBox color={color} bigLineHeight={bigLineHeight} bgGreen>
        <Link href="/newsletter">newsletter</Link>
      </LinkBox>
      <LinkBox color={color} bigLineHeight={bigLineHeight}>
        <a href="https://www.instagram.com/leretroprojecteur" target="_blank">
          instagram
        </a>
      </LinkBox>
      <LinkBox color={color} bigLineHeight={bigLineHeight}>
        <a href="https://twitter.com/RetroProjecteur" target="_blank">
          twitter
        </a>
      </LinkBox>
    </div>
  );
}

function LinkBox({
  children,
  bigLineHeight,
  color,
  bgGreen,
}: {
  children: ReactNode;
  bigLineHeight: boolean;
  color: "gray" | "black";
  bgGreen?: boolean;
}) {
  return (
    <div
      className={clsx("py-12px flex justify-center border", {
        "bg-retro-green": bgGreen ?? false,
      })}
    >
      <div
        className={clsx("grow whitespace-break-spaces text-center", {
          "text-retro-gray": color === "gray",
          "text-retro-black": color === "black",
        })}
      >
        <ButtonCopy className="font-semibold">{children}</ButtonCopy>
      </div>
    </div>
  );
}
