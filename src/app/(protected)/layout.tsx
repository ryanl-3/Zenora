import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar"; // unified sidebar (renders user/admin items)

export default async function ProtectedDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = (session.user.role ?? "").toUpperCase() === "ADMIN";

  return (
    <div className="min-h-screen flex bg-[#F6F7FB]">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader isAdmin={isAdmin} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}