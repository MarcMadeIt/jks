"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleLeft, FaCaretDown, FaVideo } from "react-icons/fa6";
import Link from "next/link";

const menuItems = [
  { href: "#vehicle_dimensions", key: "vehicle_dimensions" },
  { href: "#alcohol", key: "alcohol" },
  { href: "#warning_triangle", key: "warning_triangle" },
  { href: "#towing", key: "towing" },
  { href: "#car_walkthrough", key: "car_walkthrough", hasVideo: true },
  { href: "#road_risks", key: "road_risks" },
  { href: "#police_signals", key: "police_signals" },
  { href: "#speed_limits", key: "speed_limits" },
  { href: "#yield", key: "yield" },
  { href: "#stopping_parking", key: "stopping_parking" },
  { href: "#lane_merge", key: "lane_merge" },
  { href: "#overtaking", key: "overtaking" },
  { href: "#driving_dark", key: "driving_dark" },
];

const HelperMenu = () => {
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
              Den lille hjælper
            </a>
            <ul>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                  >
                    {t(`helperMenu.${item.key}`)}
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
          <Link href="/information" className="btn btn-neutral btn-soft">
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
                <a href="">Den Lille Hjælper</a>
                <ul className="gap-2 flex flex-col">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => handleClick(e, item.href)}
                        className="py-1 flex items-center"
                      >
                        {t(`helperMenu.${item.key}`)}
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

export default HelperMenu;
