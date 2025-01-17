import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

import PageHeader from "@/components/layout/page-header";
import { TextBox } from "@/components/layout/text-boxes";
import {
  SectionTitle,
  SousTitre1,
  SubsectionTitle,
} from "@/components/typography/typography";
import { blurProps } from "@/lib/util";

import { ThreeColumnPage } from "../layout/page";

export function ArticleLayout({
  info,
  children,
}: {
  info: {
    title: string;
    type: string;
    icon: StaticImageData;
    date: string;
  };
  children?: ReactNode;
}) {
  return (
    <>
      <PageHeader text="actualités">
        <SousTitre1>{info.title}</SousTitre1>
      </PageHeader>
      <ThreeColumnPage header={info}>{children}</ThreeColumnPage>
    </>
  );
}

export function Breakout({ children }: { children: ReactNode }) {
  return (
    <div className="breakout-section py-10px lg:col-span-3 3col:pl-20px">
      {children}
    </div>
  );
}

export function MiddleColumn({ children }: { children: ReactNode }) {
  return (
    <>
      <div />
      <div className="lg:border-r lg:pr-20px">
        <div>{children}</div>
      </div>
      <div />
    </>
  );
}

export function MiddleColumnImageAndRightColumnCaption({
  image,
  alt,
  caption,
}: {
  image: StaticImageData;
  alt: string;
  caption: ReactNode;
}) {
  return (
    <>
      <div />
      <div className="lg:border-r lg:pr-20px">
        <div className="py-10px lg:py-30px">
          <Image src={image} alt={alt} className="w-full" {...blurProps} />
        </div>
      </div>
      <div className="self-end lg:pl-20px">
        <div className="pb-10px text-center text-14px font-semibold uppercase leading-17px text-retro-gray lg:pb-30px lg:text-left lg:text-16px lg:leading-19px">
          {caption}
        </div>
      </div>
    </>
  );
}

export function MiddleColumnImageAndTitle({
  image,
  alt,
  title,
}: {
  image: StaticImageData;
  alt: string;
  title: ReactNode;
}) {
  return (
    <div className="pb-10px">
      <Image src={image} alt={alt} className="w-full pb-10px" {...blurProps} />
      <SubsectionTitle>{title}</SubsectionTitle>
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return (
    <div className="group pb-30px last:pb-0 lg:pb-50px last:lg:pb-0">
      {children}
    </div>
  );
}

export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div className="pb-15px lg:pb-20px">
      <SectionTitle>{children}</SectionTitle>
    </div>
  );
}

export function Question({ children }: { children: ReactNode }) {
  return (
    <div className="pt-20px">
      <strong>{children}</strong>
    </div>
  );
}
export function Answer({ children }: { children: ReactNode }) {
  return <div className="space-y-5px pt-5px">{children}</div>;
}

export function CTAs({ ctas }: { ctas: { link: string; text: ReactNode }[] }) {
  return (
    <>
      <div className="py-15px lg:py-20px">
        <div className="border-b" />
      </div>
      <div className="mx-auto flex w-[75%] flex-col gap-y-10px lg:w-[50%]">
        {ctas.map((cta, i) => (
          <TextBox key={i} className="bg-retro-blue" link={cta.link}>
            {cta.text}
          </TextBox>
        ))}
      </div>
    </>
  );
}
