import { Metadata } from "next";
import DepartmentsPage from "./DepartmentsPage";

export const metadata: Metadata = {
  title: "Afdelinger",
  description:
    "Find din lokale afdeling hos Junkers Køreskole. Vi tilbyder kørekort, trailer, traktor og generhvervelse i Billund, Ribe og Grindsted.",
};

export default function Page() {
  return <DepartmentsPage />;
}
