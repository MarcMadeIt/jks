import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import ConsentModal from "../modal/ConsentModal";
import TermsModal from "../modal/TermsModal";
import Image from "next/image";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-base-100 text-base-content p-10 border-base-300 border-t">
        <nav>
          <h5 className="footer-title">{t("footer.departments")}</h5>
          <Link href="/afdelinger/ribe" className="link link-hover">
            Ribe
          </Link>
          <Link href="/afdelinger/billund" className="link link-hover">
            Billund
          </Link>
          <Link href="/afdelinger/grindsted" className="link link-hover">
            Grindsted
          </Link>
        </nav>
        <nav>
          <h5 className="footer-title">{t("footer.aboutUs")}</h5>
          <Link
            href="/tilmelding"
            className="link link-hover"
            aria-label={t("aria.footer.linkToAbout", "Go to about us")}
          >
            Tilmelding
          </Link>

          <Link
            href="/"
            className="link link-hover"
            aria-label={t("aria.footer.linkToContact", "Go to contact")}
          >
            Information
          </Link>
          <Link
            href="/"
            className="link link-hover"
            aria-label={t("aria.footer.linkToJobs", "Go to jobs")}
          >
            Kørelærerne
          </Link>
        </nav>
        <nav>
          <h5 className="footer-title">{t("footer.legal", "Legal")}</h5>
          <TermsModal buttonText={t("terms_of_service")} variant="hover" />
          <ConsentModal buttonText={t("privacy_policy")} variant="hover" />
        </nav>
      </footer>
      <footer className="footer bg-base-100 text-base-content px-10 py-4">
        <aside className="flex items-center">
          <Image
            src="/jk-flag.png"
            alt=""
            width={100}
            height={100}
            className="h-auto w-12"
          />
          <p>
            <span className="font-semibold">{t("footer.brandName")}</span>
            <br />
            {t("footer.sloganSince")}
          </p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end mb-5">
          <div className="grid grid-flow-col gap-4 text-3xl items-center">
            <Link
              href="https://www.facebook.com/drivinglicensgrindsted"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hover:text-primary md:transition-colors md:duration-300"
              aria-label={t("aria.footer.linkToFacebook", "Go to Facebook")}
            >
              <FaFacebook size={30} />
            </Link>

            <Link
              href="https://www.instagram.com/junkers_koereskole/"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hover:text-primary md:transition-colors md:duration-300"
              aria-label={t("aria.footer.linkToInstagram", "Go to Instagram")}
            >
              <FaInstagram size={33} />
            </Link>
            <Link
              href="https://www.tiktok.com/@junkerskoreskole"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hover:text-primary md:transition-colors md:duration-300"
              aria-label={t("aria.footer.linkToInstagram", "Go to Instagram")}
            >
              <FaTiktok size={31} />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
