"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import SetupTeachersList from "./SetupTeachersList";

interface Teacher {
  id: string;
  name: string;
}

interface SetupTeachersProps {
  onDetails: (teacher: Teacher) => void;
  onCreate: () => void;
}

const SetupTeachers = ({ onDetails, onCreate }: SetupTeachersProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-xl">{t("teachers")}</h3>

      <div className="flex flex-col items-start gap-5">
        <SetupTeachersList onViewDetails={onDetails} />
      </div>

      <div>
        <button className="btn btn-primary" onClick={onCreate}>
          {t("create")} {t("teacher")}
        </button>
      </div>
    </div>
  );
};

export default SetupTeachers;
