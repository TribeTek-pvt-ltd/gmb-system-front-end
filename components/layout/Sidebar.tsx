"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Briefcase, Ruler,
  Calculator, Package, FileText, Settings, Layers, Truck, ShoppingCart, UserCog, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, section: "main" },
  { name: "Enquiries", href: "/customers", icon: Users, section: "main" },
  { name: "Jobs", href: "/jobs", icon: Briefcase, section: "main" },
  { name: "Products", href: "/products", icon: Package, section: "main" },
  { name: "Stocks", href: "/stocks", icon: Package, section: "main" },
  { name: "Suppliers", href: "/suppliers", icon: Truck, section: "main" },
  { name: "Orders", href: "/orders", icon: ShoppingCart, section: "main" },
  { name: "Measurements", href: "/measurements", icon: ClipboardList, section: "paperwork" },
  { name: "Measure Image", href: "/measure-by-image", icon: Ruler, section: "paperwork" },
  { name: "Quotations", href: "/quotations", icon: FileText, section: "paperwork" },
  { name: "Employees", href: "/employees", icon: UserCog, section: "admin" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-border z-50">
      {/* Brand */}
      <div className="relative flex h-20 items-center gap-3 px-6 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground leading-none">GMB System</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1.5 font-semibold">Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        {/* Main section */}
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Management
        </p>
        {navigation.filter(i => i.section === "main").map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-active"
              )}
            >
              <item.icon className={cn(
                "h-4.5 w-4.5 shrink-0 transition-colors duration-200",
                isActive ? "text-accent-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-active"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Paperwork section */}
        <p className="mt-6 mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Paperwork
        </p>
        {navigation.filter(i => i.section === "paperwork").map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-active"
              )}
            >
              <item.icon className={cn(
                "h-4.5 w-4.5 shrink-0 transition-colors duration-200",
                isActive ? "text-accent-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-active"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Admin section */}
        <p className="mt-6 mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Admin
        </p>
        {navigation.filter(i => i.section === "admin").map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-active"
              )}
            >
              <item.icon className={cn(
                "h-4.5 w-4.5 shrink-0 transition-colors duration-200",
                isActive ? "text-accent-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-active"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative border-t border-border px-4 py-6">
        <Link
          href="/settings"
          className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-muted hover:text-sidebar-active"
        >
          <Settings className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:rotate-45" />
          <span>General Settings</span>
        </Link>
      </div>
    </aside>
  );
}
