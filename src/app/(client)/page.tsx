import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "Junkers Køreskole",
  },
  description:
    "Tag kørekort i Ribe, Grindsted eller Billund hos Junkers Køreskole. Vi tilbyder undervisning til bil, trailer, traktor og generhvervelse – med fokus på tryghed og høj beståelsesprocent",
};

export default function Page() {
  return <HomePage />;
}
