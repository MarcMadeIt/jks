"use client";

import React, { useEffect, useState } from "react";
import { getPackages } from "@/lib/server/actions";
import { FaAngleRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

// Define a Package interface
interface Package {
  id: string;
  title: string;
  price: number;
  desc: string;
}

interface SetupPackagesListProps {
  onViewDetails: (pkg: Package) => void;
}

const SetupPackagesList = ({ onViewDetails }: SetupPackagesListProps) => {
  const { t } = useTranslation();

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const { packs } = await getPackages();
        setPackages(packs);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-spinner loading-md h-24"></span>
        {t("loading_packages")}
      </div>
    );
  }

  return (
    <ul className="list w-full gap-2">
      {packages.map((packageItem) => (
        <li
          key={packageItem.id}
          className="list-row flex justify-between items-center p-4 w-full "
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">{packageItem.title}</h3>
          </div>
          <div>
            <button
              className="btn btn-sm btn-neutral btn-soft"
              onClick={() => onViewDetails(packageItem)}
            >
              <span className="md:flex hidden">{t("details")}</span>
              <FaAngleRight />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SetupPackagesList;
