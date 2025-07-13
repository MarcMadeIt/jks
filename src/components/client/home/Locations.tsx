import LocationCards from "@/components/client/home/LocationCards";
import React from "react";
import { useTranslation } from "react-i18next";

const Locations = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full w-full bg-base-100 flex flex-col justify-center items-center">
      <h2 className="text-xl md:text-[28px] font-bold text-center mb-10">
        {t("home.locations.title")}
      </h2>
      <LocationCards />
    </div>
  );
};

export default Locations;
