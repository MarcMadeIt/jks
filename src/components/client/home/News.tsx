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
  fb_link?: string;
}

const FALLBACK_IMAGE = "/demo.jpg";

const News = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?lang=${i18n.language}`);
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

  if (newsItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg text-gray-500">{t("no_news")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 md:py-15 lg:py-20 w-full bg-base-200 p-3 sm:p-5 lg:p-10 ">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 p-1 md:p-4 max-w-5xl">
        {newsItems.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`rounded-xl overflow-hidden bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 ${
              index === 2 ? "hidden sm:block" : ""
            }`}
          >
            {item.fb_link ? (
              <Link
                href={item.fb_link}
                className="max-w-[320px] sm:max-w-full w-full h-full block relative"
                target="_blank"
                aria-label={
                  t("aria.navigation.linkToNews") || "Go to news article"
                }
              >
                <div className="relative aspect-[1/1]">
                  <Image
                    src={item.images?.[0] || item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    fill
                    className="object-cover hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col justify-evenly">
                  <h2 className="text-lg font-bold">
                    {item.title && item.title}
                  </h2>
                  <p className="text-xs font-semibold line-clamp-3">
                    {item.content}
                  </p>
                  <div className="text-xs text-zinc-500 flex justify-between pt-4">
                    <div className="absolute top-3 right-3 flex gap-2 z-50">
                      <FaFacebook
                        size={20}
                        className="inline-block text-base-100"
                      />
                      <FaInstagram
                        size={22}
                        className="inline-block text-base-300"
                      />
                    </div>
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
