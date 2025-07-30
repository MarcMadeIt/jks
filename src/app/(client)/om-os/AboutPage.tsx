"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-start md:items-center relative my-7 md:my-20">
      <div className="max-w-md md:max-w-3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {t("aboutPage.title")}
        </h1>
      </div>

      {/* Intro */}
      <section className="text-start md:text-center ">
        <p className="text-lg max-w-3xl mx-auto mb-4">
          {t("aboutPage.intro.paragraph1")}
        </p>
        <p className="text-lg max-w-3xl mx-auto">
          {t("aboutPage.intro.paragraph2")}
        </p>
      </section>

      {/* Undervisning */}
      <section className="flex flex-col-reverse md:flex-row gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {t("aboutPage.teaching.title")}
          </h2>
          <p className="text-gray-700">{t("aboutPage.teaching.p1")}</p>
          <p className="text-gray-700">{t("aboutPage.teaching.p2")}</p>
          <p className="text-gray-700">
            <strong>{t("aboutPage.teaching.p3.bold")}</strong>{" "}
            {t("aboutPage.teaching.p3.rest")}
          </p>
        </div>
        <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-md">
          <video
            src="/video/animation.mp4"
            title="Præsentationsvideo"
            controls
            className="w-full h-full"
          />
        </div>
      </section>

      {/* Morten Junker billede */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <Image
          src="/mortenjunker.jpg"
          alt={t("aboutPage.morten.alt")}
          width={600}
          height={400}
          className="rounded-lg shadow-md object-cover w-full h-auto"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {t("aboutPage.morten.title")}
          </h2>
          <p className="text-gray-700">{t("aboutPage.morten.p1")}</p>
          <p className="text-gray-700">{t("aboutPage.morten.p2")}</p>
          <Link href="/korelaererne" className="btn">
            {t("aboutPage.morten.button")}
          </Link>
        </div>
      </section>

      {/* Call to action */}
      <section className="p-5 md:p-10 bg-base-200 rounded-lg max-w-full w-full flex-1 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-col gap-3 mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              {t("aboutPage.cta.title")}
            </h2>
            <p className="max-w-md text-base tracking-wide">
              {t("aboutPage.cta.text")}
            </p>
          </div>
          <div className="justify-end">
            <Link href="/tilmelding" className="btn md:btn-lg btn-primary">
              {t("aboutPage.cta.button")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
