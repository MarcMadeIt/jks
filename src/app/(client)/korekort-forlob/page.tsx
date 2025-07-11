import { Metadata } from "next";
import StepsPage from "./StepsPage";

export const metadata: Metadata = {
  title: "Kørekort forløb",
  description:
    "Følg vores trin-for-trin guide til at få dit kørekort. Fra teoriprøve til køreprøve, vi hjælper dig gennem hele forløbet med fokus på tryghed og høj beståelsesprocent.",
};

export default function Page() {
  return <StepsPage />;
}
