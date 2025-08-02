"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleLeft, FaCaretDown, FaVideo } from "react-icons/fa6";
import Link from "next/link";

const stepsItems = [
  { href: "#overview", key: "overview" },
  { href: "#requirements", key: "requirements" },
  { href: "#theory", key: "theory" },
  { href: "#maneuver", key: "maneuver" },
  { href: "#theory_test", key: "theoryTest" },
  { href: "#tech_course", key: "techCourse" },
  { href: "#driving_test", key: "drivingTest" },
  { href: "#video_preview", key: "videoPreview", hasVideo: true },
];

const StepsMenu = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.substring(1));
      if (el) {
        const yOffset = -150;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Desktop menu (sticky sidebar) */}
      <div className="hidden md:block w-60 shrink-0 sticky top-28 h-fit">
        <ul className="menu bg-base-200 shadow rounded-box font-semibold gap-1 w-full">
          <li>
            <a href="#" className="font-bold">
              Kørekortforløbet
            </a>
            <ul>
              {stepsItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                  >
                    {t(`stepsMenu.${item.key}`)}
                    {item.hasVideo && <FaVideo className="ml-2" />}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      {/* Mobile dropdown */}
      <div className="md:hidden w-full fixed top-28 z-30">
        <div className="gap-3 flex items-center">
          <Link
            href="/information"
            className="btn btn-neutral btn-soft opacity-90"
          >
            <FaAngleLeft size={18} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-neutral btn-soft opacity-90"
          >
            Oversigt <FaCaretDown size={20} />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-base-200 rounded-box mt-2 shadow menu text-base font-semibold ml-16"
            >
              <li>
                <a href="">Kørekortforløbet</a>
                <ul className="gap-2 flex flex-col">
                  {stepsItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => handleClick(e, item.href)}
                        className="block py-1"
                      >
                        {t(`stepsMenu.${item.key}`)}
                        {item.hasVideo && <FaVideo className="ml-2" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default StepsMenu;
