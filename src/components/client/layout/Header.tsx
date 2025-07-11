"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXmark,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Language from "./Language";
import LanguageAdmin from "@/components/admin/layout/LanguageAdmin";

const Header = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const [openDropdown, setOpenDropdown] = useState<
    null | "prices" | "cities" | "information"
  >(null);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      if (
        !Array.from(dropdowns).some((dropdown) =>
          dropdown.contains(event.target as Node)
        )
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseDrawer = () => {
    const drawerCheckbox = document.getElementById(
      "my-drawer-4"
    ) as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  return (
    <div className="navbar fixed top-0 inset-x-0 z-50 max-w-[1536px] mx-auto md:py-5 py-7 bg-base-100">
      <div className="flex-1 cursor-pointer">
        <Link
          href="/"
          className="pl-4 flex items-center gap-2"
          aria-label={t("header.brandName")}
        >
          <Image
            src="/logo-jk.webp"
            alt={t("header.logoAlt")}
            width={200}
            height={200}
            className="h-auto w-48 md:h-auto md:w-52"
            priority
          />
        </Link>
      </div>
      <nav className="flex-none">
        <ul className="menu hidden md:flex menu-horizontal text-lg font-semibold gap-3 md:gap-5 items-center">
          <li
            className="relative dropdown-menu"
            onMouseEnter={() => setOpenDropdown("prices")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link href="/priser" aria-label={t("header.prices")}>
              {t("header.prices")}
            </Link>
            <AnimatePresence>
              {openDropdown === "prices" && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 -left-4 bg-base-100 shadow-xl w-52 px-2 py-3 z-30 flex flex-col items-start gap-3 rounded-lg menu"
                >
                  <li className="w-full">
                    <Link href="/priser/bil-korekort">
                      {t("header.dropdown.prices.car")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/priser/trailer-korekort">
                      {t("header.dropdown.prices.trailer")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/priser/traktor-korekort">
                      {t("header.dropdown.prices.tractor")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/priser/generhvervelse-korekort">
                      {t("header.dropdown.prices.reacquisition")}
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li
            className="relative dropdown-menu"
            onMouseEnter={() => setOpenDropdown("information")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link href="/information" aria-label={t("header.information")}>
              {t("header.information")}
            </Link>
            <AnimatePresence>
              {openDropdown === "information" && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 -left-4 bg-base-100 shadow-xl w-52 px-2 py-3 z-30 flex flex-col items-start gap-3 rounded-lg menu"
                >
                  <li className="w-full">
                    <Link href="/korekort-forlob">
                      {t("header.dropdown.information.steps")}
                    </Link>
                  </li>

                  <li className="w-full">
                    <Link href="/den-lille-hjaelper">
                      {t("header.dropdown.information.littleHelper")}
                    </Link>
                  </li>

                  <li className="w-full">
                    <Link href="/korelaererne">
                      {t("header.dropdown.information.teachers")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/om-os">
                      {t("header.dropdown.information.about")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/kontakt">
                      {t("header.dropdown.information.contact")}
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li
            className="relative dropdown-menu"
            onMouseEnter={() => setOpenDropdown("cities")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link href="/afdelinger" aria-label={t("header.departments")}>
              {t("header.departments")}
            </Link>
            <AnimatePresence>
              {openDropdown === "cities" && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 -left-4 bg-base-100 shadow-xl w-52 px-2 py-3 z-30 flex flex-col items-start gap-3 rounded-lg menu"
                >
                  <li className="w-full">
                    <Link href="/afdelinger/ribe">
                      {t("header.dropdown.city.ribe")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/afdelinger/billund">
                      {t("header.dropdown.city.billund")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/afdelinger/grindsted">
                      {t("header.dropdown.city.grindsted")}
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <li>
            <Link
              href="/tilmelding"
              className="btn btn-primary text-base"
              aria-label={t("header.registration")}
            >
              {t("header.registration")}
            </Link>
          </li>

          <li>
            <Language />
          </li>
        </ul>

        {/* Mobile Drawer */}
        <div className="drawer drawer-end flex md:hidden items-center">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-ghost"
            >
              <FaBars size={30} />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-100 min-h-full w-80 p-4 pt-24 gap-2 items-center">
              <li className="absolute top-6 right-3">
                <label htmlFor="my-drawer-4">
                  <FaXmark size={30} />
                </label>
              </li>
              <li className="text-xl font-semibold">
                <Link
                  href="/priser"
                  onClick={handleCloseDrawer}
                  aria-label={t("header.prices")}
                >
                  {t("header.prices")}
                </Link>
              </li>
              <li className="text-xl font-semibold">
                <Link href="/information" onClick={handleCloseDrawer}>
                  {t("header.information")}
                </Link>
              </li>
              <li className="text-xl font-semibold">
                <Link href="/afdelinger" onClick={handleCloseDrawer}>
                  {t("header.departments")}
                </Link>
              </li>
              <li className="text-xl font-semibold">
                <Link href="/kontakt" onClick={handleCloseDrawer}>
                  {t("header.dropdown.information.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tilmelding"
                  className="btn btn-primary py-2 mt-4 text-neutral-content"
                  onClick={handleCloseDrawer}
                >
                  {t("header.registration")}
                </Link>
              </li>
              <div className="flex flex-col items-center gap-6 flex-1 justify-center w-full">
                <span className="text-lg font-bold">
                  {t("header.followUs")}
                </span>
                <div className="flex gap-6">
                  <Link
                    href="https://www.facebook.com/drivinglicensgrindsted"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center">
                      <FaFacebook className="text-3xl text-secondary" />
                    </div>
                    <span className="text-secondary font-bold">
                      {t("header.facebook")}
                    </span>
                  </Link>
                  <Link
                    href="https://www.instagram.com/junkers_koereskole/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center">
                      <FaInstagram className="text-3xl text-secondary" />
                    </div>
                    <span className="text-secondary font-bold">
                      {t("header.instagram")}
                    </span>
                  </Link>
                  <Link
                    href="https://www.tiktok.com/@junkerskoreskole"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center">
                      <FaTiktok className="text-3xl text-secondary" />
                    </div>
                    <span className="text-secondary font-bold">
                      {t("header.tiktok")}
                    </span>
                  </Link>
                </div>
              </div>
              <li className="mb-7">
                <LanguageAdmin />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
