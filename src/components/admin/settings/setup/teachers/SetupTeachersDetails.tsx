"use client";

import React, { useEffect, useState } from "react";
import SetupTeachersDetailsActions from "./SetupTeachersDetailsActions";
import SetupTeachersEdit from "./SetupTeachersEdit";
import { useTranslation } from "react-i18next";
import { FaAngleLeft } from "react-icons/fa6";
import { format } from "date-fns";
import { da, enUS } from "date-fns/locale";
import { fetchTeacherById } from "@/lib/server/actions";
import Image from "next/image";

interface Teacher {
  id: string;
  name: string;
  desc: string;
  image: string;
  priority: number;
  since: string;
}

interface SetupTeachersDetailsProps {
  teacherId: string;
  onBack: () => void;
  onDelete: () => void;
}

const SetupTeachersDetails = ({
  teacherId,
  onBack,
  onDelete,
}: SetupTeachersDetailsProps) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === "da" ? da : enUS;

  const [isEditing, setIsEditing] = useState(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [updateToast, setUpdateToast] = useState(false);

  useEffect(() => {
    async function fetchTeacher() {
      try {
        const teacherData = await fetchTeacherById(teacherId);
        setTeacher(teacherData);
      } catch (error) {
        console.error("Failed to load teacher:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeacher();

    // Listen for teacherDeleted event to show toast
    const handleTeacherDeleted = () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };
    window.addEventListener("teacherDeleted", handleTeacherDeleted);
    return () => {
      window.removeEventListener("teacherDeleted", handleTeacherDeleted);
    };
  }, [teacherId]);

  const handleSave = (updatedTeacher: Teacher) => {
    setTeacher(updatedTeacher);
    setUpdateToast(true);
    setTimeout(() => setUpdateToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="w-full h-52 flex items-center justify-center gap-2">
        <span className="loading loading-spinner loading-md h-40" />
        {t("teachersDetails.loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {isEditing ? (
        <SetupTeachersEdit
          teacherId={teacherId}
          onSave={(teacherData) => {
            const updatedTeacher: Teacher = {
              ...teacher,
              ...teacherData,
            } as Teacher;
            handleSave(updatedTeacher);
          }}
          onBackToDetails={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="btn btn-ghost">
              <FaAngleLeft />
              {t("back")}
            </button>
            <SetupTeachersDetailsActions
              onEdit={() => setIsEditing(true)}
              onDelete={onDelete}
            />
          </div>

          <h1 className="text-xl font-semibold">
            {t("teachersDetails.title")}
          </h1>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
            <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("teachersDetails.fields.name")}
              </p>
              <span className="font-semibold">
                {teacher?.name || t("teachersDetails.fields.unknown")}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("teachersDetails.fields.since")}
              </p>
              <span className="font-semibold">
                {teacher?.since
                  ? format(new Date(teacher.since), "dd. MMMM yyyy", {
                      locale: currentLocale,
                    })
                  : t("teachersDetails.fields.unknown")}
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-10 md:gap-0">
            <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
              <div className="rounded-xl w-40 h-40 overflow-hidden">
                <Image
                  src={teacher?.image || "/no-image.webp"}
                  alt=""
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <p className="text-xs font-medium text-gray-400">
              {t("teachersDetails.fields.desc")}
            </p>
            <span className="font-semibold">
              {teacher?.desc || t("teachersDetails.fields.unknown")}
            </span>
          </div>
        </div>
      )}

      {(showToast || updateToast) && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {t("teachersDetails.updated_teacher")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupTeachersDetails;
