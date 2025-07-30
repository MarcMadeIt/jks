"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  images: string[];
  creator_id: string;
  created_at: string;
  linkFacebook?: string;
}

const FALLBACK_IMAGE = "/demo.jpg";

const News = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?lang=${i18n.language}`); // Tilføj sprogparameter
      if (!res.ok) throw new Error("Failed to load news");
      const { news } = await res.json();
      setNewsItems(news);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-dots loading-xl text-secondary h-96" />
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg text-gray-500">{t("no_news")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 md:py-15 lg:py-20 w-full bg-base-200 p-3 sm:p-4 lg:p-7 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl">
        {newsItems.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`rounded-xl overflow-hidden bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 ${
              index === 2 ? "hidden md:block" : ""
            }`}
          >
            {item.linkFacebook ? (
              <Link
                href={item.linkFacebook}
                className="max-w-[320px] sm:max-w-full w-92 h-auto block group relative"
                target="_blank"
                aria-label={
                  t("aria.navigation.linkToNews") || "Go to news article"
                }
              >
                <div className="relative aspect-[1/1] overflow-hidden rounded-xl">
                  {/* Billedet */}
                  <Image
                    src={item.images?.[0] || item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 md:group-hover:scale-103"
                  />

                  {/* Gradient + tekst */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-base font-bold mb-1">{item.title}</h2>
                    <p className="text-xs font-light line-clamp-2">
                      {item.content}
                    </p>
                  </div>

                  {/* Ikoner */}
                  <div className="absolute top-3 right-3 flex gap-2 z-20">
                    <FaFacebook size={24} className="text-white drop-shadow" />
                    <FaInstagram size={26} className="text-white drop-shadow" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full block">
                <div className="relative aspect-[1/1]">
                  <Image
                    src={item.images?.[0]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col justify-evenly">
                  <h2 className="text-lg font-bold">
                    {item.title && item.title}
                  </h2>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {item.content}
                  </p>
                </div>
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default News;
