"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaXmark, FaPlay } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import CTA from "../home/CTA";

const StepsContent = () => {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
      <section id="video_preview">
        <h2 className="text-2xl font-semibold">
          {t("stepsContent.teaser.title")}
        </h2>
        <div className="flex flex-col items-start justify-center gap-8  h-full lg:rounded-xl py-2 pb-5">
          <div
            className="relative w-full max-h-[400px] max-w-[750px] overflow-hidden rounded-lg cursor-pointer group"
            onClick={openModal}
          >
            <Image
              src="/thumbnail2.png"
              alt="Video preview"
              width={855}
              height={481}
              className="w-full h-auto block rounded-lg transition-transform group-hover:scale-101"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
              <div className="flex flex-col items-center justify-center gap-4 lg:mt-7">
                <div className="bg-base-200 bg-opacity-90 rounded-2xl p-5 lg:p-7 shadow-lg group-hover:bg-opacity-100 transition-all btn btn-lg:btn-lg">
                  <FaPlay className="text-2xl lg:text-3xl text-gray-800 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="modal modal-open">
            <div className="modal-box p-0 w-[95%] max-w-6xl overflow-auto relative touch-auto bg-transparent">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 btn btn-circle btn-sm md:btn-lg opacity-50"
              >
                <FaXmark size={24} />
              </button>
              <div className="w-full">
                <video
                  controls
                  autoPlay
                  className="w-full h-full rounded-lg"
                  poster="/thumbnail2.png"
                >
                  <source src="/video/jk-preview.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="modal-backdrop" onClick={closeModal}></div>
          </div>
        )}
      </section>
      <CTA />
    </div>
  );
};

export default StepsContent;
