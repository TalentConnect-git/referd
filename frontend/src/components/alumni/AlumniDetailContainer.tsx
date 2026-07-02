import { AlumniDetailProfileProps } from "@/types/alumni";
import AlumniDetailAbout from "./AlumniDetailAbout";
import AlumniDetailHeader from "./AlumniDetailHeader";
import AlumniDetailMetrics from "./AlumniDetailMetrics";
import AlumniDetailProfessionalLinks from "./AlumniDetailProfessionalLinks";
import AlumniDetailOpenPositions from "./AlumniDetailOpenPositions";

export default function AlumniDetailContainer({
  profile
}: AlumniDetailProfileProps) {

  console.log("Alumni received ",profile);
  return (
    <div className="space-y-6">


      <AlumniDetailHeader profile={profile} />
      <AlumniDetailMetrics profile={profile} />
      <AlumniDetailAbout profile={profile} />
      <AlumniDetailProfessionalLinks profile={profile} />
      <AlumniDetailOpenPositions userProfile={profile} />
    </div>
  );
}