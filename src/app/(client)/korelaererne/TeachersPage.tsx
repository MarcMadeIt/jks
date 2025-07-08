"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Image from "next/image";
import { getAllTeachers } from "@/lib/client/actions";

// Define the type for a teacher
interface Teacher {
  name: string;
  desc: string;
  desc_eng: string;
  image?: string;
  since?: string;
}

const TeachersPage = () => {
  const { t, i18n } = useTranslation();
  const [team, setTeam] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllTeachers();
      setTeam(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
      <div className="max-w-xs md:max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          {t("korelaerernePage.title")}
        </h1>
      </div>

      <motion.div
        className="flex flex-col items-center justify-center gap-20 max-w-5xl p-5 md:p-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {team.map(({ name, desc, desc_eng, image, since }, i) => {
            let years = 0;
            if (since) {
              const sinceDate = new Date(since);
              const now = new Date();
              years = now.getFullYear() - sinceDate.getFullYear();

              const hasHadAnniversary =
                now.getMonth() > sinceDate.getMonth() ||
                (now.getMonth() === sinceDate.getMonth() &&
                  now.getDate() >= sinceDate.getDate());
              if (!hasHadAnniversary) years--;
            }
            return (
              <motion.div
                key={i}
                className="card bg-base-100 flex-1 h-[550px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <figure className="px-1 pt-2">
                  <Image
                    src={image || "/no-image.webp"}
                    alt={`${name} – ${
                      i18n.language === "en" ? desc_eng : desc
                    }`}
                    width={350}
                    height={350}
                    className="rounded-lg"
                  />
                </figure>
                <div className="card-body p-5">
                  <h2 className="card-title tex">{name}</h2>
                  <p className="text-sm">
                    {i18n.language === "en" ? desc_eng : desc}
                  </p>
                  <div className="card-actions text-primary font-semibold">
                    {years > 0 ? `${years} år som kørelærer` : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default TeachersPage;
