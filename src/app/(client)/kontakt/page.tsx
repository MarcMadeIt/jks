import { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Kontakt os",
  description:
    "Kontakt Junkers Køreskole for at få svar på dine spørgsmål om kørekort, trailer, traktor og generhvervelse. Vi er her for at hjælpe dig med at komme godt i gang med din køreuddannelse",
};

export default function Page() {
  return <ContactPage />;
}
