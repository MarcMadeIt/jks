"use client";

import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaUpRightFromSquare,
  FaXmark,
} from "react-icons/fa6";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { fetchCourses } from "../../../lib/client/gondrive";
import { div } from "framer-motion/client";

const cityOptions = ["Grindsted", "Billund", "Ribe"] as const;
type City = (typeof cityOptions)[number] | "Alle";

type Course = {
  id: number;
  title: string;
  license_type: string;
  capacity: number;
  reservations: number;
  start_date: string;
  start: string;
  end: string;
  address: string;
  url: string;
  api_link?: string;
  api_text?: string;
};

const extractCityFromAddress = (address: string): City => {
  const match = address.match(/Junkers [Kk]øreskole\s+([A-Za-zæøåÆØÅ]+)/);
  return (match?.[1] as City) ?? "Alle";
};

const splitStartDate = (fullDate: string) => {
  const parts = fullDate.split(" ");
  const weekday = parts[0];
  const date = parts.slice(1).join(" ");
  return { weekday, date };
};

const CourseList = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState<City>("Alle");

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
      setLoading(false);
    };
    loadCourses();

    // Set city filter based on URL parameter
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    if (cityParam) {
      // Capitalize first letter to match cityOptions format
      const capitalizedCity =
        cityParam.charAt(0).toUpperCase() + cityParam.slice(1).toLowerCase();
      if (cityOptions.includes(capitalizedCity as Exclude<City, "Alle">)) {
        setCityFilter(capitalizedCity as City);
      }
    }
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const courseMatchesCity = (course: Course, city: City) => {
    const courseCity = extractCityFromAddress(course.address);
    return city === "Alle" || courseCity === city;
  };

  const filteredCourses = courses
    .filter((course) => courseMatchesCity(course, cityFilter))
    .filter((course) => course.capacity - course.reservations > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Form */}
      <form
        className="filter flex justify-center gap-2"
        onReset={() => setCityFilter("Alle")}
      >
        <input
          className="btn btn-square md:btn-lg text-2xl"
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
        {/* <button className="btn md:btn-lg border-2 border-base-300"></button> */}
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
          {filteredCourses.map((course) => {
            const time = `${course.start} - ${course.end}`;
            const seatsLeft = course.capacity - course.reservations;
            const city = extractCityFromAddress(course.address);
            const { weekday, date } = splitStartDate(course.start_date);

            return (
              <div
                key={course.id}
                className="w-[350px] rounded-xl border border-base-200 bg-base-200 p-6 shadow-md flex flex-col justify-between relative"
              >
                <div className="flex flex-col gap-3 ">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaCalendarCheck className="text-primary" size={21} />
                    <span className="pt-1">{date}</span>
                  </h2>
                  <p className="flex items-center gap-2 text-sm text-base-content">
                    <FaClock className="text-base-content" />
                    {weekday}, {time}
                  </p>
                  <p className="text-sm font-semibold text-base-content">
                    {city} - {course.title}
                  </p>
                  {seatsLeft <= 5 && (
                    <p className=" font-bold absolute right-3 top-4 badge badge-error badge-soft badge-sm">
                      {t("coursePage.fewSeatsLeft")}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 gap-2">
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {t("coursePage.register")} <FaUpRightFromSquare />
                  </a>
                  <button onClick={openModal} className="btn btn-soft">
                    {t("coursePage.viewSchedule")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal med statisk billede */}
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
