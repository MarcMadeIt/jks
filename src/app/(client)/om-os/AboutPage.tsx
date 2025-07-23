"use client";

import Image from "next/image";
import React from "react";

const AboutPage = () => {
  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Om Junkers Køreskole</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Hos Junkers Køreskole sætter vi faglighed, tryghed og personlig
          undervisning i højsædet.{" "}
          <strong>Vi elsker at køre i fede biler</strong> – og vi glæder os til
          at give dig samme glæde bag rattet. Vores mål er at give dig de bedste
          forudsætninger for at blive en sikker og ansvarlig bilist.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Kvalitet frem for alt</h2>
          <p className="text-gray-700">
            Vi tror på, at det ikke kun handler om at bestå køreprøven – det
            handler om at blive en god og sikker trafikant for livet. Derfor får
            du grundig teoriundervisning og engageret praktisk undervisning i
            øjenhøjde.
          </p>
          <p className="text-gray-700">
            Vi tilpasser forløbet efter dine behov og sørger for, at du altid
            føler dig tryg og klar til næste skridt.
          </p>
        </div>
        <Image
          src="/images/køreskole-bil.jpg"
          alt="Junkers Køreskole bil"
          width={600}
          height={400}
          className="rounded-2xl shadow-md object-cover w-full h-auto"
        />
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <Image
          src="/images/undervisning.jpg"
          alt="Teoriundervisning"
          width={600}
          height={400}
          className="rounded-2xl shadow-md object-cover w-full h-auto"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Personlig undervisning</h2>
          <p className="text-gray-700">
            Du bliver undervist af erfarne og passionerede kørelærere, der tager
            sig tid til at lære dig at kende og støtte dig gennem hele
            processen.
          </p>
          <p className="text-gray-700">
            Vi følger dig tæt fra første teoritime til du står med kørekortet i
            hånden.
          </p>
        </div>
      </section>

      <section className="bg-gray-100 p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2">Vi er her for dig</h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-6">
          Har du spørgsmål eller er du klar til at starte? Vi glæder os til at
          høre fra dig!
        </p>
        <a
          href="/kontakt"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Kontakt os
        </a>
      </section>
    </div>
  );
};

export default AboutPage;
