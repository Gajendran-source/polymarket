"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  nextStep,
  setOnboardingStep,
  updateUser,
  addDemoFunds,
} from "@/lib/redux/features/auth/authSlice";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export default function OnboardingModal() {
  const dispatch = useAppDispatch();
  const step = useAppSelector((state) => state.auth.onboardingStep);
  const user = useAppSelector((state) => state.auth.user);
  const [username, setLocalUsername] = React.useState("");
  const [email, setLocalEmail] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  if (step === "none") return null;

  const handleClose = () => dispatch(setOnboardingStep("none"));

  const renderUsernameStep = () => (
    <div className="p-8 pb-10 flex flex-col items-center text-center">
      <h2 className="text-2xl font-black text-white mb-2">Choose a username</h2>
      <p className="text-zinc-500 text-sm mb-8">You can update this later.</p>

      <div className="w-full relative mb-12">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">
          @
        </div>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
          className="w-full bg-[#12151c] border border-zinc-700/50 rounded-xl py-4 pl-10 pr-4 text-white placeholder-zinc-600 focus:border-blue-500 outline-none transition-all text-lg font-medium"
        />
      </div>

      <div className="flex items-start gap-3 text-left mb-8 max-w-sm">
        <button
          onClick={() => setTermsAccepted(!termsAccepted)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded border ${termsAccepted ? "bg-blue-600 border-blue-600" : "border-zinc-700 bg-transparent"} transition-all flex items-center justify-center`}
        >
          {termsAccepted && <Check size={14} className="text-white" />}
        </button>
        <p className="text-[13px] leading-relaxed text-zinc-400">
          By trading, you agree to the{" "}
          <span className="text-blue-500 cursor-pointer">Terms of Use</span> and
          attest you are not a U.S. person, are not located in the U.S. and are
          not the resident of or located in a restricted jurisdiction.
          <span className="text-red-500">*</span>
        </p>
      </div>

      <button
        disabled={!username || !termsAccepted}
        onClick={async () => {
          try {
            if (user?.token) {
              await axios.post(`${API_URL}/auth/update-profile`, { username }, {
                headers: { Authorization: `Bearer ${user.token}` }
              });
            }
            dispatch(updateUser({ username }));
            dispatch(nextStep());
          } catch (err) {
            console.error("Failed to update username:", err);
            // Still proceed to next step or show error
            dispatch(updateUser({ username }));
            dispatch(nextStep());
          }
        }}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:text-zinc-600 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20"
      >
        Continue
      </button>
    </div>
  );

  const renderEmailStep = () => (
    <div className="p-8 pb-10 flex flex-col items-center text-center">
      <h2 className="text-2xl font-black text-white mb-2">
        What's your email?
      </h2>
      <p className="text-zinc-500 text-sm mb-8">
        Add your email to receive market and trading notifications.
      </p>

      <div className="w-full mb-8">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setLocalEmail(e.target.value)}
          className="w-full bg-[#12151c] border border-zinc-700/50 rounded-xl py-4 px-4 text-white placeholder-zinc-600 focus:border-blue-500 outline-none transition-all text-lg font-medium"
        />
      </div>

      <button
        disabled={!email}
        onClick={async () => {
          try {
            if (user?.token) {
              await axios.post(`${API_URL}/auth/update-profile`, { email }, {
                headers: { Authorization: `Bearer ${user.token}` }
              });
            }
            dispatch(updateUser({ email }));
            dispatch(nextStep());
          } catch (err) {
            console.error("Failed to update email:", err);
            dispatch(updateUser({ email }));
            dispatch(nextStep());
          }
        }}
        className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 rounded-xl transition-all mb-4"
      >
        Continue
      </button>

      <button
        onClick={() => dispatch(nextStep())}
        className="text-zinc-500 hover:text-white font-bold transition-colors text-sm"
      >
        Do this later
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1c1f26] rounded-[28px] border border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {step === "username" && renderUsernameStep()}
        {step === "email" && renderEmailStep()}
      </div>
    </div>
  );
}
