import { redirect } from 'next/navigation';
import getUserSession from './getUserSession';



const RequireRole = async (role:string) => {
  const user = await getUserSession();

  if (!user) {
    return redirect('/login');
  }

  if (user.role !== role) {
    return redirect('/unauthorized');
  }
};

export default RequireRole;