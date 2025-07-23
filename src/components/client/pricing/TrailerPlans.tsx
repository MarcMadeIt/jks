"use client";

import React from "react";
import { FaCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Define types for TrailerPackage and Feature
export interface TrailerPackage {
  id: string;
  title: string;
  title_eng?: string;
  desc: string;
  desc_eng?: string;
  price: number;
  features?: Feature[];
  // Add other fields as needed
}

interface Feature {
  id: string;
  title: string;
  title_eng?: string;
  price?: number;
  included: boolean;
  // Add other fields as needed
}

type TrailerPlansProps = {
  data: TrailerPackage[];
};

const TrailerPlans = ({ data }: TrailerPlansProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (!data[0]) {
    return (
      <div>{t("packageDetails.noPackage") || "No trailer package found."}</div>
    );
  }

  const title =
    lang === "en" ? data[0].title_eng || data[0].title : data[0].title;
  const desc = lang === "en" ? data[0].desc_eng || data[0].desc : data[0].desc;
  const featureList = data[0].features || [];
  const included = featureList.filter((f: Feature) => f.included);
  const extras = featureList.filter((f: Feature) => !f.included);

  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full relative ">
      <div className="flex flex-col items-center gap-5">
        <span className="text-xl sm:text-xl md:text-2xl font-light text-center">
          {t("trailerPlans.subtitle")}
        </span>
      </div>
      <motion.div
        className="flex items-center justify-center w-full h-full z-10 gap-10 "
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="relative w-full" aria-label={title}>
          <div className="flex flex-col shadow-lg w-full min-w-sm sm:min-w-[460px] h-full pb-15 p-6 sm:p-8 sm:pb-20 rounded-xl bg-base-200 ring-2 shadow-base-300 ring-base-300 gap-5">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-wide">
                {title}
              </h3>
              <h4>{desc}</h4>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <span className="text-2xl sm:text-3xl font-semibold tracking-wide">
                {data[0].price.toLocaleString("da-DK")} DKK
              </span>
            </div>

            {/* Inkluderede features */}
            <ul className="flex flex-col gap-4 items-start">
              {included.map((f: Feature) => {
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
              <div className="">
                <h5 className="text-base sm:text-lg text-zinc-600 font-semibold mb-5">
                  {t("packageDetails.features.additional") ||
                    "Additional services available"}
                </h5>
                <ul className="flex flex-col gap-3">
                  {extras.map((f: Feature) => {
                    const featureTitle =
                      lang === "en" ? f.title_eng || f.title : f.title;
                    return (
                      <li
                        key={f.id}
                        className="flex gap-2 items-center text-sm"
                      >
                        <span className="font-semibold">{featureTitle}</span>
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
              {t("trailerPlans.vatNote")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrailerPlans;
