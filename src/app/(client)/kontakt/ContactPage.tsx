"use client";

import OfferForm from "@/components/client/forms/ContactForm";
import Image from "next/image";
import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <section className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
      <div className="max-w-md md:max-w-xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("contactPage.title")}
        </h1>
      </div>
      <motion.div
        className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex-initial lg:w-3/5 flex justify-center">
          <OfferForm />
        </div>
        <div className="flex-1 lg:w-2/5 relative">
          <motion.div
            className="bg-base-100 rounded-lg shadow-md p-8 md:p-10 flex flex-col gap-5 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="text-xl font-bold">{t("contactPage.readyTitle")}</h3>
            <p className="font-medium">{t("contactPage.contactPrompt")}</p>
            <p>{t("contactPage.ambitionMessage")}</p>

            <a
              href="tel:+4522771246"
              className="flex items-center gap-2 text-secondary text-lg font-bold"
            >
              <FaPhone size={20} /> {t("contactPage.phoneNumber")}
            </a>
            <a
              href={`mailto:${t("contactPage.emailAddress")}`}
              className="flex items-center gap-2 text-secondary text-base font-bold"
            >
              <FaEnvelope size={20} /> {t("contactPage.emailAddress")}
            </a>
          </motion.div>
          <Image
            src="/jk-flag.png"
            alt={t("contactPage.imageAlt")}
            width={200}
            height={200}
            className="w-32 h-auto absolute bottom-10 right-32 hidden lg:block"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default ContactPage;
