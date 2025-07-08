"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const LittleHelper = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-20 md:mt-0">
      <h1 className="text-4xl font-bold mb-8">Den Lille Hjælper</h1>

      <div className="space-y-12">
        <section id="vehicle_dimensions" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.vehicle_dimensions")}
          </h2>
          <p>{t("littleHelper.vehicle_dimensions.text")}</p>
        </section>

        <section id="alcohol" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.alcohol")}
          </h2>
          <p>{t("littleHelper.alcohol.limit")}</p>
          <ul className="list-disc pl-5">
            <li>{t("littleHelper.alcohol.list.1")}</li>
            <li>{t("littleHelper.alcohol.list.2")}</li>
            <li>{t("littleHelper.alcohol.list.3")}</li>
            <li>{t("littleHelper.alcohol.list.4")}</li>
          </ul>
          <p className="mt-2">{t("littleHelper.alcohol.note")}</p>
        </section>

        <section id="warning_triangle" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.warning_triangle")}
          </h2>
          <p>{t("littleHelper.warning_triangle.text")}</p>
        </section>

        <section id="towing" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.towing")}
          </h2>
          <p>{t("littleHelper.towing.text")}</p>
        </section>

        <section id="road_risks" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.road_risks")}
          </h2>
          <ul className="list-disc pl-5">
            <li>{t("littleHelper.road_risks.list.1")}</li>
            <li>{t("littleHelper.road_risks.list.2")}</li>
            <li>{t("littleHelper.road_risks.list.3")}</li>
            <li>{t("littleHelper.road_risks.list.4")}</li>
            <li>{t("littleHelper.road_risks.list.5")}</li>
          </ul>
        </section>

        <section id="police_signals" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.police_signals")}
          </h2>
          <p className="mb-4 text-base">
            {t("littleHelper.police_signals.intro")}
          </p>
          <ul className="list-disc list-inside mb-4 text-base">
            <li>{t("littleHelper.police_signals.1")}</li>
            <li>{t("littleHelper.police_signals.2")}</li>
            <li>{t("littleHelper.police_signals.3")}</li>
            <li>{t("littleHelper.police_signals.4")}</li>
          </ul>
          <p className="mb-4 text-base">
            {t("littleHelper.police_signals.reminder")}
          </p>
          <Image
            src="/police_signals.webp"
            alt="Politiets tegn"
            width={600}
            height={400}
            className="w-[80%] h-auto mt-1"
          />
        </section>

        <section id="speed_limits" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.speed_limits")}
          </h2>
          <ul className="list-disc pl-5">
            <li>{t("littleHelper.speed_limits.urban")}</li>
            <li>{t("littleHelper.speed_limits.rural")}</li>
            <li>{t("littleHelper.speed_limits.express")}</li>
            <li>{t("littleHelper.speed_limits.motorway")}</li>
          </ul>
        </section>

        <section id="yield" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.yield")}
          </h2>
          <h3 className="font-semibold">
            {t("littleHelper.yield.unconditional_title", "Ubetinget vigepligt")}
          </h3>
          <p>{t("littleHelper.yield.unconditional")}</p>
          <h3 className="font-semibold">
            {t("littleHelper.yield.right_title", "Højre vigepligt")}
          </h3>
          <p>{t("littleHelper.yield.right")}</p>
        </section>

        <section id="stopping_parking" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.stopping_parking")}
          </h2>
          <h3 className="font-semibold">
            {t(
              "littleHelper.stopping_parking.stopping_title",
              "Hvad er en standsning"
            )}
          </h3>
          <p>{t("littleHelper.stopping_parking.stopping")}</p>
          <h3 className="font-semibold">
            {t(
              "littleHelper.stopping_parking.parking_title",
              "Hvad er en parkering"
            )}
          </h3>
          <p>{t("littleHelper.stopping_parking.parking")}</p>
          <h3 className="font-semibold">
            {t(
              "littleHelper.stopping_parking.no_stop_title",
              "Forbud mod standsning"
            )}
          </h3>
          <p>{t("littleHelper.stopping_parking.no_stop")}</p>
          <h3 className="font-semibold">
            {t(
              "littleHelper.stopping_parking.no_parking_title",
              "Forbud mod parkering"
            )}
          </h3>
          <p>{t("littleHelper.stopping_parking.no_parking")}</p>
        </section>

        <section id="lane_merge" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.lane_merge")}
          </h2>
          <p>{t("littleHelper.lane_merge.text")}</p>
          <Image
            src="/merging.webp"
            alt="Sammenfletning"
            width={600}
            height={400}
            className="w-[80%] md:w-[50%] h-auto mt-3"
          />
        </section>

        <section id="overtaking" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.overtaking")}
          </h2>
          <ul className="list-disc pl-5">
            <li>{t("littleHelper.overtaking.1")}</li>
            <li>{t("littleHelper.overtaking.2")}</li>
            <li>{t("littleHelper.overtaking.3")}</li>
            <li>{t("littleHelper.overtaking.4")}</li>
            <li>{t("littleHelper.overtaking.5")}</li>
          </ul>
        </section>

        <section id="driving_dark" className="card">
          <h2 className="text-2xl font-semibold mb-2">
            {t("littleHelper.driving_dark")}
          </h2>
          <ul className="list-disc pl-5">
            <li>{t("littleHelper.driving_dark.1")}</li>
            <li>{t("littleHelper.driving_dark.2")}</li>
            <li>{t("littleHelper.driving_dark.3")}</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LittleHelper;
