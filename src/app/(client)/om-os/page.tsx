import { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "Om os",
  description:
    "Lær mere om Junker's Køreskole, vores historie, værdier og hvad der gør os til det bedste valg for dit kørekort. Vi tilbyder professionel undervisning med fokus på tryghed og høj beståelsesprocent.",
};

export default function Page() {
  return <AboutPage />;
}
