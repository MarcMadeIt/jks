import React, { useState, useEffect } from "react";
import { updateNews, getNewsById } from "@/lib/server/actions";
import Image from "next/image";
import { t } from "i18next";

const UpdateNews = ({
  newsId,
  onCaseUpdated,
}: {
  newsId: number;
  onCaseUpdated: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    image: "",
    created_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const caseData = await getNewsById(newsId);
        if (!caseData) {
          console.error(t("case_not_found"));
          return;
        }
        setTitle(caseData.title || "");
        setDesc(caseData.desc || "");

        setExistingImage(caseData.image || null);

        setCreatedAt(
          caseData.created_at
            ? new Date(caseData.created_at).toISOString().split("T")[0]
            : ""
        );
      } catch (error) {
        console.error(t("failed_to_fetch_case"), error);
      }
    };

    fetchNews();
  }, [newsId]);

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !desc) {
      setErrors({
        title: !title ? t("title_required") : "",
        desc: !desc ? t("desc_required") : "",
        image: "",
        created_at: "",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("caseId", newsId.toString());
      formData.append("title", title);
      formData.append("desc", desc);

      formData.append("createdAt", createdAt);

      if (image) formData.append("image", image);

      await updateNews(newsId, title, desc, image || null);

      onCaseUpdated();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: error.message,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 250) {
      setDesc(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <span className="text-lg font-bold">{t("case_editing")}</span>

      <form
        onSubmit={handleUpdateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 items-center">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("title")}</legend>
              <input
                name="title"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.title}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("description")}</legend>
              <textarea
                name="desc"
                className="textarea textarea-bordered textarea-md"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder={t("write_case_description")}
                style={{ resize: "none" }}
                cols={30}
                rows={8}
              ></textarea>
              <div className="text-right text-xs font-medium text-gray-500">
                {desc.length} / 250
              </div>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("creation_date")}</legend>
              <input
                name="createdAt"
                type="date"
                className="input input-bordered input-md"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                required
              />
              {errors.created_at && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.created_at}
                </span>
              )}
            </fieldset>
          </div>
          <div className="flex flex-col gap-3 relative">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("image_update")}</legend>
              <input
                name="image"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              {errors.image && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.image}
                </span>
              )}
              {existingImage && !image && (
                <div className="relative w-full overflow-hidden rounded-md h-0 pb-[56.25%]">
                  <Image
                    src={existingImage}
                    alt={t("existing_image")}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </fieldset>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? t("editing") : t("save")}
        </button>
      </form>
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">{t("case_updated")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateNews;
