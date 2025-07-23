import React, { useState } from "react";
import Image from "next/image";
import { FaXmark, FaPlay } from "react-icons/fa6";
import { useTranslation } from "next-i18next";

const Preview = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8 px-4 h-full lg:rounded-xl py-10 md:py-15 lg:py-20">
        <h2 className="text-xl md:text-[28px] font-bold text-center mb-5">
          {t("home.preview.title")}
        </h2>
        <div
          className="relative w-full max-h-96 max-w-[800px] overflow-hidden rounded-lg cursor-pointer group"
          onClick={openModal}
        >
          <Image
            src="/grindsted.webp"
            alt="Video preview"
            width={855}
            height={481}
            className="w-full h-auto block rounded-lg transition-transform group-hover:scale-101"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 group-hover:bg-black/35 transition-all">
            <div className="flex flex-col items-center justify-center gap-4 mt-7">
              <div className="bg-white bg-opacity-90 rounded-full p-4 md:p-6 shadow-lg group-hover:bg-opacity-100 transition-all">
                <FaPlay className="text-2xl md:text-4xl text-gray-800 ml-1" />
              </div>
              <h5 className="text-base-100 font-bold">Se video</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box p-0 w-[95%] max-w-6xl overflow-auto relative touch-auto bg-transparent">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 btn btn-circle btn-sm md:btn-lg opacity-50"
            >
              <FaXmark size={24} />
            </button>
            <div className="w-full">
              <video
                controls
                autoPlay
                className="w-full h-full rounded-lg"
                poster="/thumbnail-video.png"
              >
                <source src="/video/jk-preview.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
    </>
  );
};

export default Preview;
