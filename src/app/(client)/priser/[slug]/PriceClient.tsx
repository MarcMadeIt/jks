"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import CarPlans from "@/components/client/pricing/CarPlans";
import TrailerPlans from "@/components/client/pricing/TrailerPlans";
import TractorPlans from "@/components/client/pricing/TractorPlans";
import RetakePlans from "@/components/client/pricing/RetakePlans";

type Props = {
  slug:
    | "bil-korekort"
    | "trailer-korekort"
    | "traktor-korekort"
    | "generhvervelse-korekort";
};

const PriceClient = ({ slug }: Props) => {
  const { t } = useTranslation();

  const seoTitle = t(`pricePage.${slug}.title`);
  const seoSubTitle = t(`pricePage.${slug}.subtitle`);

  const seoBtn = t(`pricePage.common.btn`);
  const cta = t(`pricePage.${slug}.cta`);

  return (
    <section className="p-3 sm:p-7 w-full h-full flex flex-col gap-7 md:gap-15 justify-center items-center relative my-7 md:my-20">
      <div className="max-w-sm md:max-w-xl  text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {seoTitle}
        </h1>
        <span className=" font-medium text-lg">{seoSubTitle}</span>
      </div>
      <div className="flex flex-col justify-center gap-10 md:gap-15">
        {slug === "bil-korekort" && <CarPlans />}
        {slug === "trailer-korekort" && <TrailerPlans />}
        {slug === "traktor-korekort" && <TractorPlans />}
        {slug === "generhvervelse-korekort" && <RetakePlans />}

        <div className="flex flex-col gap-5 items-center">
          {cta}
          <Link href="/tilmelding" className="btn btn-primary">
            {seoBtn}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PriceClient;
