"use client";

import React from "react";
import MarketCard from "@/components/MarketCard";
import { Search, Settings2, Bookmark, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";

interface MarketsDisplayProps {
  category: string;
}

export default function MarketsDisplay({ category }: MarketsDisplayProps) {
  const { items: markets } = useAppSelector((state) => state.markets);

  const [activeFilter, setActiveFilter] = React.useState("All");

  const subCategories = [
    "All",
    "Trump",
    "Iran",
    "Oscars",
    "Oil",
    "Lebanon",
    "Colombia Election",
    "Tweet Markets",
    "Tariffs",
    "Global Elections",
    "Nepal Election",
    "Midterms",
    "Primaries",
    "Reza Pahlavi",
  ];

  const normalize = (str: string) =>
    str.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

  const filteredMarkets = (
    category === "All" || category === "Trending"
      ? markets
      : markets.filter(
          (m) =>
            normalize(m.category) === normalize(category) ||
            normalize(m.title).includes(normalize(category)),
        )
  ).filter(
    (m) =>
      activeFilter === "All" ||
      m.title.toLowerCase().includes(activeFilter.toLowerCase()) ||
      m.category.toLowerCase().includes(activeFilter.toLowerCase()),
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Markets Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-black dark:text-white">
          All markets
        </h1>
        <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-500">
          <button className="hover:text-black dark:hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="hover:text-black dark:hover:text-white transition-colors">
            <Settings2 size={20} />
          </button>
          <button className="hover:text-black dark:hover:text-white transition-colors">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      {/* Sub-Category Filter Bar */}
      <div className="relative mb-8 group">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pr-12">
          {subCategories.map((sub, i) => (
            <button
              key={i}
              onClick={() => setActiveFilter(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === sub
                  ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600 dark:text-white"
                  : "bg-zinc-100 dark:bg-[#12151c] text-zinc-500 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-white dark:from-[#0b0c10] to-transparent pointer-events-none"></div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#12151c] border border-zinc-200 dark:border-zinc-800 rounded-full shadow-md text-zinc-400 hover:text-black dark:hover:text-white transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Markets Grid */}
      {filteredMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredMarkets.map((market, index) => (
            <MarketCard key={index} {...(market as any)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
            <Search size={24} className="text-zinc-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No markets found</h3>
            <p className="text-zinc-500 text-sm">
              Try selecting a different category or search term.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
