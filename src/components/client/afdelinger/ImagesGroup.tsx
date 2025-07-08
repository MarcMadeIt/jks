import React from "react";
import Image from "next/image";

const ImagesGroup = () => {
  return (
    <div className="join join-vertical sm:join-horizontal justify-between w-full gap-5">
      <div className="avatar join-item">
        <div className="w-full md:max-w-72 lg:max-w-96  rounded">
          <Image
            src="/test-2.png"
            alt="Avatar"
            width={500}
            height={500}
            className="rounded"
          />
        </div>
      </div>
      <div className="avatar join-item hidden sm:flex">
        <div className="w-full md:max-w-72 lg:max-w-96 rounded">
          <Image
            src="/test-1.png"
            alt="Avatar"
            width={500}
            height={500}
            className="rounded"
          />
        </div>
      </div>
      <div className="avatar join-item hidden md:flex">
        <div className="w-full md:max-w-72 lg:max-w-96  rounded">
          <Image
            src="/test-image.png"
            alt="Avatar"
            width={500}
            height={500}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagesGroup;
