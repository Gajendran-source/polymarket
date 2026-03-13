"use client";

import React from "react";
import {
  Trophy,
  DollarSign,
  Settings,
  Moon,
  ChevronRight,
  Target,
  FileText,
  HelpCircle,
  Shield,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleTheme } from "@/lib/redux/features/theme/themeSlice";

export default function MenuDropdown() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleTheme());
  };

  return (
    <div className="absolute top-14 right-0 w-64 bg-white dark:bg-[#161922] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Prime Actions */}
      <div className="px-2 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors group text-zinc-900 dark:text-zinc-100">
          <Trophy
            size={18}
            className="text-yellow-500 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-semibold">Leaderboard</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors group text-zinc-900 dark:text-zinc-100">
          <div className="w-5 h-5 flex items-center justify-center bg-emerald-500 rounded-full">
            <DollarSign size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold">Rewards</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors group text-zinc-900 dark:text-zinc-100">
          <Settings size={18} className="text-rose-400" />
          <span className="text-sm font-semibold">APIs</span>
        </button>
      </div>

      {/* Theme Toggle Section */}
      <div className="px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
        <div className="flex items-center justify-between px-3 py-2.5 text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center gap-3">
            <Moon size={18} className="text-blue-500" />
            <span className="text-sm font-semibold">Dark mode</span>
          </div>
          <button
            onClick={handleToggle}
            className={`w-11 h-6 rounded-full transition-colors relative ${mode === "dark" ? "bg-blue-600" : "bg-zinc-300"}`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${mode === "dark" ? "translate-x-5" : "translate-x-0"} shadow-sm`}
            ></div>
          </button>
        </div>
      </div>

      {/* Secondary Links Section */}
      <div className="px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2 space-y-0.5">
        <button className="w-full text-left px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
          Accuracy
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
          Documentation
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
          Help Center
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
          Terms of Use
        </button>
      </div>

      {/* Language Section */}
      <div className="px-2 mt-1">
        <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors group text-zinc-900 dark:text-zinc-100">
          <span className="text-sm font-medium">语言</span>
          <ChevronRight
            size={16}
            className="text-zinc-400 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
