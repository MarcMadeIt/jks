import { Metadata } from "next";
import PricesPage from "./PricesPage";

export const metadata: Metadata = {
  title: "Priser",
  description:
    "Få et overblik over priserne for kørekort, trailer, traktor og generhvervelse hos Junker's Køreskole. Vi tilbyder konkurrencedygtige priser med fokus på kvalitet og tryghed.",
};

export default function Page() {
  return <PricesPage />;
}
