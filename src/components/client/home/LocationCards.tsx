import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationCards = () => {
  const locations = [
    {
      city: "Ribe",
      href: "/afdelinger/ribe",
    },
    {
      city: "Billund",
      href: "/afdelinger/billund",
    },
    {
      city: "Grindsted",
      href: "/afdelinger/grindsted",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-5 md:gap-10">
      {locations.map((location, index) => (
        <motion.div
          key={location.href}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <Link
            href={location.href}
            className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-base-200 ring-2 ring-base-300 p-3 md:p-4 lg:p-5 md:hover:bg-base-300 active:scale-[0.95]  transition-all duration-300 ease-in-out shadow-lg max-w-[500px]"
          >
            <FaMapMarkerAlt className="text-base md:text-xl lg:text-2xl text-primary" />
            <h2 className="text-base md:text-lg lg:text-xl font-semibold">
              {location.city}
            </h2>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default LocationCards;
