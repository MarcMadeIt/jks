"use client";

import React from "react";
import SetupPackagesList from "./SetupPackagesList";
import { useTranslation } from "react-i18next";

interface SetupPackagesProps {
  onDetails: (pkg?: unknown) => void;
}

const SetupPackages = ({ onDetails }: SetupPackagesProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-xl">{t("setup.packages")}</h3>

      <div className="flex flex-col items-start gap-5">
        <SetupPackagesList
          onViewDetails={(packageId) => onDetails(packageId)}
        />
      </div>
    </div>
  );
};

export default SetupPackages;
