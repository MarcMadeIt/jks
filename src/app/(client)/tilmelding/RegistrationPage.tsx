"use client";
import CourseList from "@/components/client/tilmelding/CourseList";
import React from "react";
import { useTranslation } from "react-i18next";

const RegistrationPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col md:gap-15 justify-center items-center relative my-20">
      <div className="max-w-sm md:max-w-xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("registerPage.title")}
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-10 md:gap-15 xl:gap-28 mt-10">
        <CourseList />
      </div>
    </div>
  );
};

export default RegistrationPage;
