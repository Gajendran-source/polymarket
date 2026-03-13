"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import {
  Coinbase,
  Google,
  MetaMask,
  Phantom,
  Wallet,
} from "../../../public/assets/SVGComponents";
import { useAppKit } from "@reown/appkit/react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { useAppSelector } from "@/lib/redux/hooks";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const { open } = useAppKit();
  const { isConnected, signAndLogin, address, isLoading, error } = useWeb3Auth();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isConnected && !isAuthenticated && isOpen && !isLoading) {
      signAndLogin();
    }
  }, [isConnected, isAuthenticated, isOpen, signAndLogin, isLoading]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[440px] bg-[#161922] border border-zinc-800 rounded-[28px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-[22px] font-bold text-white mb-8">
            {mode === "login" ? "Welcome to Polymarket" : "Create an Account"}
          </h2>

          {/* Google Button placeholder */}
          <button className="w-full flex items-center justify-center gap-3 bg-[#0091ff] hover:bg-[#007ce6] text-white font-bold py-3.5 rounded-xl transition-all mb-8 opacity-50 cursor-not-allowed">
           <Google/>
            Continue with Google (Soon)
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-grow bg-zinc-800"></div>
            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
              OR
            </span>
            <div className="h-px flex-grow bg-zinc-800"></div>
          </div>

          <div className="w-full grid grid-cols-4 gap-3 mb-10">
            <button 
              onClick={() => open()}
              className="aspect-square cursor-pointer bg-[#1c1f26] border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-center p-3"
              title="Connect Wallet"
            >
              <MetaMask />
            </button>
            <button 
              onClick={() => open()}
              className="aspect-square cursor-pointer bg-[#1c1f26] border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-center p-3"
              title="Connect Wallet"
            >
              <Coinbase />
            </button>
            <button 
              onClick={() => open()}
              className="aspect-square cursor-pointer bg-[#1c1f26] border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-center p-3"
              title="Connect Wallet"
            >
              <Phantom />
            </button>
            <button 
              onClick={() => open()}
              className="aspect-square cursor-pointer bg-[#1c1f26] border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all flex items-center justify-center p-3"
              title="Connect Wallet"
            >
              <Wallet />
            </button>
          </div>
          
          {isLoading && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-400 text-xs font-medium">
                Verifying your wallet...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 w-full text-center">
              <p className="text-red-500 text-xs font-bold leading-relaxed">
                {error}
              </p>
              <button 
                onClick={() => signAndLogin()}
                className="text-white text-[10px] mt-2 underline hover:no-underline font-bold uppercase tracking-wider"
              >
                Try Again
              </button>
            </div>
          )}

          {isConnected && !isAuthenticated && !isLoading && !error && (
            <p className="text-blue-400 text-xs mb-4 animate-pulse">
              Signing message for {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <button className="hover:text-zinc-300 transition-colors">
              Terms
            </button>
            <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
            <button className="hover:text-zinc-300 transition-colors">
              Privacy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
