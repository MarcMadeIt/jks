import Link from "next/link";
import React from "react";

const CTA = () => {
  return (
    <section className="w-full py-20 bg-base-100 flex flex-col gap-5 items-center justify-center px-4">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Klar til at tage kørekort?
        </h2>
        <p className="md:text-lg max-w-xl text-center">
          Vi er klar til at hjælpe dig godt i gang. Tilmeld dig et hold – eller
          læs mere om hvordan forløbet foregår.
        </p>
      </div>
      <div className="flex items-center flex-col sm:flex-row gap-4 justify-center">
        <Link href="/tilmelding" className="btn btn-primary md:btn-lg">
          Se hold og tilmeld dig
        </Link>
        <Link href="/korekort-forlob" className="btn btn-soft ">
          Læs om kørekortforløbet
        </Link>
      </div>
    </section>
  );
};

export default CTA;
