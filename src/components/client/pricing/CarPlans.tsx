"use client";

import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getFeaturesByPackageId } from "@/lib/client/actions";
import Image from "next/image";

interface Feature {
  id: string;
  title: string;
  title_eng: string;
  price: number | null;
  included: boolean;
}

interface Package {
  id: string;
  label: string;
  title: string;
  title_eng: string;
  desc: string;
  desc_eng: string;
  price: number;
}

type CarPlansProps = {
  data: Package[];
};

const CarPlans = ({ data }: CarPlansProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [features, setFeatures] = useState<Record<string, Feature[]>>({});

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const featureMap: Record<string, Feature[]> = {};
        for (const p of data) {
          const feats = await getFeaturesByPackageId(p.id);
          featureMap[p.id] = feats;
        }
        setFeatures(featureMap);
        // Recache logic
        localStorage.setItem("featuresCache", JSON.stringify(featureMap));
      } catch (error) {
        console.error("Failed to fetch features:", error);
      }
    };

    loadFeatures();
  }, [data]);

  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full relative">
      <div className="flex flex-col items-center gap-5">
        <span className="text-xl sm:text-xl md:text-2xl font-light text-center">
          {t("carPlans.subtitle")}
        </span>
      </div>

      <motion.div
        className="flex flex-col lg:flex-row items-center justify-center w-full h-full z-10 gap-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {data.map((pack) => {
          const title =
            lang === "en" ? pack.title_eng || pack.title : pack.title;
          const desc = lang === "en" ? pack.desc_eng || pack.desc : pack.desc;
          const featureList = features[pack.id] || [];
          const included = featureList.filter((f) => f.included);
          const extras = featureList.filter((f) => !f.included);

          return (
            <div
              key={pack.id}
              className="relative w-full flex justify-center items-center"
              aria-label={title}
            >
              <div className="flex flex-col shadow-lg w-full min-w-sm sm:min-w-[460px] h-[800px] p-6 sm:p-8 rounded-xl bg-base-200 ring-2 shadow-base-300 ring-base-300 gap-5 overflow-hidden relative max-w-full sm:max-w-sm">
                {pack.label === "platin" && (
                  <Image
                    src={lang === "en" ? "/all_in_eng.png" : "/all_in_da.png"}
                    alt=""
                    width={800}
                    height={150}
                    className="absolute top-9 -right-22 md:top-11 md:-right-24 rotate-40 w-auto h-10 md:h-12"
                  />
                )}
                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-wide">
                    {title}
                  </h3>
                  <h4>{desc}</h4>
                </div>

                <div className="flex flex-col gap-1 items-start">
                  <span className="text-2xl sm:text-3xl font-semibold tracking-wide">
                    {pack.price.toLocaleString("da-DK")} DKK
                  </span>
                </div>

                {/* Inkluderede features */}
                <ul className="flex flex-col gap-4 items-start">
                  {pack.label === "platin" && (
                    <li className="flex gap-2 items-center">
                      <FaCheck className="text-primary text-lg sm:text-2xl" />
                      <span className="text-sm font-semibold">
                        {t("packageDetails.features.baseIncludedTitle")}
                      </span>
                      <span className="text-xs text-zinc-400 ml-1">
                        {t("packageDetails.features.baseIncludedValue")}
                      </span>
                    </li>
                  )}
                  {included.map((f) => {
                    const featureTitle =
                      lang === "en" ? f.title_eng || f.title : f.title;
                    return (
                      <li key={f.id} className="flex gap-2 items-center">
                        <FaCheck className="text-primary text-lg sm:text-2xl" />
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold">
                            {featureTitle}
                          </span>
                        </div>
                        {f.price ? (
                          <span className="text-xs sm:text-sm text-zinc-400 ml-1">
                            (
                            {t("packageDetails.features.valueLabel", {
                              price: f.price,
                            })}
                            )
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>

                {/* Ekstra tilvalg */}
                {extras.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-base sm:text-lg text-zinc-600 font-semibold mb-5">
                      {t("packageDetails.features.additional") ||
                        "Additional services available"}
                    </h5>
                    <ul className="flex flex-col gap-3">
                      {extras.map((f) => {
                        const featureTitle =
                          lang === "en" ? f.title_eng || f.title : f.title;
                        return (
                          <li
                            key={f.id}
                            className="flex gap-2 items-center text-sm"
                          >
                            <span className="font-semibold">
                              {featureTitle}
                            </span>
                            <span className="text-zinc-500 sm:text-base ml-1">
                              + {f.price} DKK
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-zinc-500 absolute bottom-5">
                  {t("carPlans.vatNote")}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CarPlans;
