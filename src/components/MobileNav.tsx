"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Clock, User } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";

export default function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const navItems = [
    { label: "Markets", icon: Home, path: "/" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Activity", icon: Clock, path: "/activity" },
    {
      label: "Portfolio",
      icon: User,
      path: isAuthenticated ? "/portfolio" : "/login",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#0b0c10] border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 z-50 lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.path}
            className={`flex flex-col items-center gap-1 transition-colors px-4 py-1.5 rounded-xl ${
              isActive
                ? "text-blue-600 dark:text-white"
                : "text-zinc-500 hover:text-black dark:hover:text-white"
            }`}
          >
            <Icon
              size={20}
              className={isActive ? "stroke-[2.5px]" : "stroke-2"}
            />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
