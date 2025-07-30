"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const AboutPage = () => {
  return (
    <div className="p-5 sm:p-10 w-full max-w-6xl mx-auto flex flex-col gap-20">
      {/* Intro */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-6">Om Junkers Køreskole</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-4">
          Junkers Køreskole blev stiftet af Morten Hede Junker i november 2017
          med første afdeling i Grindsted. Kort efter begyndte vi at undervise
          elever fra Billund, og siden har vi med succes hjulpet over 1.000
          elever.
        </p>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          I 2024 overtog vi Køreskolen Ribe og skabte{" "}
          <strong>Junkers Kørekort Ribe</strong> – en udvidelse af vores
          engagement i at levere personlig og faglig stærk undervisning.
        </p>
      </section>

      {/* Undervisning */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Sjov, tryg og lærerig undervisning
          </h2>
          <p className="text-gray-700">
            Det skal være sjovt og lærerigt at tage kørekort. Vi vægter det
            sociale miljø højt, så du føler dig godt tilpas under hele forløbet.
          </p>
          <p className="text-gray-700">
            Vi tror på, at det bedste læringsmiljø opstår, når undervisningen er
            en oplevelse. Derfor gør vi meget ud af at engagere og motivere hver
            enkelt elev.
          </p>
          <p className="text-gray-700">
            <strong>Vi elsker at køre i fede biler</strong> – og vi glæder os
            til at give dig den samme glæde bag rattet.
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
          src="/mortenjunker.jpg" // ← udskift med korrekt sti
          alt="Morten Junker – indehaver"
          width={600}
          height={400}
          className="rounded-lg shadow-md object-cover w-full h-auto"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Mød Morten Junker</h2>
          <p className="text-gray-700">
            Morten er indehaver af Junkers Køreskole og underviser i både bil
            (B) og motorcykel (A). Med passion for undervisning og engagement i
            hver enkelt elev har han skabt en køreskole, du aldrig glemmer.
          </p>
          <p className="text-gray-700">
            I dag består teamet af seks dygtige kørelærere, som underviser i B,
            BE og A.
          </p>
          <Link href="/korelaererne" className="btn">
            Mød alle kørelærerne
          </Link>
        </div>
      </section>

      {/* Call to action */}
      <section className="p-5 md:p-10 bg-base-200 rounded-lg max-w-full w-full flex-1 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-col gap-3 mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              Klar til at tage kørekort?
            </h2>
            <p className="max-w-md text-base tracking-wide">
              Tag første skridt. Se vores kommende hold og tilmeld dig, når du
              er klar – vi hjælper dig godt på vej.
            </p>
          </div>
          <div className="justify-end">
            <Link href="/tilmelding" className="btn md:btn-lg btn-primary">
              Tilmeld dig nu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
