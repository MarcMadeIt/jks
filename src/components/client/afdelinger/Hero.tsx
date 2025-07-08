"use client";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  slug: "ribe" | "billund" | "grindsted";
};

const Hero = ({ slug }: Props) => {
  const { t } = useTranslation();

  const seoHero = t(`departmentPage.${slug}.hero`);
  const imageSrc = t(`departmentPage.${slug}.image`);

  return (
    <div className="relative min-h-[200px] md:min-h-[350px] flex items-center justify-center py-2">
      <div className="absolute inset-0 w-full h-full 2xl:rounded-b-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={`Baggrundsbillede for ${seoHero}`}
          fill
          className="object-cover z-0"
          priority
          quality={60}
        />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-zinc-800/70 via-zinc-800/30 to-transparent" />
      </div>
      <div className="relative z-10 text-neutral-content text-center max-w-xl lg:max-w-2xl flex flex-col justify-center items-center mx-auto">
        <h1 className=" text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-[0_0_4px_rgba(150,150,150,0.7)]">
          {seoHero}
        </h1>
      </div>
    </div>
  );
};

export default Hero;
