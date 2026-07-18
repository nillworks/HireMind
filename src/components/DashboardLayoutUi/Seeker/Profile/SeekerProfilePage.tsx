import { getSeekerProfile } from "@/lib/api/seeker/profileApi";
import SeekerProfileForm from "./SeekerProfileForm";

const SeekerProfilePage = async () => {
  const profile = await getSeekerProfile();
  return <SeekerProfileForm profile={profile} />;
};

export default SeekerProfilePage;
