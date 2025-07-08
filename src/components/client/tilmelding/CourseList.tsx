"use client";

import React, { useEffect, useState } from "react";
import { Course } from "@/lib/client/gondrive";
import {
  FaCalendarCheck,
  FaClock,
  FaUpRightFromSquare,
  FaXmark,
} from "react-icons/fa6";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const cityOptions = ["Grindsted", "Billund", "Ribe"] as const;
type City = (typeof cityOptions)[number] | "Alle";

const extractTimeAndCleanName = (name: string) => {
  const timeRegex = /(kl\.\s*\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2})/i;
  const match = name.match(timeRegex);
  const time = match?.[0] ?? null;
  const cleanName = name.replace(timeRegex, "").trim();
  return { time, cleanName };
};

const CourseList = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState<City>("Alle");

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const courseMatchesCity = (course: Course, city: City) => {
    const combined = `${course.location} ${course.name}`.toLowerCase();
    switch (city) {
      case "Alle":
        return true;
      case "Billund":
        return combined.includes("billund") || combined.includes("grindsted");
      default:
        return combined.includes(city.toLowerCase());
    }
  };

  const filteredCourses = courses
    .filter((course) => courseMatchesCity(course, cityFilter))
    .filter((course) => !course.seatsLeft?.startsWith("0"));

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Form */}
      <form
        className="filter flex justify-center gap-2"
        onReset={() => setCityFilter("Alle")}
      >
        <input
          className="btn btn-square md:btn-lg"
          type="reset"
          value={t("coursePage.filter.reset")}
          aria-label={t("coursePage.filter.reset")}
        />
        {cityOptions.map((city) => (
          <input
            key={city}
            className="btn md:btn-lg border-2 border-base-300"
            type="radio"
            name="city"
            aria-label={city}
            checked={cityFilter === city}
            onChange={() => setCityFilter(city)}
          />
        ))}
      </form>

      {/* Skeleton */}
      {loading ? (
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton w-[350px] h-56 rounded-xl border border-base-300 bg-base-200 p-6 shadow-md flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="skeleton h-6 w-40"></div>
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-4 w-32"></div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="skeleton h-10 w-24 rounded"></div>
                <div className="skeleton h-10 w-24 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !filteredCourses.length ? (
        <p className="text-center">{t("coursePage.noCourses")}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-7 max-w-6xl mx-auto p-4">
          {filteredCourses.map((course, index) => {
            const { time, cleanName } = extractTimeAndCleanName(course.name);

            return (
              <div
                key={`${course.id}-${index}`}
                className="w-[350px] rounded-xl border-1 border-base-200 bg-base-200 p-6 shadow-md flex flex-col justify-between"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaCalendarCheck className="text-primary" size={23} />
                    {course.start_date}
                  </h2>
                  {time && (
                    <p className="flex items-center gap-2 text-sm text-base-content">
                      <FaClock className="text-base-content" /> {time}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-base-content">
                    {cleanName}
                  </p>
                  {course.seatsLeft && (
                    <p className="text-sm text-base-content">
                      <strong>{t("coursePage.seats")}</strong>{" "}
                      {course.seatsLeft}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 gap-2">
                  <a
                    href={course.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {t("coursePage.register")} <FaUpRightFromSquare />
                  </a>
                  {/(bil|personbil)/i.test(cleanName) && (
                    <button onClick={openModal} className="btn btn-soft">
                      {t("coursePage.viewSchedule")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal med forløbskort */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-[95%] max-w-6xl h-[70vh] md:h-[85vh] overflow-auto relative touch-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 btn btn-circle btn-sm md:btn-lg"
            >
              <FaXmark size={24} />
            </button>
            <Image
              src="/forløbskort.png"
              alt={t("coursePage.modal.alt")}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
