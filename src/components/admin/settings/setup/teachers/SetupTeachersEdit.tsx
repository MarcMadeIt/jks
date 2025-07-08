"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleLeft } from "react-icons/fa6";

interface TeacherData {
  name: string;
  desc: string;
  descEng: string;
  image: File | string;
  since: string;
}

interface SetupTeachersEditProps {
  teacherId: string;
  onSave: (teacherData: TeacherData) => void;
  onBackToDetails: () => void;
}

const SetupTeachersEdit = ({
  teacherId,
  onSave,
  onBackToDetails,
}: SetupTeachersEditProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState<TeacherData>({
    name: "",
    desc: "",
    descEng: "",
    image: "",
    since: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    desc: "",
    descEng: "",
    image: "",
    since: "",
  });

  useEffect(() => {
    async function fetchTeacher() {
      try {
        // TODO: Implement fetchTeacherById
        // const teacher = await fetchTeacherById(teacherId);
        // setTeacherData(teacher);
      } catch (err) {
        console.error("Failed to load teacher data", err);
      }
    }
    fetchTeacher();
  }, [teacherId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { name, desc, descEng, image, since } = teacherData;
    if (!name || !desc || !descEng || !image || !since) {
      setErrors({
        name: !name ? t("updateTeacher.errors.name") : "",
        desc: !desc ? t("updateTeacher.errors.desc") : "",
        descEng: !descEng ? t("updateTeacher.errors.descEng") : "",
        image: !image ? t("updateTeacher.errors.image") : "",
        since: !since ? t("updateTeacher.errors.since") : "",
      });
      setLoading(false);
      return;
    }
    try {
      onSave(teacherData);
      onBackToDetails();
      // TODO: Implement updateTeacher(teacherId, teacherData)
    } catch (error) {
      console.error("Failed to update teacher:", error);
      alert("Could not update teacher.");
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 150) {
      setTeacherData({ ...teacherData, desc: e.target.value });
    }
  };
  const handleDescEngChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 150) {
      setTeacherData({ ...teacherData, descEng: e.target.value });
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div>
        <button onClick={onBackToDetails} className="btn btn-ghost">
          <FaAngleLeft /> {t("back")}
        </button>
      </div>
      <div className="flex flex-col gap-5 w-full">
        <span className="text-lg font-bold">
          {t("updateTeacher.formTitle")}
        </span>
        <form onSubmit={handleSave} className="flex flex-col gap-5 w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {t("updateTeacher.name")}
            </legend>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder={t("updateTeacher.placeholders.name")}
              value={teacherData.name}
              onChange={(e) =>
                setTeacherData({ ...teacherData, name: e.target.value })
              }
            />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name}</span>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {t("updateTeacher.image")}
            </legend>
            <input
              type="file"
              accept="image/png, image/webp, image/jpeg, image/jpg"
              className="file-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setTeacherData({ ...teacherData, image: file });
                } else {
                  setTeacherData({ ...teacherData, image: "" });
                }
              }}
            />
            <label className="label text-xs">
              {t("updateTeacher.imageFormats")}
            </label>
            {errors.image && (
              <span className="text-xs text-red-500">{errors.image}</span>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {t("updateTeacher.since")}
            </legend>
            <input
              type="date"
              className="input input-bordered input-md"
              placeholder={t("updateTeacher.placeholders.since")}
              value={teacherData.since}
              onChange={(e) =>
                setTeacherData({ ...teacherData, since: e.target.value })
              }
            />
            {errors.since && (
              <span className="text-xs text-red-500">{errors.since}</span>
            )}
          </fieldset>
          <div className="flex flex-col lg:flex-row gap-5">
            <fieldset className="fieldset md:w-md">
              <legend className="fieldset-legend">
                {t("updateTeacher.desc")}
              </legend>
              <textarea
                className="textarea textarea-bordered textarea-md w-full resize-none"
                placeholder={t("updateTeacher.placeholders.desc")}
                value={teacherData.desc}
                onChange={handleDescChange}
                rows={5}
                maxLength={150}
              />
              <div className="text-right text-xs font-medium text-gray-500">
                {teacherData.desc.length} / 150
              </div>
              {errors.desc && (
                <span className="text-xs text-red-500">{errors.desc}</span>
              )}
            </fieldset>

            <fieldset className="fieldset md:w-md">
              <legend className="fieldset-legend">
                {t("updateTeacher.descEng")}
              </legend>
              <textarea
                className="textarea textarea-bordered textarea-md w-full resize-none"
                placeholder={t("updateTeacher.placeholders.descEng")}
                value={teacherData.descEng}
                onChange={handleDescEngChange}
                rows={5}
                maxLength={150}
              />
              <div className="text-right text-xs font-medium text-gray-500">
                {teacherData.descEng.length} / 150
              </div>
              {errors.descEng && (
                <span className="text-xs text-red-500">{errors.descEng}</span>
              )}
            </fieldset>
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={loading}
            >
              {loading ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupTeachersEdit;
