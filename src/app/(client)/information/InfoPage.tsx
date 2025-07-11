"use client";
import Link from "next/link";
import { FaUserTie, FaPhoneAlt, FaBookOpen } from "react-icons/fa";
import { FaPeopleGroup, FaRoute, FaTreeCity } from "react-icons/fa6";

const InfoPage = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Information</h1>
      <p className="text-lg text-gray-700 mb-10 max-w-3xl">
        Velkommen til Junkers Køreskole. Her finder du alle de vigtigste
        informationer om Junkers Køreskole – vores team, hvordan du kontakter
        os, og hjælpemidler der støtter dig i dit forløb.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          title="Kørekortforløbet"
          description="Find din nærmeste afdeling og se vores lokationer."
          icon={<FaRoute className="text-2xl text-primary" />}
          href="/korekort-forlob"
        />
        <InfoCard
          title="Den lille hjælper"
          description="Et digitalt værktøj til at forstå teori og færdselsregler nemmere."
          icon={<FaBookOpen className="text-2xl text-primary" />}
          href="/den-lille-hjaelper"
        />
        <InfoCard
          title="Vores kørelærere"
          description="Lær vores erfarne og passionerede kørelærere at kende."
          icon={<FaUserTie className="text-2xl text-primary" />}
          href="/korelaererne"
        />
        <InfoCard
          title="Tilmelding"
          description="Tilmeld dig nemt og hurtigt til vores køreskole."
          icon={<FaPeopleGroup className="text-2xl text-primary" />}
          href="/tilmelding"
        />
        <InfoCard
          title="Kontakt os"
          description="Få fat i os – find telefonnumre, adresser og åbningstider."
          icon={<FaPhoneAlt className="text-2xl text-primary" />}
          href="/kontakt"
        />
        <InfoCard
          title="Alle afdelinger"
          description="Find din nærmeste afdeling og se vores lokationer."
          icon={<FaTreeCity className="text-2xl text-primary" />}
          href="/afdelinger"
        />
      </div>
    </section>
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
    <div className="rounded-xl bg-base-200 ring-2 ring-base-300 md:hover:bg-base-300 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 ease-in-out gap-3 shadow-lg cursor-pointer flex flex-col p-5 h-30">
      <div className="flex items-center gap-4">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  </Link>
);

export default InfoPage;
