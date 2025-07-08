import React, { useState } from "react";
import { createReview } from "@/lib/server/actions";
import CreateRating from "./CreateRating";
import { useTranslation } from "react-i18next";

interface CreateReviewProps {
  onReviewCreated: () => void;
}

const CreateReview = ({ onReviewCreated }: CreateReviewProps) => {
  const { t } = useTranslation();

  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState<number>(1);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    desc: "",
    name: "",
    date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!desc || !name || !date) {
      setErrors({
        desc: !desc ? t("desc_required") : "",
        name: !name ? t("name_required") : "",
        date: !date ? t("date_required") : "",
      });
      setLoading(false);
      return;
    }

    try {
      await createReview({
        name,
        desc,
        rate,
        date,
        link: link || undefined,
      });

      onReviewCreated();
      setName("");
      setDesc("");
      setRate(1);
      setDate("");
      setLink("");
      setErrors({ desc: "", name: "", date: "" });
    } catch {
      setError("Failed to create review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <span className="text-lg font-bold">{t("review_creation")}</span>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        {error && <div className="alert alert-error">{error}</div>}

        {/* Rating (keep as is) */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t("rating")}</legend>
          <CreateRating rate={rate} setRate={setRate} />
        </fieldset>

        {/* Name */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t("review_name")}</legend>
          <input
            type="text"
            className="input input-bordered input-md"
            placeholder={t("write_review_name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name}</span>
          )}
        </fieldset>

        {/* Date */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t("review_date")}</legend>
          <input
            type="date"
            className="input input-bordered input-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && (
            <span className="text-xs text-red-500">{errors.date}</span>
          )}
        </fieldset>

        {/* Description */}
        <div className="flex flex-col lg:flex-row gap-5">
          <fieldset className="fieldset md:w-md">
            <legend className="fieldset-legend">{t("description")}</legend>
            <textarea
              className="textarea textarea-bordered textarea-md w-full resize-none"
              value={desc}
              onChange={(e) =>
                e.target.value.length <= 250 && setDesc(e.target.value)
              }
              placeholder={t("write_review_desc")}
              rows={5}
              maxLength={250}
            ></textarea>
            <div className="text-right text-xs font-medium text-gray-500">
              {desc.length} / 250
            </div>
            {errors.desc && (
              <span className="text-xs text-red-500">{errors.desc}</span>
            )}
          </fieldset>

          {/* Link (optional) */}
          <fieldset className="fieldset md:w-md">
            <legend className="fieldset-legend">
              {t("review_link")} ({t("optional")})
            </legend>
            <input
              type="url"
              className="input input-bordered input-md"
              placeholder="https://dk.trustpilot.com/reviews/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </fieldset>
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading ? t("creating") : t("create")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;
