"use client";

import FAQ from "@/components/client/tilmelding/FAQ";
import React from "react";
import { useTranslation } from "react-i18next";
import LocationCards from "@/components/client/home/LocationCards";

const DepartmentsPage = () => {
  const { t } = useTranslation();
  return (
    <section className="p-5 sm:p-7 w-full h-full flex flex-col gap-7 md:gap-15 xl:gap-28 justify-center items-center relative  my-7 md:my-20">
      <div className="max-w-[290px] md:max-w-[470px]">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("departmentPage.title")}
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-10 md:gap-15 xl:gap-28 mt-10">
        <LocationCards />
        <FAQ />
      </div>
    </section>
  );
};

export default DepartmentsPage;
