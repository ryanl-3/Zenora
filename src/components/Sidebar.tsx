'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import {
  Home, BrainCog, Wrench, FileText, Settings, Users, LineChart,
  MessageSquare, Contact, BarChart3, LogOut
} from "lucide-react";

type Item = { label: string; href: string; icon: any; disabled?: boolean };

const userItems: Item[] = [
  { label: "Properties", href: "/dashboard/user", icon: Home },
  { label: "AI Rent Analysis", href: "/dashboard/user/ai-rent", icon: BrainCog },
  { label: "Maintenance", href: "/dashboard/user/maintenance", icon: Wrench },
  { label: "Tickets", href: "/dashboard/user/tickets", icon: MessageSquare },
  { label: "Create Ticket", href: "/dashboard/user/create-ticket", icon: MessageSquare },
  { label: "Documents", href: "/dashboard/user/documents", icon: FileText },
  { label: "Settings", href: "/dashboard/user/settings", icon: Settings },
];

const adminItems: Item[] = [
  { label: "Properties", href: "/dashboard/admin", icon: Home },
  { label: "User Management", href: "/dashboard/admin/users", icon: Users },
  { label: "Marketing", href: "/dashboard/admin/marketing", icon: LineChart },
  { label: "Maintenance", href: "/dashboard/admin/maintenance", icon: Wrench },
  { label: "Messages", href: "/dashboard/admin/messages", icon: MessageSquare },
  { label: "Tickets", href: "/dashboard/admin/tickets", icon: MessageSquare },
  { label: "Create Ticket", href: "/dashboard/admin/create-ticket", icon: MessageSquare },
  { label: "Contacts", href: "/dashboard/admin/contacts", icon: Contact },
  { label: "Documents", href: "/dashboard/admin/documents", icon: FileText },
  { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  // Single source of truth: URL segment
  const onAdmin = pathname.startsWith("/dashboard/admin");
  const items = onAdmin ? adminItems : userItems;

  return (
    <aside className="h-screen w-64 shrink-0 bg-gradient-to-b from-[#0F0B1E] to-[#1A1233] text-white flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="h-8 w-8 rounded-full bg-white/90 grid place-items-center text-[#6B21A8] font-bold">Z</div>
        <span className="text-lg font-semibold">Zenora</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(({ href, label, icon: Icon, disabled }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={disabled ? "#" : href}
              className={clsx(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                disabled && "opacity-50 pointer-events-none"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
