'use client';

import { usePathname, useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function DashboardHeader({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const onAdmin = pathname.startsWith("/dashboard/admin");
  const handleToggle = (checked: boolean) =>
    router.push(checked ? "/dashboard/admin" : "/dashboard/user");

  return (
    <header className="h-16 bg-white border-b flex items-center px-6 gap-4">
      <h1 className="text-xl font-semibold">Property Dashboard</h1>

      {/* Only admins see the switch */}
      {isAdmin && (
        <div className="ml-auto flex items-center gap-2">
          <Label htmlFor="mode-toggle" className="text-sm">User</Label>
          <Switch id="mode-toggle" checked={onAdmin} onCheckedChange={handleToggle} />
          <span className="text-sm">Admin</span>
        </div>
      )}
    </header>
  );
}
