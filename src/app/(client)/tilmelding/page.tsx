import { Metadata } from "next";
import RegistrationPage from "./RegistrationPage";

export const metadata: Metadata = {
  title: "Tilmelding",
  description:
    "Tilmeld dig vores kurser og få adgang til en verden af viden og færdigheder.",
};

export default function Page() {
  return <RegistrationPage />;
}
