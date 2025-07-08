"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaComment, FaGear, FaHouse, FaList } from "react-icons/fa6";
import { readUserSession } from "@/lib/auth/readUserSession";
import { useTranslation } from "react-i18next";
import "@/i18n/config";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const session = await readUserSession();
      if (session) {
        setRole(session.role);
      } else {
        setRole(null);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between bg-base-100 rounded-lg sm:fixed sm:h-full md:py-0 md:pr-0">
      <div className="flex flex-col sm:gap-5 h-full ">
        <div className="flex flex-col items-center justify-center h-32 w-full text-xl">
          <Image src="/jk-flag.png" alt="" width={60} height={60} />
          <span className="font-bold mt-1">ADMIN</span>
        </div>
        <div className="hidden sm:flex">
          <ul className="menu menu-lg gap-2 rounded-box w-56 xl:w-72">
            <li>
              <Link
                className={pathname === "/admin" ? "menu-active" : ""}
                href="/admin"
                aria-label={t("aria.navigation.linkToOverview")}
              >
                {t("overview")}
              </Link>
            </li>
            <li>
              <Link
                className={pathname === "/admin/content" ? "menu-active" : ""}
                href="/admin/content"
                aria-label={t("aria.navigation.linkToContent")}
              >
                {t("content")}
              </Link>
            </li>
            {role === "admin" && (
              <>
                <li>
                  <Link
                    className={
                      pathname === "/admin/messages" ? "menu-active" : ""
                    }
                    href="/admin/messages"
                    aria-label={t("aria.navigation.linkToCustomers")}
                  >
                    {t("customers")}
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      pathname === "/admin/settings" ? "menu-active" : ""
                    }
                    href="/admin/settings"
                    aria-label={t("aria.navigation.linkToSettings")}
                  >
                    {t("settings")}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="flex flex-col items-center sm:hidden fixed bottom-5 left-1/2 transform -translate-x-1/2 justify-center z-30 max-w-[300px] w-full">
          <ul className="menu menu-horizontal bg-base-200 rounded-box flex-wrap justify-center max-w-md w-full gap-4">
            <li>
              <Link
                href="/admin"
                className={pathname === "/admin" ? "active" : ""}
                aria-label={t("aria.navigation.linkToOverview")}
              >
                <FaHouse size={25} />
              </Link>
            </li>
            <li>
              <Link
                href="/admin/content"
                className={pathname === "/admin/content" ? "active" : ""}
                aria-label={t("aria.navigation.linkToContent")}
              >
                <FaList size={25} />
              </Link>
            </li>
            {role === "admin" && (
              <>
                <li>
                  <Link
                    href="/admin/messages"
                    className={pathname === "/admin/messages" ? "active" : ""}
                    aria-label={t("aria.navigation.linkToCustomers")}
                  >
                    <FaComment size={25} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className={pathname === "/admin/settings" ? "active" : ""}
                    aria-label={t("aria.navigation.linkToSettings")}
                  >
                    <FaGear size={25} />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="flex-col gap-10 items-center justify-center w-full p-4 absolute bottom-0 hidden sm:flex">
        <span className="text-zinc-500 text-[11px] flex items-center justify-center gap-0.5">
          © {new Date().getFullYear()} Powered by{" "}
          <span className="font-bold">Arzonic</span>
        </span>
      </div>
    </div>
  );
};

export default Navbar;
