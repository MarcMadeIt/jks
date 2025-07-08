import HelperMenu from "@/components/client/helper/HelperMenu";
import LittleHelper from "@/components/client/helper/LittleHelper";
import React from "react";

const HelperPage = () => {
  return (
    <div className="flex justify-center px-4 md:px-12">
      <div className="flex gap-5 w-full max-w-7xl">
        <HelperMenu />
        <LittleHelper />
      </div>
    </div>
  );
};

export default HelperPage;
