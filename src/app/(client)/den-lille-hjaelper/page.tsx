import { Metadata } from "next";
import HelperPage from "./HelperPage";

export const metadata: Metadata = {
  title: "Den Lille Hjælper",
  description: "",
};

export default function Page() {
  return <HelperPage />;
}
