import { Metadata } from "next";
import HelperPage from "./HelperPage";

export const metadata: Metadata = {
  title: "Den Lille Hjælper",
  description:
    "Et smart og overskueligt værktøj, der gør det nemmere at forstå teori, færdselsregler og forberede sig til kørekortet.",
};

export default function Page() {
  return <HelperPage />;
}
