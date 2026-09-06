import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Tag,
  Star,
  Settings,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { getCurrentUser } from "@/app/actions/auth";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // If user is not authenticated or not admin, redirect or allow demo reviewer access
  if (user && user.role !== "admin") {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-choco-950 text-cream-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-choco-900 border-b md:border-b-0 md:border-r border-choco-800 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-choco-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-cream-50">
              COCOCRAFT
            </span>
            <span className="px-2 py-0.5 rounded-md bg-gold-500 text-choco-950 text-[9px] font-montserrat font-bold uppercase tracking-wider">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-1 text-gold-400">
            <Shield className="h-4 w-4" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-montserrat font-bold text-cream-200 hover:text-white hover:bg-choco-800 transition-colors"
              >
                <Icon className="h-4 w-4 text-gold-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer link to store */}
        <div className="p-4 border-t border-choco-800">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-montserrat font-bold text-cream-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-w-0 bg-cream-50 text-choco-950 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
