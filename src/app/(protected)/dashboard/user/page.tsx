import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = ((session.user.role ?? "") as string).toUpperCase() === "ADMIN";

  // TODO: replace with real data fetch (server-side)
  const properties = [
    { id: "1", address: "123 Riverside Ave, Portland, OR 97204", status: "Active", type: "Apartment", occupancy: "10/12 units occupied" },
    { id: "2", address: "456 Maple Street, Seattle, WA 98101", status: "Active", type: "Single-family", occupancy: "Single-family home" },
    { id: "3", address: "789 Downtown Blvd, Austin, TX 78701", status: "Maintenance", type: "Multi-family", occupancy: "7/8 units occupied" },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Hero / Welcome banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-xl font-semibold">Welcome to Your Property Dashboard</h2>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-3 py-2 bg-white/90 text-gray-900 rounded-lg shadow hover:bg-white">
              + Add Property
            </button>
            <input
              placeholder="Search properties..."
              className="px-3 py-2 rounded-lg text-gray-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Properties section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">My Properties</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border bg-white shadow-sm hover:shadow-md transition p-0 overflow-hidden"
            >
              <div className="h-24 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{p.address}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-between">
                  <span>{p.type}</span>
                  <span>{p.occupancy}</span>
                </div>
              </div>
            </article>
          ))}

          {/* Add new property card */}
          <button className="rounded-xl border border-dashed border-gray-300 bg-white h-44 flex flex-col items-center justify-center hover:bg-gray-50">
            <div className="text-2xl">＋</div>
            <div className="text-sm text-gray-600 mt-1">Add New Property</div>
          </button>
        </div>
      </section>
    </div>
  );
}
