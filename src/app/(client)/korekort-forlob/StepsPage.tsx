"use client";

import React from "react";
import StepsMenu from "@/components/client/steps/StepsMenu";
import StepsContent from "@/components/client/steps/StepsContent";

const StepsPage = () => {
  return (
    <div className="flex justify-center px-4 md:px-12">
      <div className="flex gap-10 w-full max-w-7xl">
        <StepsMenu />
        <StepsContent />
      </div>
    </div>
  );
};

export default StepsPage;
