import { Metadata } from "next";
import InfoPage from "./InfoPage";

export const metadata: Metadata = {
  title: "Information",
  description:
    "Find alle de vigtigste informationer om kørekort, trailer, traktor og generhvervelse hos Junkers Køreskole – samlet ét sted. Vi hjælper dig med at komme godt fra start i dit kørselsforløb.",
};

export default function Page() {
  return <InfoPage />;
}
