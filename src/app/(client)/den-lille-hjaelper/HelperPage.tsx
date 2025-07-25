import HelperMenu from "@/components/client/helper/HelperMenu";
import LittleHelper from "@/components/client/helper/LittleHelper";
import React from "react";

const HelperPage = () => {
  return (
    <section className="flex justify-center px-4 md:px-12">
      <div className="flex gap-10 w-full max-w-7xl">
        <HelperMenu />
        <LittleHelper />
      </div>
    </section>
  );
};

export default HelperPage;
