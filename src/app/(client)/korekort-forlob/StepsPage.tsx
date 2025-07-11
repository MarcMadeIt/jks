"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import StepsMenu from "@/components/client/steps/StepsMenu";
import StepsContent from "@/components/client/steps/StepsContent";

const StepsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center px-4 md:px-12">
      <div className="flex gap-5 w-full max-w-7xl">
        <StepsMenu />
        <StepsContent />
      </div>
    </div>
  );
};

export default StepsPage;
