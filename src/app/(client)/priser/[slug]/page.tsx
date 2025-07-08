"use client";

import { useParams } from "next/navigation";
import PriceClient from "./PriceClient";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const allowedSlugs = [
  "bil-korekort",
  "trailer-korekort",
  "traktor-korekort",
  "generhvervelse-korekort",
] as const;

type ProductSlug = (typeof allowedSlugs)[number];

export default function Page() {
  const { slug } = useParams() as { slug?: string };
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!slug || !allowedSlugs.includes(slug as ProductSlug)) {
    return <div className="p-6">Ikke fundet</div>;
  }

  const typedSlug = slug as ProductSlug;

  return <PriceClient slug={typedSlug} />;
}
