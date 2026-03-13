"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setTradingModalOpen,
  updateUser,
} from "@/lib/redux/features/auth/authSlice";
import { useAccount, useSignMessage, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import axios from "axios";
import { parseUnits, type Address } from "viem";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
const USDC_ADDRESS = "0x41e94404177041b62124827c1c4ee4f06318c26e" as Address; // Amoy USDC

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export default function TradingModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.auth.isTradingModalOpen);
  const user = useAppSelector((state) => state.auth.user);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Wagmi Write Contract for Approval
  const { writeContractAsync } = useWriteContract();

  // Auto-close if all steps already completed (returning user)
  useEffect(() => {
    if (!isOpen) return;
    const allDone =
      user?.proxyStatus === 'deployed' &&
      user?.isTradingEnabled === true &&
      (user as any)?.isUSDCapproved === true;
    if (allDone) {
      dispatch(setTradingModalOpen(false));
    }
  }, [isOpen, user, dispatch]);

  if (!isOpen) return null;

  const handleClose = () => {
    setLoading(null);
    setError(null);
    dispatch(setTradingModalOpen(false));
  };

  const handleDeploy = async () => {
    if (!user?.token) return;
    setLoading(0);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/auth/create-wallet`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (data.success) {
        dispatch(updateUser({ 
          proxyStatus: 'deploying',
          proxy_tx_hash: data.result.txHash 
        }));
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleEnableTrading = async () => {
    if (!user?.token || !address) return;
    setLoading(1);
    setError(null);
    try {
      const message = "Welcome to PolyMarket Clone! Sign this message to enable trading.";
      const signature = await signMessageAsync({ message });

      const { data } = await axios.post(`${API_URL}/auth/enable-trading`, {
        signature,
        message
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (data.success) {
        dispatch(updateUser({ isTradingEnabled: true }));
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleApprove = async () => {
    if (!user?.proxyWallet) {
      setError("Proxy wallet not found. Please deploy it first.");
      return;
    }
    setLoading(2);
    setError(null);
    try {
      const tx = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [user.proxyWallet as Address, parseUnits("1000000", 6)],
      });
      dispatch(updateUser({ isUSDCapproved: true }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const steps = [
    {
      title: "Deploy Proxy Wallet",
      desc: "Deploy a smart contract wallet to enable trading",
      action: "Deploy",
      handler: handleDeploy,
      status: user?.proxyStatus === 'deployed' ? 'completed' : user?.proxyStatus === 'deploying' ? 'loading' : 'pending'
    },
    {
      title: "Enable Trading",
      desc: "Sign a message to generate your API keys",
      action: "Sign",
      handler: handleEnableTrading,
      status: user?.isTradingEnabled ? 'completed' : 'pending'
    },
    {
      title: "Approve Tokens",
      desc: "Approve token spending for trading",
      action: "Approve",
      handler: handleApprove,
      status: (user as any)?.isUSDCapproved ? 'completed' : 'pending'
    },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-[#1c1f26] rounded-[28px] border border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden shadow-blue-500/10">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Enable Trading</h2>
            <button
              onClick={handleClose}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500 text-sm items-center">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 relative z-10 flex items-center justify-center ${
                    s.status === 'completed' ? 'border-green-500 bg-green-500' : 
                    s.status === 'loading' || loading === i ? 'border-blue-500' : 'border-zinc-700 bg-[#1c1f26]'
                  }`}>
                    {s.status === 'completed' ? (
                      <CheckCircle2 size={14} className="text-white" />
                    ) : s.status === 'loading' || loading === i ? (
                      <Loader2 size={12} className="text-blue-500 animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 h-12 -my-1 ${s.status === 'completed' ? 'bg-green-500/50' : 'bg-zinc-800/50'}`}></div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-bold transition-colors ${s.status === 'completed' ? 'text-green-500' : 'text-white group-hover:text-blue-400'}`}>
                        {s.title}
                      </h3>
                      <p className="text-xs text-zinc-500">{s.desc}</p>
                    </div>
                    {s.status !== 'completed' && (
                      <button
                        disabled={loading !== null || (i > 0 && (steps[i-1] as any).status !== 'completed')}
                        onClick={(s as any).handler}
                        className={`px-5 py-1.5 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 transform ${
                          loading === i ? 'bg-blue-600/50 cursor-not-allowed' : 
                          (i > 0 && (steps[i-1] as any).status !== 'completed') ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' :
                          'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10'
                        }`}
                      >
                        {loading === i ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : s.action}
                      </button>
                    )}
                    {s.status === 'completed' && (
                      <div className="text-green-500">
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-3">
            {steps.every(s => s.status === 'completed') ? (
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
              >
                Start Trading (Deposit)
              </button>
            ) : (
              <button
                 onClick={handleClose}
                 className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-2xl transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
