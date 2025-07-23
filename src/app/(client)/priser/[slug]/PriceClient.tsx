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
  data: any[]; // eller mere præcis hvis du vil: PackageWithFeatures[]
};

const PriceClient = ({ slug, data }: Props) => {
  const { t } = useTranslation();

  const seoTitle = t(`pricePage.${slug}.title`);
  const seoSubTitle = t(`pricePage.${slug}.subtitle`);
  const seoBtn = t(`pricePage.common.btn`);

  return (
    <section className="p-3 sm:p-7 w-full h-full flex flex-col gap-7 md:gap-15 justify-center items-center relative my-7 md:my-20">
      <div className="max-w-sm md:max-w-4xl  text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {seoTitle}
        </h1>
        <span className=" font-medium text-lg">{seoSubTitle}</span>
      </div>

      <div className="flex flex-col justify-center gap-10 md:gap-15">
        {slug === "bil-korekort" && <CarPlans data={data} />}
        {slug === "trailer-korekort" && <TrailerPlans data={data} />}
        {slug === "traktor-korekort" && <TractorPlans data={data} />}
        {slug === "generhvervelse-korekort" && <RetakePlans data={data} />}

        <div className="p-5 md:p-10 bg-base-200 rounded-lg max-w-full w-full flex-1 overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-col gap-3 mb-5">
              <h2 className="text-xl md:text-2xl font-semibold">
                Klar til at tage kørekort?
              </h2>
              <p className="max-w-md text-base tracking-wide">
                Tag første skridt. Se vores kommende hold og tilmeld dig, når du
                er klar – vi hjælper dig godt på vej.
              </p>
            </div>
            <div className="justify-end">
              <Link href="/tilmelding" className="btn md:btn-lg btn-primary">
                {seoBtn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceClient;
