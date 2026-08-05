
import RequireRole from "@/lib/RequireRole";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await RequireRole("admin");
  
  return (
    <>

    {children}
    
    </>
  )
}

export default AdminLayout
