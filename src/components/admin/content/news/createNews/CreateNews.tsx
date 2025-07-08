import React, { useState } from "react";
import { createNews } from "@/lib/server/actions";
import { useTranslation } from "react-i18next";

const CreateNews = ({ onCaseCreated }: { onCaseCreated: () => void }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !desc) {
      setErrors({
        title: !title ? t("title_required") : "",
        desc: !desc ? t("desc_required") : "",
        image: "",
      });
      setLoading(false);
      return;
    }

    try {
      await createNews({
        title,
        desc,
        image,
      });

      setTitle("");
      setDesc("");
      setImage(null);
      onCaseCreated();
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
    if (e.target.value.length <= 500) {
      setDesc(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <span className="text-lg font-bold">{t("case_creation")}</span>
      <form
        onSubmit={handleCreateCase}
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
                aria-label={t("aria.createCase.title")}
              />
              {errors.title && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.title}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("desc")}</legend>
              <textarea
                name="desc"
                className="textarea textarea-bordered textarea-md text"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder={t("write_desc")}
                style={{ resize: "none" }}
                cols={30}
                rows={8}
                aria-label={t("aria.createCase.description")}
              ></textarea>
              <div className="text-right text-xs font-medium text-zinc-500">
                {desc.length} / 500
              </div>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </fieldset>
          </div>
          <div className="flex flex-col gap-3 relative">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("choose_images")}</legend>
              <input
                name="image"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
                aria-label={t("aria.createCase.chooseImage")}
              />
              {errors.image && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.image}
                </span>
              )}
            </fieldset>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
          aria-label={
            loading
              ? t("aria.createCase.creating")
              : t("aria.createCase.create")
          }
        >
          {loading ? t("creating") : t("create")}
        </button>
      </form>
    </div>
  );
};

export default CreateNews;
