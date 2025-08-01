"use client";

import React from "react";
import StepsMenu from "@/components/client/steps/StepsMenu";
import StepsContent from "@/components/client/steps/StepsContent";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const StepsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center px-4 gap-5 md:px-12">
      <div className="flex gap-10 w-full max-w-7xl">
        <StepsMenu />
        <StepsContent />
      </div>
    </div>
  );
};

export default StepsPage;
