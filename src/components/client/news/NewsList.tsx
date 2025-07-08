"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";

interface CasesListProps {
  page: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}

interface CaseItem {
  id: number;
  company: string;
  desc: string;
  image?: string;
  city: string;
  created_at: string;
  website: string;
}

const FALLBACK_IMAGE = "/demo.jpg";

const NewsList = ({ page, setTotal }: CasesListProps) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cases?page=${page}&lang=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to load cases");
      const { cases, total } = await res.json();
      setCaseItems(cases);
      setTotal(total);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setCaseItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal, i18n.language]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("da-DK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-dots loading-xl text-secondary h-96" />
      </div>
    );
  }

  if (caseItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg text-gray-500">{t("no_cases")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-1 md:p-4">
      {caseItems.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="rounded-xl overflow-hidden bg-base-200 shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <Link
            href={item.website || "/cases"}
            className="w-full h-full block"
            aria-label={
              t("aria.navigation.linkToCases") || "Go to customer's website"
            }
          >
            <div className="relative h-64">
              <Image
                src={item.image || FALLBACK_IMAGE}
                alt={item.company}
                fill
                className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="p-5 flex flex-col justify-evenly h-52">
              <h2 className="text-lg font-bold">{item.company}</h2>
              <p className="text-sm text-zinc-400 line-clamp-3">{item.desc}</p>
              <div className="text-xs text-zinc-500 flex justify-between pt-4">
                <span>{formatDate(item.created_at)}</span>
                <span className="flex items-center gap-1">
                  <FaLocationDot className="text-zinc-400" />
                  {item.city}
                </span>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
};

export default NewsList;
