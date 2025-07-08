import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaLocationArrow,
  FaLocationDot,
  FaPeopleGroup,
  FaPhone,
} from "react-icons/fa6";
import Link from "next/link";

type Props = {
  slug: "ribe" | "billund" | "grindsted";
};

const AddressCards = ({ slug }: Props) => {
  const { t } = useTranslation();
  const address = t(`departmentPage.${slug}.address`);
  const phone = t(`departmentPage.common.phone`);
  const mail = t(`departmentPage.common.mail`);
  const registerBtn = t(`departmentPage.common.registerBtn`);
  const mapBtn = t(`departmentPage.common.mapBtn`);
  const mapsLink = `https://www.google.com/maps?q=${encodeURIComponent(
    address
  )}`;

  return (
    <div className="bg-base-200 h-full p-5 md:p-7 rounded-lg flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center">
          <FaLocationDot className="text-xl text-primary" />
          <Link
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base lg:text-lg font-semibold link link-hover"
          >
            {address}
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <FaPhone className="text-xl" />
          <h2 className="text-base lg:text-lg font-semibold">{phone}</h2>
        </div>
        <div className="flex gap-3 items-center">
          <FaEnvelope className="text-xl" />
          <h2 className="text-base lg:text-lg font-semibold">{mail}</h2>
        </div>
      </div>
      <div className="flex gap-5">
        <div>
          <Link href="/tilmelding" className="btn btn-primary">
            <FaPeopleGroup size={20} />
            {registerBtn}
          </Link>
        </div>
        <div>
          <Link href={mapsLink} className="btn btn-neutral">
            <FaLocationArrow />
            {mapBtn}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddressCards;
