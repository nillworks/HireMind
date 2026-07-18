import RequireRole from "@/lib/RequireRole";


const SeekerLayout = async ({children}: {children: React.ReactNode}) => {
    await RequireRole("seeker");
  return (
    <>{children}</>
  )
}

export default SeekerLayout