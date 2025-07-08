"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaPen, FaTrash } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import UpdateNews from "./updateNews/UpdateNews";
import { deleteNews } from "@/lib/server/actions";

interface NewsListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditCase: (caseId: number) => void;
}

interface NewsItem {
  id: number;
  title: string;
  desc: string;
  image: string | null;
}

const FALLBACK_IMAGE = "/demo.jpg";

const NewsList = ({ view, page, setTotal, onEditCase }: NewsListProps) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?page=${page}&lang=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to load news");
      const { news, total } = await res.json();
      setNewsItems(news);
      setTotal(total);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setNewsItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal, i18n.language]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const truncate = (text: string | null | undefined, max: number) =>
    text && text.length > max ? text.slice(0, max) + "…" : text || "";

  const handleNewsUpdated = () => {
    setEditingNewsId(null);
    fetchNews();
  };

  const handleDelete = async () => {
    if (deletingNewsId == null) return;
    try {
      await deleteNews(deletingNewsId);
      setDeletingNewsId(null);
      setIsModalOpen(false);
      fetchNews();
    } catch (err) {
      console.error("Failed to delete news:", err);
    }
  };

  const closeModal = () => {
    setDeletingNewsId(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-spinner loading-md h-40" />
        {t("loading_cases")}
      </div>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        <p className="text-lg text-gray-500">{t("no_cases")}</p>
      </div>
    );
  }

  if (editingNewsId) {
    return (
      <UpdateNews newsId={editingNewsId} onCaseUpdated={handleNewsUpdated} />
    );
  }

  return (
    <div className="w-full">
      {view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="card card-compact shadow-md rounded-lg"
            >
              <figure className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image || FALLBACK_IMAGE}
                  alt={`Billede til opslaget: ${item.title}`}
                  fill
                  priority={page === 1}
                  className="object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg">{item.title}</h2>
                <p className="text-xs">{truncate(item.desc, 100)}</p>
                <div className="card-actions justify-end mt-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => onEditCase(item.id)}
                  >
                    <FaPen /> {t("edit")}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setDeletingNewsId(item.id);
                      setIsModalOpen(true);
                    }}
                  >
                    <FaTrash /> {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-col gap-5">
          {newsItems.map((item) => (
            <li key={item.id}>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="relative w-12 h-10 rounded-md overflow-hidden">
                    <Image
                      src={item.image || FALLBACK_IMAGE}
                      alt={`Case study for ${item.title}`}
                      fill
                      priority={page === 1}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-xs hidden sm:block">
                    {item.title}
                  </h3>
                  <h3 className="font-semibold text-xs block sm:hidden">
                    {truncate(item.title, 20)}
                  </h3>
                </div>
                <div className="flex gap-5 md:gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => onEditCase(item.id)}
                  >
                    <FaPen />{" "}
                    <span className="md:flex hidden">{t("edit")}</span>
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setDeletingNewsId(item.id);
                      setIsModalOpen(true);
                    }}
                  >
                    <FaTrash />{" "}
                    <span className="md:flex hidden">{t("delete")}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && deletingNewsId != null && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("delete_case_confirmation")}
            </h3>
            <p className="py-4">{t("delete_case_prompt")}</p>
            <p className="text-sm text-warning">{t("delete_case_warning")}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("cancel")}
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsList;
