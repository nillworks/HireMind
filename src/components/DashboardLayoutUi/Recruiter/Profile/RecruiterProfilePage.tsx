import { getRecruiterProfile } from "@/lib/api/recruiter/recruiterProfileApi";
import RecruiterProfileForm from "./RecruiterProfileForm";

const RecruiterProfilePage = async () => {
  const profile = await getRecruiterProfile();
  return <RecruiterProfileForm profile={profile} />;
};

export default RecruiterProfilePage;
