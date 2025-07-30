"use client";
import InfoCards from "@/components/client/infomation/InfoCards";
import { useTranslation } from "next-i18next";

const InfoPage = () => {
  const { t } = useTranslation();

  return (
    <section className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-7 md:my-20">
      <div className="flex flex-col items-center gap-5 max-w-3xl">
        <div className="max-w-md md:max-w-xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            {t("infoPage.title")}
          </h1>
        </div>
        <p className="text-lg text-gray-700 text-center">
          {t("infoPage.description")}
        </p>
      </div>
      <InfoCards />
    </section>
  );
};

export default InfoPage;
