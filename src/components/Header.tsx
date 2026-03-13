"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  Info,
  Menu,
  TrendingUp,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { toggleTheme } from "@/lib/redux/features/theme/themeSlice";

const categories = [
  "Breaking",
  "New",
  "|",
  "Politics",
  "Sports",
  "Crypto",
  "Iran",
  "Finance",
  "Geopolitics",
  "Tech",
  "Culture",
  "Economy",
  "Climate & Science",
  "Mentions",
  "Elections",
];

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCategory } from "@/lib/redux/features/markets/marketsSlice";
import {
  setTradingModalOpen,
} from "@/lib/redux/features/auth/authSlice";
import AuthModal from "./auth/AuthModal";
import MenuDropdown from "./MenuDropdown";
import OnboardingModal from "./auth/OnboardingModal";
import TradingModal from "./auth/TradingModal";
import DepositModal from "./trading/DepositModal";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const { handleLogout, address } = useWeb3Auth();
  const [isDepositOpen, setIsDepositOpen] = React.useState(false);
  const [vaultBalance, setVaultBalance] = React.useState(0);

  const openLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  const handleOpenTrading = () => {
    if (user?.isTradingEnabled) {
      setIsDepositOpen(true);
    } else {
      dispatch(setTradingModalOpen(true));
    }
  };

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (isAuthenticated && user?.token) {
        try {
          const { data } = await axios.get(`${API_URL}/vault/balance`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (data.success) {
            setVaultBalance(data.result.balance);
          }
        } catch (err) {
          console.error("Failed to fetch vault balance:", err);
        }
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.token]);

  return (
    <header className="w-full bg-white dark:bg-[#0b0c10] text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200 sticky top-0 z-50">
      {/* Top Section */}
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 relative flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <div className="absolute inset-0 bg-blue-600 rounded-sm rotate-45 scale-75"></div>
            <div className="w-3 h-3 bg-white dark:bg-[#0b0c10] rounded-sm z-10"></div>
          </div>
          <span className="text-black dark:text-white font-bold text-xl tracking-tight hidden sm:block">
            Polymarket
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-xl relative mx-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search polymarkets..."
            className="w-full bg-zinc-100 dark:bg-[#12151c] border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 outline-none rounded-lg py-2 pl-11 pr-10 text-sm font-medium text-black dark:text-white transition-all shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono bg-zinc-200 dark:bg-[#1c222d] px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-800">
            /
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-6 text-sm font-bold">
          {!isAuthenticated ? (
            <>
              <Link
                href="/how-it-works"
                className="hidden lg:flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Info size={14} />
                </div>
                <span>How it works</span>
              </Link>

              <div className="flex items-center gap-4">
                <button
                  onClick={openLogin}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Log In  /Sign Up
                </button>
                {/* <button
                  onClick={openSignup}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 transform"
                >
                  Sign Up
                </button> */}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Wallet Info */}
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] text-zinc-500 uppercase leading-none mb-1">Authenticated</span>
                <span className="text-black dark:text-white font-mono text-[10px]">
                  {user?.wallet?.slice(0, 6)}...{user?.wallet?.slice(-4)}
                </span>
              </div>

              {/* Portfolio */}
              <div className="bg-zinc-100 dark:bg-[#12151c] px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-zinc-500 uppercase leading-none mb-1">
                    Portfolio
                  </span>
                  <span className="text-black dark:text-white font-black leading-none">
                    ${user?.portfolioBalance || 0}
                  </span>
                </div>
                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-zinc-500 uppercase leading-none mb-1">
                    Cash
                  </span>
                  <span className="text-black dark:text-white font-black leading-none">
                    ${vaultBalance || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={handleOpenTrading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all font-black text-sm active:scale-95 shadow-lg shadow-blue-600/20"
              >
                Deposit
              </button>

              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-red-500 transition-colors text-xs font-bold"
              >
                Logout
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all rounded-lg"
              title={
                themeMode === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {themeMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 hover:text-black dark:hover:text-white transition-colors rounded-lg ${isMenuOpen ? "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white" : ""}`}
              >
                <Menu size={22} />
              </button>
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MenuDropdown />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-[1400px] mx-auto px-4 h-11 flex items-center gap-6 overflow-x-auto no-scrollbar text-xs font-bold whitespace-nowrap">
          <Link
            href="/"
            className={`flex items-center gap-1.5 transition-all py-3 border-b-2 hover:scale-105 ${pathname === "/"
              ? "text-blue-600 dark:text-white border-blue-600 dark:border-white"
              : "text-zinc-500 dark:text-zinc-400 border-transparent hover:text-black dark:hover:text-white"
              }`}
          >
            <TrendingUp
              size={14}
              className={pathname === "/" ? "text-blue-500" : "text-zinc-400"}
            />
            <span>Trending</span>
          </Link>

          {categories.map((category, index) => {
            const path = `/${category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`;
            const isActive = pathname === path;

            return (
              <React.Fragment key={index}>
                {category === "|" ? (
                  <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
                ) : (
                  <Link
                    href={path}
                    className={`transition-all py-3 px-1 border-b-2 ${isActive
                      ? "text-blue-600 dark:text-white border-blue-600 dark:border-white"
                      : "text-zinc-500 dark:text-zinc-400 border-transparent hover:text-black dark:hover:text-white"
                      }`}
                  >
                    {category}
                  </Link>
                )}
              </React.Fragment>
            );
          })}

          <button className="flex items-center gap-1 text-zinc-400 hover:text-black dark:hover:text-white transition-colors py-3 group">
            More
            <ChevronRight
              size={14}
              className="rotate-90 group-hover:translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
      />
      <OnboardingModal />
      <TradingModal />
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </header>
  );
}
