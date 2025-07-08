import { Metadata } from "next";
import TeachersPage from "./TeachersPage";

export const metadata: Metadata = {
  title: "Kørelærerne",
  description:
    "Mød vores dedikerede team af kørelærere, der sikrer tryg og professionel undervisning. Læs mere om deres erfaring og tilgang til undervisning.",
};

export default function Page() {
  return <TeachersPage />;
}
