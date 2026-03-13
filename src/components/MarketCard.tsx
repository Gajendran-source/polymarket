"use client";

import React from "react";
import { Bookmark, Gift } from "lucide-react";

interface MarketCardProps {
  image: string;
  title: string;
  options: { name: string; percentage: number }[];
  volume: string;
  badge?: string;
  category?: string;
  variant?: "single" | "multi" | "binary";
}

export default function MarketCard({
  image,
  title,
  options,
  volume,
  badge,
  category,
  variant = "binary",
}: MarketCardProps) {
  return (
    <div className="bg-white dark:bg-[#12151c] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col h-full hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm group">
      {/* Top Section */}
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-transform group-hover:scale-105">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow">
          <h3 className="text-sm font-bold text-black dark:text-white leading-tight line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
          {badge && (
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${badge.toLowerCase().includes("live") ? "bg-red-500 animate-pulse" : "bg-yellow-500"}`}
              ></span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider ${badge.toLowerCase().includes("live") ? "text-red-500" : "text-yellow-500"}`}
              >
                {badge}
              </span>
            </div>
          )}
        </div>
        {variant === "single" && (
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative w-11 h-11">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className="stroke-zinc-100 dark:stroke-zinc-800"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  className="stroke-orange-500"
                  strokeWidth="3.5"
                  strokeDasharray={`${options[0].percentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black leading-none">
                  {options[0].percentage}%
                </span>
                <span className="text-[6px] font-bold text-zinc-500 uppercase">
                  chance
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Middle Section - Options */}
      <div className="flex-grow flex flex-col gap-2 mb-4">
        {variant === "binary" && (
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black py-2.5 rounded-xl transition-all border border-emerald-500/5 active:scale-[0.98]">
              Yes
            </button>
            <button className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-black py-2.5 rounded-xl transition-all border border-rose-500/5 active:scale-[0.98]">
              No
            </button>
          </div>
        )}

        {variant === "multi" && (
          <div className="space-y-2.5">
            {options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center justify-between group/opt"
              >
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-400 truncate pr-2">
                  {opt.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-black dark:text-white">
                    {opt.percentage}%
                  </span>
                  <div className="flex gap-1">
                    <button className="px-2.5 py-1 bg-emerald-500/10 rounded-md text-emerald-500 text-[10px] font-black uppercase hover:bg-emerald-500/20 border border-emerald-500/5 transition-colors">
                      Yes
                    </button>
                    <button className="px-2.5 py-1 bg-rose-500/10 rounded-md text-rose-500 text-[10px] font-black uppercase hover:bg-rose-500/20 border border-rose-500/5 transition-colors">
                      No
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === "single" && (
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-emerald-500/10 text-emerald-500 font-black py-2.5 rounded-xl border border-emerald-500/5 hover:bg-emerald-500/20 transition-all active:scale-[0.98]">
              Yes
            </button>
            <button className="bg-rose-500/10 text-rose-500 font-black py-2.5 rounded-xl border border-rose-500/5 hover:bg-rose-500/20 transition-all active:scale-[0.98]">
              No
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          <span>{volume} Vol.</span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-zinc-400">Monthly</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-600">
          <button className="hover:text-blue-500 transition-colors transform hover:scale-110">
            <Gift size={16} />
          </button>
          <button className="hover:text-blue-500 transition-colors transform hover:scale-110">
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
