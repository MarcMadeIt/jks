"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTeachers } from "@/lib/server/actions";
import { FaAngleRight } from "react-icons/fa6";

interface Teacher {
  id: string;
  name: string;
}

interface SetupTeachersListProps {
  onViewDetails: (teacher: Teacher) => void;
}

const SetupTeachersList = ({ onViewDetails }: SetupTeachersListProps) => {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const teachers = await getTeachers();
        setTeachers(teachers);
      } catch (error) {
        console.error("Kunne ikke hente lærere:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-spinner loading-md h-24"></span>
        {t("loading_teachers")}
      </div>
    );
  }

  return (
    <ul className="list w-full gap-2">
      {teachers.map((teacher) => (
        <li
          key={teacher.id}
          className="list-row flex justify-between items-center p-4 w-full"
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">{teacher.name}</h3>
          </div>
          <div>
            <button
              className="btn btn-sm btn-neutral btn-soft"
              onClick={() => onViewDetails(teacher)}
            >
              <span className="md:flex hidden">{t("details")}</span>
              <FaAngleRight />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SetupTeachersList;
