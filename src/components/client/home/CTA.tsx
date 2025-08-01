import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const CTA = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full py-20 bg-base-100 flex flex-col gap-5 items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl md:text-4xl font-bold mb-4">
          {t("cta.heading")}
        </h2>
        <p className="text-sm md:text-lg max-w-xl text-center">
          {t("cta.text")}
        </p>
      </div>
      <div className="flex items-center flex-col-reverse sm:flex-row gap-4 justify-center">
        <Link href="/tilmelding" className="btn btn-primary md:btn-lg">
          {t("cta.buttoncourses")}
        </Link>
        <Link href="/korekort-forlob" className="btn btn-soft">
          {t("cta.buttonLincenseProgram")}
        </Link>
      </div>
    </section>
  );
};

export default CTA;
