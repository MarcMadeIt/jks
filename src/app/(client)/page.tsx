import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "Junker's Køreskole",
  },
  description:
    "Tag kørekort i Ribe, Grindsted eller Billund hos Junker’s Køreskole. Vi tilbyder undervisning til bil, trailer, traktor og generhvervelse – med fokus på tryghed og høj beståelsesprocent",
};

export default function Page() {
  return <HomePage />;
}
