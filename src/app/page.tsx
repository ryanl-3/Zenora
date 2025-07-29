import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function HomePage() {
  const cookieStore = await cookies();
  const user = cookieStore.get('session_user');

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Welcome, {user.value}</h1>
      <LogoutButton />
    </div>
  );
}

