import RequireRole from "@/lib/RequireRole";

const RecruiterLayout = async ({ children }: { children: React.ReactNode }) => {
  await RequireRole("recruiter");
  return (
    <>{children}</>
  )
}

export default RecruiterLayout