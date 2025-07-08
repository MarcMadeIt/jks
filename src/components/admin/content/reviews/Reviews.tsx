"use client";

import React, { useState, useEffect } from "react";
import ReviewsList from "./ReviewsList";
import ReviewsListChange from "./ReviewsListChange";
import ReviewsPagination from "./ReviewsPagination";
import CreateReview from "./createReview/CreateReview";
import UpdateReview from "./updateReview/UpdateReview";
import { FaAngleLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const Reviews = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [showUpdateReview, setShowUpdateReview] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showDeletedToast, setShowDeletedToast] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Simulate fetching reviews (e.g., API call)
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [page]);

  const handleViewChange = (view: "cards" | "list") => {
    setView(view);
  };

  const handleReviewCreated = () => {
    setShowCreateReview(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReviewUpdated = () => {
    setShowUpdateReview(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReviewDeleted = () => {
    setShowDeletedToast(true);
    setTimeout(() => setShowDeletedToast(false), 3000);
  };

  return (
    <div className="flex flex-col md:items-start gap-7">
      {showCreateReview ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowCreateReview(false)}
            className="btn btn-ghost"
            aria-label={t("aria.reviews.backButton")}
          >
            <FaAngleLeft />
            {t("back")}
          </button>
          <CreateReview onReviewCreated={handleReviewCreated} />
        </div>
      ) : showUpdateReview && selectedReviewId !== null ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowUpdateReview(false)}
            className="btn btn-ghost"
            aria-label={t("aria.reviews.backButton")}
          >
            <FaAngleLeft />
            {t("back")}
          </button>
          <UpdateReview
            reviewId={selectedReviewId}
            onReviewUpdated={handleReviewUpdated}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => setShowCreateReview(true)}
              className="btn btn-primary"
              aria-label={t("aria.reviews.createReviewButton")}
            >
              {t("create")} {t("review")}
            </button>
            <ReviewsListChange onViewChange={handleViewChange} />
          </div>
          <ReviewsList
            view={view}
            page={page}
            setTotal={setTotal}
            loading={loading} // Pass loading as a prop
            onEditReview={(reviewId: number) => {
              setSelectedReviewId(reviewId);
              setShowUpdateReview(true);
            }}
            onReviewDeleted={handleReviewDeleted}
          />
          {total > 0 && total > 6 && (
            <div className="flex w-full justify-center">
              <ReviewsPagination page={page} setPage={setPage} total={total} />
            </div>
          )}
        </>
      )}
      {(showToast || showDeletedToast) && (
        <>
          {showToast && (
            <>
              <div className="toast toast-top toast-center md:hidden block">
                <div className="alert alert-success">
                  <span className="text-base md:text-lg">
                    {showCreateReview
                      ? t("review_created")
                      : t("review_updated")}
                  </span>
                </div>
              </div>
              <div className="toast toast-end md:block hidden">
                <div className="alert alert-success">
                  <span className="text-base md:text-lg">
                    {showCreateReview
                      ? t("review_created")
                      : t("review_updated")}
                  </span>
                </div>
              </div>
            </>
          )}
          {showDeletedToast && (
            <>
              <div className="toast toast-top toast-center md:hidden block">
                <div className="alert alert-success">
                  <span className="text-base md:text-lg">
                    {t("review_deleted")}
                  </span>
                </div>
              </div>
              <div className="toast toast-end md:block hidden">
                <div className="alert alert-success">
                  <span className="text-base md:text-lg">
                    {t("review_deleted")}
                  </span>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;
