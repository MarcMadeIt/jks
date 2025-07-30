import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";
import { FaUserTie, FaPhoneAlt, FaBookOpen } from "react-icons/fa";
import { FaPeopleGroup, FaRoute, FaTreeCity } from "react-icons/fa6";

const InfoCards = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-7 md:gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-6xl">
      <InfoCard
        title={t("infoCards.korekortforlob.title")}
        description={t("infoCards.korekortforlob.description")}
        icon={<FaRoute className="text-2xl text-primary" />}
        href="/korekort-forlob"
      />
      <InfoCard
        title={t("infoCards.denlillehjaelper.title")}
        description={t("infoCards.denlillehjaelper.description")}
        icon={<FaBookOpen className="text-2xl text-primary" />}
        href="/den-lille-hjaelper"
      />
      <InfoCard
        title={t("infoCards.korelaererne.title")}
        description={t("infoCards.korelaererne.description")}
        icon={<FaUserTie className="text-2xl text-primary" />}
        href="/korelaererne"
      />
      <InfoCard
        title={t("infoCards.tilmelding.title")}
        description={t("infoCards.tilmelding.description")}
        icon={<FaPeopleGroup className="text-2xl text-primary" />}
        href="/tilmelding"
      />
      <InfoCard
        title={t("infoCards.kontakt.title")}
        description={t("infoCards.kontakt.description")}
        icon={<FaPhoneAlt className="text-2xl text-primary" />}
        href="/kontakt"
      />
      <InfoCard
        title={t("infoCards.about.title")}
        description={t("infoCards.about.description")}
        icon={<FaTreeCity className="text-2xl text-primary" />}
        href="/om-os"
      />
    </div>
  );
};

type InfoCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
};

const InfoCard = ({ title, description, icon, href }: InfoCardProps) => (
  <Link href={href}>
    <div className="rounded-xl bg-base-200 ring-2 ring-base-300 md:hover:bg-base-300 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 ease-in-out gap-3 shadow-lg cursor-pointer flex flex-col p-5 h-32">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  </Link>
);

export default InfoCards;
