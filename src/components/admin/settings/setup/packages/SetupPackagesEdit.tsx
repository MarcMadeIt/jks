"use client";

import React, { useEffect, useState } from "react";
import { getPackageById, updatePackage } from "@/lib/server/actions";
import { FaAngleLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface PackageData {
  title: string;
  desc: string;
  price: number;
}

interface SetupPackagesEditProps {
  packageId: string;
  onSave: (packageData: PackageData) => void;
  onBack: () => void;
  onBackToDetails?: () => void;
}

const SetupPackagesEdit = ({
  packageId,
  onSave,
  onBack,
  onBackToDetails,
}: SetupPackagesEditProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [packageData, setPackageData] = useState<PackageData>({
    title: "",
    desc: "",
    price: 0,
  });

  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    price: "",
  });

  useEffect(() => {
    const loadPackage = async () => {
      try {
        const data = await getPackageById(packageId);
        setPackageData(data);
      } catch (err) {
        console.error("Failed to load package data", err);
      }
    };
    loadPackage();
  }, [packageId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { title, desc, price } = packageData;

    if (!title || !desc || price <= 0) {
      setErrors({
        title: !title ? t("updatePackage.errors.title") : "",
        desc: !desc ? t("updatePackage.errors.desc") : "",
        price: price <= 0 ? t("updatePackage.errors.price") : "",
      });
      setLoading(false);
      return;
    }

    try {
      await updatePackage(packageId, { title, desc, price });
      onSave(packageData);
      onBack();
    } catch (error) {
      console.error("Failed to update package:", error);
      alert("Could not update package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div>
        <button onClick={onBackToDetails || onBack} className="btn btn-ghost">
          <FaAngleLeft /> {t("back")}
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5 w-full">
        {/* Title */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            {t("updatePackage.title")}
          </legend>
          <input
            type="text"
            className="input input-bordered input-md"
            placeholder={t("updatePackage.placeholders.title")}
            value={packageData.title}
            onChange={(e) =>
              setPackageData({ ...packageData, title: e.target.value })
            }
          />
          {errors.title && (
            <span className="text-xs text-red-500">{errors.title}</span>
          )}
        </fieldset>

        {/* Price */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            {t("updatePackage.price")}
          </legend>
          <input
            type="number"
            className="input input-bordered input-md"
            placeholder={t("updatePackage.placeholders.price")}
            value={packageData.price}
            onChange={(e) =>
              setPackageData({
                ...packageData,
                price: parseFloat(e.target.value) || 0,
              })
            }
          />
          {errors.price && (
            <span className="text-xs text-red-500">{errors.price}</span>
          )}
        </fieldset>

        {/* Description */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t("updatePackage.desc")}</legend>
          <textarea
            className="textarea textarea-bordered textarea-md"
            placeholder={t("updatePackage.placeholders.desc")}
            value={packageData.desc}
            onChange={(e) =>
              setPackageData({ ...packageData, desc: e.target.value })
            }
          />
          {errors.desc && (
            <span className="text-xs text-red-500">{errors.desc}</span>
          )}
        </fieldset>

        <div>
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading ? t("updatePackage.saving") : t("updatePackage.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupPackagesEdit;
