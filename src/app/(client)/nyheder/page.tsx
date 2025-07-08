import { Metadata } from "next";
import NewsPage from "./NewsPage";

export const metadata: Metadata = {
  title: "Cases",
  description:
    "Explore the projects we've delivered – performance-driven, visually sharp digital solutions across industries.",
};

export default function Page() {
  return <NewsPage />;
}
