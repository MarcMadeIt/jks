"use client";

import React, { useState } from "react";
import { FaRegNewspaper, FaStar } from "react-icons/fa6";
import Reviews from "./reviews/Reviews";
import { useTranslation } from "react-i18next";
import News from "./news/News";

const NavContent = () => {
  const [activeTab, setActiveTab] = useState("news");
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <div
        role="tablist"
        className="tabs sm:tabs-lg w-full md:w-96 text-[15px]"
      >
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "news"
              ? "tab-active bg-base-100 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("news")}
          aria-label={t("aria.navContent.casesTab")}
        >
          <FaRegNewspaper />
          Nyheder
        </button>
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "reviews"
              ? "tab-active bg-base-100 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("reviews")}
          aria-label={t("aria.navContent.reviewsTab")}
        >
          <FaStar />
          {t("reviews")}
        </button>
      </div>

      <div className="mt-3 md:mt-5">
        {activeTab === "news" && (
          <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
            <News />
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
            <Reviews />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavContent;
