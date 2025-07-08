import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCarSide, FaRepeat, FaTractor, FaTrailer } from "react-icons/fa6";

const PricesCards = () => {
  const { t } = useTranslation();

  const prices = [
    {
      key: "bil",
      icon: <FaCarSide />,
      href: "/priser/bil-korekort",
    },
    {
      key: "trailer",
      icon: <FaTrailer />,
      href: "/priser/trailer-korekort",
    },
    {
      key: "traktor",
      icon: <FaTractor />,
      href: "/priser/traktor-korekort",
    },
    {
      key: "generhvervelse",
      icon: <FaRepeat />,
      href: "/priser/generhvervelse-korekort",
    },
  ];

  return (
    <div className="h-full w-full text-7xl flex flex-col justify-center items-center">
      <h2 className="text-xl md:text-[28px] font-bold text-center mb-5  md:mb-10">
        {t("home.prices.title")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-7 p-4">
        {prices.map((price, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className=" "
          >
            <Link
              href={price.href}
              className="flex justify-center items-center rounded-xl bg-base-200 ring-2  ring-base-300 md:hover:bg-base-300 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 ease-in-out gap-3 shadow-lg relative p-2 w-36 h-22 md:w-50 md:h-28"
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-3xl md:text-[40px] "> {price.icon}</span>
                <h2 className="text-sm md:text-lg font-semibold">
                  {t(`priceCards.${price.key}.title`)}
                </h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricesCards;
