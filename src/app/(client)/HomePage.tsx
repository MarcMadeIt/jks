"use client";

import CTA from "@/components/client/home/CTA";
// import Cars from "@/components/client/home/Cars";
import Hero from "@/components/client/home/Hero";
import Locations from "@/components/client/home/Locations";
import News from "@/components/client/home/News";
import Preview from "@/components/client/home/Preview";
import PricesCards from "@/components/client/home/PricesCards";
import Reviews from "@/components/client/home/Reviews";

const HomePage = () => {
  return (
    <>
      <section className="h-full">
        <Hero />
      </section>
      <section className="h-60 md:h-64 ">
        <Locations />
      </section>
      <section className="w-full md:h-96">
        <Reviews />
      </section>
      <section className="h-full ">
        <PricesCards showTitle={true} />
      </section>
      <section className="h-full">
        <News />
      </section>
      <section className="h-full">
        <Preview />
      </section>
      <section className="h-full">
        <CTA />
      </section>
    </>
  );
};

export default HomePage;
