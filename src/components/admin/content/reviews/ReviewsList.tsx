"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaPen, FaTrash } from "react-icons/fa6";
import ReviewsRating from "./ReviewsRating";
import { useTranslation } from "react-i18next";
import { deleteReview } from "@/lib/server/actions";

interface Review {
  id: number;
  rate: number;
  desc: string;
  name: string;
}

interface ReviewsListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditReview: (reviewId: number) => void;
  loading: boolean;
  onReviewDeleted?: () => void;
}

const ReviewsList = ({
  view,
  page,
  setTotal,
  onEditReview,
  loading,
  onReviewDeleted,
}: ReviewsListProps) => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Review[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/reviews?page=${page}&lang=${i18n.language}`
      );
      if (!res.ok) throw new Error("Failed to load reviews");
      const { reviews, total } = await res.json();
      setItems(reviews);
      setTotal(total);
    } catch (err) {
      console.error(err);
      setItems([]);
      setTotal(0);
    }
  }, [page, setTotal, i18n.language]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, max)}…` : text;

  const handleDelete = async () => {
    if (deletingId == null) return;
    try {
      await deleteReview(deletingId);
      setDeletingId(null);
      setIsModalOpen(false);
      fetchReviews();
      if (onReviewDeleted) onReviewDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-2 h-40 w-full">
        <span className="loading loading-spinner loading-md" />{" "}
        {t("loading_reviews")}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        <p className="text-gray-500">{t("no_reviews")}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {view === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
          {items.map((r) => (
            <div key={r.id} className="card card-compact shadow-md rounded">
              <div className="card-body flex flex-col gap-5">
                <ReviewsRating rate={r.rate} />
                <p className="text-sm">{truncate(r.desc, 100)}</p>
                <h2 className="text-sm font-semibold">{r.name}</h2>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-sm btn-neutral btn-soft"
                    onClick={() => onEditReview(r.id)}
                    aria-label={t("aria.reviewsList.editButton")}
                  >
                    <FaPen /> {t("edit")}
                  </button>
                  <button
                    className="btn btn-sm btn-neutral btn-soft"
                    onClick={() => {
                      setDeletingId(r.id);
                      setIsModalOpen(true);
                    }}
                    aria-label={t("aria.reviewsList.deleteButton")}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="list flex gap-2">
          {items.map((r) => (
            <li
              key={r.id}
              className="list-row flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-xs">{r.name}</h3>
                <p className="text-xs mt-1 hidden lg:block">
                  {truncate(r.desc, 70)}
                </p>
              </div>
              <div className="pr-5">
                <ReviewsRating rate={r.rate} />
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-neutral btn-soft"
                  onClick={() => onEditReview(r.id)}
                  aria-label={t("aria.reviewsList.editButton")}
                >
                  <FaPen />
                </button>
                <button
                  className="btn btn-sm btn-neutral btn-soft"
                  onClick={() => {
                    setDeletingId(r.id);
                    setIsModalOpen(true);
                  }}
                  aria-label={t("aria.reviewsList.deleteButton")}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && deletingId != null && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold">{t("delete_review_confirmation")}</h3>
            <p className="py-4">{t("delete_review_prompt")}</p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsModalOpen(false)}
                aria-label={t("aria.reviewsList.cancelDeleteButton")}
              >
                {t("cancel")}
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                aria-label={t("aria.reviewsList.confirmDeleteButton")}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
