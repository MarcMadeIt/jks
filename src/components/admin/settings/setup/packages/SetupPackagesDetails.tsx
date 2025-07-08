"use client";

import React, { useEffect, useState } from "react";
import SetupJobsDetailsActions from "./SetupPackagesDetailsActions";
import SetupPackagesEdit from "./SetupPackagesEdit";
import { getPackageById, getFeaturesByPackageId } from "@/lib/server/actions";
import { FaAngleLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface Package {
  id: string;
  title: string;
  price: number;
  desc: string;
}

interface Feature {
  id: string;
  label: string;
  title: string;
  description: string;
  price: number;
  override_price?: number;
  created_at?: string;
}

interface SetupPackagesDetailsProps {
  packageId: string;
  onBack: () => void;
  onDelete: () => void;
}

const SetupPackagesDetails = ({
  packageId,
  onBack,
  onDelete,
}: SetupPackagesDetailsProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateToast, setUpdateToast] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [packageData, featuresData] = await Promise.all([
          getPackageById(packageId),
          getFeaturesByPackageId(packageId),
        ]);
        setPkg(packageData);
        setFeatures(featuresData);
      } catch (err) {
        console.error("Failed to load package or features:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [packageId]);

  const handleSave = (updatedPackage: Package) => {
    setPkg(updatedPackage);
    setUpdateToast(true);
    setTimeout(() => setUpdateToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="w-full h-52 flex items-center justify-center gap-2">
        <span className="loading loading-spinner loading-md h-40" />
        {t("packageDetails.loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {isEditing ? (
        <SetupPackagesEdit
          packageId={packageId}
          onSave={(packageData) => {
            const updatedPackage: Package = {
              ...pkg!,
              ...packageData,
            };
            handleSave(updatedPackage);
          }}
          onBackToDetails={() => setIsEditing(false)}
          onBack={onBack}
        />
      ) : (
        <div className="flex flex-col gap-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="btn btn-ghost">
              <FaAngleLeft />
              {t("back")}
            </button>
            <SetupJobsDetailsActions
              onEdit={() => setIsEditing(true)}
              packageId={packageId}
              onDelete={onDelete}
            />
          </div>

          <h1 className="text-xl font-semibold">{t("packageDetails.title")}</h1>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-400">
              {t("packageDetails.fields.title")}
            </p>
            <span className="font-semibold">
              {pkg?.title || t("packageDetails.fields.unknown")}
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-400">
              {t("packageDetails.fields.price")}
            </p>
            <span className="font-semibold">{pkg?.price} DKK</span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-400">
              {t("packageDetails.fields.desc")}
            </p>
            <span className="font-semibold whitespace-pre-line">
              {pkg?.desc || t("packageDetails.fields.unknown")}
            </span>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-5">
            <span className="text-xs font-medium text-gray-400">
              {t("packageDetails.features.title")}
            </span>

            <ul className="list w-full flex flex-col gap-3">
              {features.length > 0 ? (
                features.map((feature) => (
                  <li
                    key={feature.id}
                    className="bg-base-200 p-4 rounded-xl border border-base-300"
                  >
                    <div className="font-semibold text-base">
                      {feature.title}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {feature.description}
                    </div>
                    <div className="text-sm mt-1 font-semibold">
                      {t("packageDetails.features.price")}:{" "}
                      <span className="font-medium">
                        {(feature.override_price ?? feature.price) > 0
                          ? `${feature.override_price ?? feature.price} DKK`
                          : t("packageDetails.features.included")}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">
                  {t("packageDetails.features.noFeatures")}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {updateToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {t("packageDetails.updated_package")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPackagesDetails;
