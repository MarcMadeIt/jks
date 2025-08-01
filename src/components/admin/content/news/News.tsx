"use client";

import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import CreateNews from "./createNews/CreateNews";
import UpdateNews from "./updateNews/UpdateNews";
import NewsList from "./NewsList";
import { useTranslation } from "react-i18next";
import NewsPagination from "./NewsPagination";
import NewsListChange from "./NewsListChange";

const News = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showCreateNews, setShowCreateNews] = useState(false);
  const [showUpdateNews, setShowUpdateNews] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleViewChange = (view: "cards" | "list") => {
    setView(view);
  };

  const handleNewsCreated = () => {
    setShowCreateNews(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNewsUpdated = () => {
    setShowUpdateNews(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col md:items-start gap-7">
      {showCreateNews ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowCreateNews(false)}
            className="btn btn-ghost"
            aria-label={t("aria.news.back")}
          >
            <FaAngleLeft />
            {t("back")}
          </button>
          <CreateNews
            onNewsCreated={handleNewsCreated}
            setShowCreateNews={setShowCreateNews}
          />
        </div>
      ) : showUpdateNews && selectedNewsId !== null ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowUpdateNews(false)}
            className="btn btn-ghost"
            aria-label={t("aria.news.back")}
          >
            <FaAngleLeft />
            {t("back")}
          </button>
          <UpdateNews
            newsId={selectedNewsId}
            onNewsUpdated={handleNewsUpdated}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => setShowCreateNews(true)}
              className="btn btn-primary"
              aria-label={t("aria.news.createNews")}
            >
              {t("create")} Nyhed
            </button>
            <NewsListChange onViewChange={handleViewChange} />
          </div>
          <NewsList
            view={view}
            page={page}
            setTotal={setTotal}
            onEditNews={(newsId: number) => {
              setSelectedNewsId(newsId);
              setShowUpdateNews(true);
            }}
          />
          <div className="flex w-full justify-center">
            {total > 6 && (
              <NewsPagination page={page} setPage={setPage} total={total} />
            )}
          </div>
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div
            className="alert alert-success text-neutral-content"
            aria-label={
              showCreateNews
                ? t("aria.news.newsCreated")
                : t("aria.news.newsUpdated")
            }
          >
            <span className="text-base md:text-lg">
              {showCreateNews ? t("news_created") : t("news_updated")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
