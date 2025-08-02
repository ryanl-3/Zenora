import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
    
  if (!session) {
    redirect('/login');
  }
  // console.log(session.user.id);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Welcome, {session.user?.email}</h1>
      <LogoutButton />
    </div>
  );
}

