import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from "next/navigation";

export default async function DashboardIndex() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role?.toLowerCase();
  if (role === "admin") redirect("/dashboard/admin");
  redirect("/dashboard/user");
}
