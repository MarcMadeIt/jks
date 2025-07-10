import React from "react";

const Preview = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 h-full bg-[#111] lg:rounded-xl">
      <h2 className="text-xl md:text-3xl font-bold text-center text-base-100">
        Få et indblik i vores undervisning
      </h2>
      <div className="w-full max-w-[855px] overflow-hidden ">
        <video
          controls
          className="w-full h-auto block rounded-lg border-black border-4 bg-[#000]"
          poster="/thumbnail-video.png"
        >
          <source src="/video/jk-preview.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Preview;
