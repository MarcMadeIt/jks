import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const CTA = () => {
  const { t } = useTranslation();

  return (
    <section className="px-4 w-full flex justify-center bg-base-200">
      <div className="p-5 md:py-10 rounded-lg max-w-5xl w-full flex-1 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-col gap-3 mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              {t("cta.heading2")}
            </h2>
            <p className="max-w-md text-sm sm:text-base tracking-wide">
              {t("cta.text2")}
            </p>
          </div>
          <div className="justify-end">
            <Link href="/tilmelding" className="btn md:btn-lg btn-primary">
              {t(`cta.buttoncourses`)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
