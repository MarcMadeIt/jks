"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";

const StepsContent = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-20 md:mt-0 space-y-12 flex flex-col">
      <h1 className="text-4xl font-bold mb-8">{t("stepsContent.title")}</h1>

      <section id="introduction" className="card">
        <p className="whitespace-pre-line">{t("stepsContent.intro")}</p>
      </section>

      <section id="requirements" className="card">
        <h2 className="text-2xl font-semibold mb-2">
          {t("stepsContent.requirements.title")}
        </h2>
        <ul className="list-disc pl-5">
          <li>{t("stepsContent.requirements.1")}</li>
          <li>{t("stepsContent.requirements.2")}</li>
          <li>{t("stepsContent.requirements.3")}</li>
          <li>{t("stepsContent.requirements.4")}</li>
          <li>{t("stepsContent.requirements.5")}</li>
          <li>{t("stepsContent.requirements.6")}</li>
          <li>{t("stepsContent.requirements.7")}</li>
        </ul>
      </section>

      <ul className="timeline timeline-vertical lg:timeline-horizontal">
        <li>
          <div className="timeline-end timeline-box border-2 border-base-300">
            {t("stepsContent.timeline.theory")}
          </div>
          <div className="timeline-middle">
            <FaCheckCircle className="text-primary" size={25} />
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-start timeline-box border-2 border-base-300">
            {t("stepsContent.timeline.maneuver")}
          </div>
          <div className="timeline-middle">
            <FaCheckCircle className="text-primary" size={25} />
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-end timeline-box border-2 border-base-300">
            {t("stepsContent.timeline.theoryTest")}
          </div>
          <div className="timeline-middle">
            <FaCheckCircle className="text-primary" size={25} />
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-start timeline-box border-2 border-base-300">
            {t("stepsContent.timeline.techCourse")}
          </div>
          <div className="timeline-middle">
            <FaCheckCircle className="text-primary" size={25} />
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-end timeline-box border-2 border-base-300">
            {t("stepsContent.timeline.drivingTest")}
          </div>
          <div className="timeline-middle">
            <FaCheckCircle className="text-primary" size={25} />
          </div>
        </li>
      </ul>
      <section id="theory" className="card">
        <h2 className="text-2xl font-semibold mb-2">
          {t("stepsContent.theory.title")}
        </h2>
        <p>{t("stepsContent.theory.text")}</p>
      </section>

      <section id="maneuver" className="card">
        <h2 className="text-2xl font-semibold mb-2">
          {t("stepsContent.maneuver.title")}
        </h2>
        <p className="mb-2">{t("stepsContent.maneuver.text")}</p>
        <ul className="list-disc pl-5">
          <li>{t("stepsContent.maneuver.1")}</li>
          <li>{t("stepsContent.maneuver.2")}</li>
          <li>{t("stepsContent.maneuver.3")}</li>
          <li>{t("stepsContent.maneuver.4")}</li>
          <li>{t("stepsContent.maneuver.5")}</li>
          <li>{t("stepsContent.maneuver.6")}</li>
          <li>{t("stepsContent.maneuver.7")}</li>
          <li>{t("stepsContent.maneuver.8")}</li>
        </ul>
        <p className="mt-4">{t("stepsContent.maneuver.road")}</p>
      </section>

      <section id="theory_test" className="card">
        <h2 className="text-2xl font-semibold mb-2">
          {t("stepsContent.theory_test.title")}
        </h2>
        <p>{t("stepsContent.theory_test.text")}</p>
      </section>

      <section id="tech_course" className="card">
        <h2 className="text-2xl font-semibold mb-2">
          {t("stepsContent.tech_course.title")}
        </h2>
        <p>{t("stepsContent.tech_course.text")}</p>
        <p className="mt-2">{t("stepsContent.tech_course.transport")}</p>
      </section>

      <section id="driving_test" className="card">
        <h2 className="text-2xl font-semibold mb-2">
          {t("stepsContent.driving_test.title")}
        </h2>
        <p>{t("stepsContent.driving_test.text")}</p>
      </section>
    </div>
  );
};

export default StepsContent;
