"use client";

import FAQ from "@/components/client/tilmelding/FAQ";
import React from "react";
import { useTranslation } from "react-i18next";
import PricesCards from "@/components/client/home/PricesCards";

const PricesPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-0 md:gap-7 lg:gap-15 xl:gap-28 justify-center items-center relative my-7 md:my-20">
      <div className="max-w-[290px] md:max-w-[470px]">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("pricesPage.title")}
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-10 md:gap-15 xl:gap-28 mt-10">
        <PricesCards showTitle={false} />
        <FAQ />
      </div>
    </div>
  );
};

export default PricesPage;
