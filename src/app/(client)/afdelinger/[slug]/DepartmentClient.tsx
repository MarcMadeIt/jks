"use client";

import { useTranslation } from "react-i18next";

import Hero from "@/components/client/afdelinger/Hero";
import AddressCards from "@/components/client/afdelinger/AddressCards";
import PricesCards from "@/components/client/home/PricesCards";
import ImagesGroup from "@/components/client/afdelinger/ImagesGroup";

type Props = {
  slug: "ribe" | "billund" | "grindsted";
};

const DepartmentClient = ({ slug }: Props) => {
  const { t } = useTranslation();

  const seoTitle = t(`departmentPage.${slug}.title`);
  const seoDesc = t(`departmentPage.${slug}.desc`);

  return (
    <section>
      <Hero slug={slug} />
      <div className="p-5 sm:p-7 md:p-12 py-7 w-full h-full flex flex-col gap-14 md:gap-24 justify-center items-center relative mb-14 md:mb-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-7 lg:gap-32 w-full">
          <div className="flex-1 flex flex-col gap-3 max-w-3xl">
            <h2 className="text-lg md:text-2xl font-bold">{seoTitle}</h2>
            <p className="tracking-wide lg:text-lg">{seoDesc}</p>
          </div>
          <div className="w-full md:w-96">
            <AddressCards slug={slug} />
          </div>
        </div>
        <ImagesGroup />
        <PricesCards />
      </div>
    </section>
  );
};

export default DepartmentClient;
