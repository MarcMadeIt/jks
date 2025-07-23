// app/[slug]/page.tsx
import {
  getCarPackages,
  getTrailerPackages,
  getTractorPackages,
  getRetakePackages,
  getFeaturesByPackageId,
} from "@/lib/client/actions";
import PriceClient from "./PriceClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

const allowedSlugs = [
  "bil-korekort",
  "trailer-korekort",
  "traktor-korekort",
  "generhvervelse-korekort",
] as const;

type ProductSlug = (typeof allowedSlugs)[number];

const metadataMap: Record<ProductSlug, Metadata> = {
  "bil-korekort": {
    title: "Kørekort til bil",
    description:
      "Få overblik over priser og forløb for bilkørekort hos Junkers Køreskole – vi hjælper dig trygt hele vejen.",
  },
  "trailer-korekort": {
    title: "Kørekort til trailer",
    description:
      "Læs om priser og forløb for trailerkørekort (BE/B+) hos Junkers Køreskole. Kør med tillid og sikkerhed.",
  },
  "traktor-korekort": {
    title: "Kørekort til traktor",
    description:
      "Se vores priser og information for traktorkørekort. Vi gør dig klar til landevejen og landbruget.",
  },
  "generhvervelse-korekort": {
    title: "Generhvervelse af kørekort",
    description:
      "Skal du generhverve dit kørekort? Vi guider dig trygt gennem teori og prøve – uanset årsagen.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug as ProductSlug;
  if (!allowedSlugs.includes(slug)) return notFound();
  return metadataMap[slug];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug as ProductSlug;

  if (!allowedSlugs.includes(slug)) return notFound();

  let packages = [];

  switch (slug) {
    case "bil-korekort":
      packages = await getCarPackages();
      break;
    case "trailer-korekort":
      packages = await getTrailerPackages();
      break;
    case "traktor-korekort":
      packages = await getTractorPackages();
      break;
    case "generhvervelse-korekort":
      packages = await getRetakePackages();
      break;
  }

  const packagesWithFeatures = await Promise.all(
    packages.map(async (p) => ({
      ...p,
      features: await getFeaturesByPackageId(p.id),
    }))
  );

  return <PriceClient slug={slug} data={packagesWithFeatures} />;
}
