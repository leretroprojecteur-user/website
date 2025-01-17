import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

import { blurProps } from "@/lib/util";

export function TwoColumnPage({
  left,
  right,
  children,
  narrow,
}: {
  left: ReactNode;
  right: ReactNode;
  children?: ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className="flex grow justify-center">
      <div
        className={clsx("flex grow flex-col lg:pl-20px", {
          "max-w-[32rem] lg:max-w-none": narrow,
        })}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col lg:w-1/2 lg:border-r lg:pr-20px">
            {left}
          </div>
          <div className="flex flex-col lg:w-1/2 lg:pl-20px">{right}</div>
        </div>
        {children}
        <div className="min-h-100px w-1/2 grow border-r" />
      </div>
    </div>
  );
}

export function ThreeColumnPage({
  header,
  children,
}: {
  header?: {
    title: string;
    type: string;
    icon: StaticImageData;
    date: string;
  };
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto my-0 block max-w-[32rem] grow wide-article:max-w-[37.5rem] lg:m-0 lg:grid lg:max-w-none lg:grid-cols-[0_32rem_1fr] lg:pl-20px 3col:grid-cols-[minmax(13rem,_1fr)_minmax(30rem,_40rem)_minmax(13rem,_1fr)] 3col:pl-0">
      {header && (
        <>
          <div className="invisible h-0 self-center justify-self-center px-30px text-center 3col:visible 3col:h-auto">
            <div className="font-semibold uppercase text-retro-gray lg:text-20px lg:leading-18px">
              {header.type}
            </div>
          </div>
          <div className="pb-20px lg:border-r lg:pr-20px">
            <div className="lg:border-b lg:pb-20px">
              <Image
                src={header.icon}
                alt={header.title}
                className="h-auto w-full"
                {...blurProps}
              />
            </div>
          </div>
          <div className="invisible h-0 self-center justify-self-center px-30px text-center lg:visible lg:h-auto">
            <div className="font-semibold uppercase text-retro-gray lg:text-20px lg:leading-18px 3col:invisible 3col:h-0">
              {header.type}
            </div>
            <div className="font-semibold uppercase text-retro-gray lg:text-20px lg:leading-18px">
              Publié le {header.date}
            </div>
          </div>
        </>
      )}
      {children}
      <div />
      <div className="pt-15px lg:border-r lg:pr-20px lg:pt-20px">
        <div className="border-b" />
      </div>
      <div />
      <div />
      <div className="hidden min-h-100px border-r lg:block" />
      <div className="min-h-100px w-1/2 border-r lg:hidden" />
      <div />
    </div>
  );
}
