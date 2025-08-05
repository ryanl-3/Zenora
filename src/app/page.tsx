import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold text-red-600">Unauthorized</h1>
        <p className="text-gray-600 mt-2">You must be signed in to view this page.</p>

        <Link
          href="/login"
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
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