"use client";

import ReviewsRating from "@/components/admin/content/reviews/ReviewsRating";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

interface Review {
  link: string;
  rate: number;
  desc: string;
  desc_translated?: string;
  name: string;
  date: string;
}

const Review = () => {
  const { i18n, t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?lang=${i18n.language}`);
        if (!res.ok) throw new Error("Failed to load reviews");
        const { reviews } = await res.json();
        setReviews(reviews);
      } catch (error) {
        console.error("Failed to fetch latest reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [i18n.language]);

  // Duplicer reviews for at skabe en uendelig effekt
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className="w-full h-[260px] md:h-full overflow-hidden bg-base-200 relative flex flex-col items-center justify-center gap-5 md:gap-10 rounded-lg">
      <div className="w-full overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center gap-3 h-[135px] md:h-[200px] w-full">
            <span className="loading loading-dots loading-lg text-neutral-content"></span>
          </div>
        ) : (
          <motion.div
            className="flex gap-0 md:gap-4"
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-100%"] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
          >
            {duplicatedReviews.map((r, index) => (
              <Link
                href={r.link}
                key={index}
                className="card bg-base-100 card-compact shadow-lg rounded-md p-3 mx-4 min-w-[280px] md:min-w-[350px] md:h-[200px]"
              >
                <div className="card-body p-5">
                  <ReviewsRating rate={r.rate} />
                  <p className="text-xs md:text-base">
                    {i18n.language !== "da" && r.desc_translated
                      ? r.desc_translated.length > 100
                        ? r.desc_translated.substring(0, 97) + "..."
                        : r.desc_translated
                      : r.desc.length > 100
                      ? r.desc.substring(0, 97) + "..."
                      : r.desc}
                  </p>
                  <div className="body-actions flex items-center justify-between">
                    <h2 className="text-xs md:text-sm font-bold flex items-center gap-1">
                      {r.name}
                    </h2>
                    <span className="text-xs font-medium">
                      {formatDate(r.date)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
      <Link
        href="https://dk.trustpilot.com/review/www.junkerskoreskole.dk"
        className=" text-[10px] md:text-xs flex items-end gap-1 w-full justify-end pr-16"
      >
        {t("home.reviews.from")}
        <Image
          src={"/trustpilot.webp"}
          alt="Trustpilot"
          width={65}
          height={40}
        />
      </Link>
    </div>
  );
};

export default Review;
