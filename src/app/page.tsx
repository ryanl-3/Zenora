import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-700 mt-2">
        Welcome, {role === "admin" ? "Admin" : "User"}!
        <LogoutButton />
      </p>

      {role === "admin" ? (
        <div className="mt-4">
          <p>You have full admin access to this dashboard.</p>
          {/* Render admin-specific components here */}
        </div>
      ) : (
        <div className="mt-4">
          <p>You are logged in as a regular user.</p>
          {/* Render user-specific components here */}
        </div>
      )}
    </div>
  );
}