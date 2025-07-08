import { Metadata } from "next";
import InfoPage from "./InfoPage";

export const metadata: Metadata = {
  title: "Information",
  description: "",
};

export default function Page() {
  return <InfoPage />;
}
