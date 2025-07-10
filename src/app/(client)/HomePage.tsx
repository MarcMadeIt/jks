"use client";

import Hero from "@/components/client/home/Hero";
import Locations from "@/components/client/home/Locations";
import News from "@/components/client/home/News";
import Preview from "@/components/client/home/Preview";
import PricesCards from "@/components/client/home/PricesCards";
import Reviews from "@/components/client/home/Reviews";
import Teachers from "@/components/client/home/Teachers";

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
      <section className="h-96 md:h-[500px]">
        <PricesCards />
      </section>
      <section className="h-96 md:h-[700px]">
        <Preview />
      </section>
      <section className="h-96">
        <News />
      </section>
      <section className="h-96">
        <Teachers />
      </section>
    </>
  );
};

export default HomePage;
