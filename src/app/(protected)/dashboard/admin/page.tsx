//This is the admin dashboard page
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardHeader from "@/components/DashboardHeader";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-6">
      {/* rest of your page */}
    </div>
  );
}