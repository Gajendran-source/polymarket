"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Copy, Check, ExternalLink, ChevronRight, Wallet, RefreshCw } from "lucide-react";
import { useAccount, useBalance, useReadContracts, useChainId } from "wagmi";
import { useAppSelector } from "@/lib/redux/hooks";
import { formatUnits } from "viem";
import type { Address } from "viem";

// ── Token Configuration ──────────────────────────────────────────────────

type TokenConfig = {
    address: Address;
    symbol: string;
    name: string;
    decimals: number;
    icon: string;
    priceId?: string; // For CoinGecko
};

const CHAIN_ASSETS: Record<number, TokenConfig[]> = {
    1: [ // Mainnet
        { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", name: "USD Coin", decimals: 6, icon: "💵", priceId: "usd-coin" },
        { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", name: "Tether USD", decimals: 6, icon: "🟢", priceId: "tether" },
    ],
    137: [ // Polygon
        { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", symbol: "USDC", name: "USD Coin", decimals: 6, icon: "💵", priceId: "usd-coin" },
        { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", symbol: "USDT", name: "Tether USD", decimals: 6, icon: "🟢", priceId: "tether" },
    ],
    42161: [ // Arbitrum
        { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", symbol: "USDC", name: "USD Coin", decimals: 6, icon: "💵", priceId: "usd-coin" },
        { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", symbol: "USDT", name: "Tether USD", decimals: 6, icon: "🟢", priceId: "tether" },
    ],
    80002: [ // Amoy
        { address: "0x41e94404177041b62124827c1c4ee4f06318c26e", symbol: "USDC", name: "USD Coin (Amoy)", decimals: 6, icon: "💵", priceId: "usd-coin" },
        { address: "0x1d4a36fDb25048590968942FB8FCe96030338902", symbol: "USDT", name: "Tether USD (Amoy)", decimals: 6, icon: "🟢", priceId: "tether" },
        { address: "0x2d90a8a8167f97800a0a0a0a0a0a0a0a0a0a0a0a", symbol: "RWA", name: "Real World Asset", decimals: 18, icon: "🏦", priceId: "tether" },
    ],
};

const ERC20_ABI = [
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// ── Token row component ───────────────────────────────────────────────────
function TokenRow({
    icon,
    symbol,
    name,
    balance,
    decimals,
    usdPrice,
    isLoading,
}: {
    icon: string;
    symbol: string;
    name: string;
    balance: bigint | undefined;
    decimals: number;
    usdPrice?: number | null;
    isLoading: boolean;
}) {
    const formatted = useMemo(() => {
        if (balance === undefined) return "0.0000";
        return parseFloat(formatUnits(balance, decimals)).toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        });
    }, [balance, decimals]);

    const usdValue = useMemo(() => {
        if (balance === undefined || usdPrice == null) return null;
        const val = parseFloat(formatUnits(balance, decimals)) * usdPrice;
        return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, [balance, decimals, usdPrice]);

    return (
        <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#1a1d24] border border-zinc-800/50 hover:border-zinc-700 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl shrink-0 border border-zinc-700/50 shadow-inner">
                    {icon}
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm leading-tight">{symbol}</h4>
                    <p className="text-zinc-500 text-[11px] font-medium">{name}</p>
                </div>
            </div>
            <div className="text-right">
                {isLoading ? (
                    <div className="space-y-1.5">
                        <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse ml-auto" />
                        <div className="h-3 w-16 bg-zinc-800/50 rounded animate-pulse ml-auto" />
                    </div>
                ) : (
                    <>
                        <p className="text-white font-bold text-sm tracking-tight">
                            {formatted} {symbol}
                        </p>
                        <p className="text-zinc-500 text-[11px] font-medium">
                            {usdValue ? `$${usdValue}` : "—"}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────
export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const { isConnected, address } = useAccount();
    const chainId = useChainId();
    const { user } = useAppSelector((state) => state.auth);

    const [view, setView] = useState<"wallet" | "manual">("wallet");
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [prices, setPrices] = useState<Record<string, number>>({ USDC: 1, USDT: 1, RWA: 1 });

    useEffect(() => {
        setMounted(true);
    }, []);

    // ── Asset Setup ──────────────────────────────────────────────────────
    const currentAssets = useMemo(() => CHAIN_ASSETS[chainId] || [], [chainId]);

    // Fetch prices (simplified)
    useEffect(() => {
        if (!isOpen) return;
        const priceIds = ["ethereum", "matic-network", "arbitrum"];
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${priceIds.join(",")}&vs_currencies=usd`)
            .then((r) => r.json())
            .then((d) => {
                setPrices(prev => ({
                    ...prev,
                    ETH: d?.["ethereum"]?.usd ?? 0,
                    POL: d?.["matic-network"]?.usd ?? 0,
                    ARB: d?.["arbitrum"]?.usd ?? 0,
                }));
            })
            .catch(() => { });
    }, [isOpen]);

    // ── Native Balance ──────────────────────────────────────────────────
    const {
        data: nativeData,
        isLoading: nativeLoading,
        refetch: refetchNative,
    } = useBalance({
        address,
        chainId,
        query: { enabled: isConnected && !!address && isOpen },
    });

    // ── Multicall for ERC-20s ──────────────────────────────────────────
    const {
        data: tokenResults,
        isLoading: tokensLoading,
        refetch: refetchTokens,
    } = useReadContracts({
        contracts: currentAssets.map(token => ({
            address: token.address,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: address ? [address] : undefined,
            chainId,
        })),
        query: { enabled: isConnected && !!address && isOpen && currentAssets.length > 0 },
    });

    const handleRefresh = () => {
        refetchNative();
        refetchTokens();
    };

    if (!isOpen || !mounted) return null;

    const depositAddress = user?.proxyWallet && user?.proxyWallet !== "0x0000000000000000000000000000000000000000"
        ? user.proxyWallet
        : user?.wallet;

    const handleCopy = () => {
        if (!depositAddress) return;
        navigator.clipboard.writeText(depositAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

    // Native token icon/symbol based on network
    const nativeAsset = {
        icon: chainId === 1 || chainId === 42161 ? "🔷" : "🟣",
        symbol: chainId === 1 || chainId === 42161 ? "ETH" : "POL",
        name: chainId === 1 ? "Ethereum" : chainId === 42161 ? "Arbitrum ETH" : "Polygon Native",
        priceId: chainId === 1 || chainId === 42161 ? "ETH" : "POL"
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[480px] bg-[#12141a] rounded-[32px] border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* ── Header ── */}
                <div className="px-6 pt-6 pb-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Wallet size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white leading-none">Deposit</h2>
                                <p className="text-[11px] text-zinc-500 font-bold mt-1 uppercase tracking-wider">
                                    Polymarket Balance: <span className="text-white">${user?.cashBalance?.toFixed(2) ?? "0.00"}</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-bold"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex p-1 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                        <button
                            onClick={() => setView("wallet")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black rounded-xl transition-all ${view === "wallet"
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                                : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            Wallet Assets
                        </button>
                        <button
                            onClick={() => setView("manual")}
                            className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${view === "manual"
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                                : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            Direct Transfer
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-4 space-y-4 max-h-[440px] overflow-y-auto custom-scrollbar">

                    {view === "wallet" ? (
                        <div className="space-y-3">
                            {!isConnected ? (
                                <div className="flex flex-col items-center gap-4 py-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner">
                                        <Wallet size={28} className="text-zinc-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white font-bold text-sm">Wallet Not Connected</p>
                                        <p className="text-zinc-500 text-xs px-8">Connect your wallet to see token balances</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Connection Banner */}
                                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg uppercase">
                                                {shortAddress.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white text-xs font-bold leading-none">Account ({shortAddress})</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                </div>
                                                <p className="text-zinc-600 text-[10px] font-bold mt-1 uppercase tracking-tight">
                                                    {chainId === 80002 ? "Polygon Amoy Testnet" : chainId === 137 ? "Polygon Mainnet" : chainId === 1 ? "Ethereum Mainnet" : chainId === 42161 ? "Arbitrum Mainnet" : "Connected Network"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRefresh}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-500 hover:text-white transition-all active:scale-95"
                                        >
                                            <RefreshCw size={14} className={nativeLoading || tokensLoading ? "animate-spin text-blue-500" : ""} />
                                        </button>
                                    </div>

                                    {/* Asset List */}
                                    <div className="space-y-2">
                                        {/* Native Asset First */}
                                        <TokenRow
                                            icon={nativeAsset.icon}
                                            symbol={nativeAsset.symbol}
                                            name={nativeAsset.name}
                                            balance={nativeData?.value}
                                            decimals={18}
                                            usdPrice={prices[nativeAsset.priceId]}
                                            isLoading={nativeLoading}
                                        />

                                        {/* Dynamic ERC20 Assets */}
                                        {currentAssets.map((token, idx) => (
                                            <TokenRow
                                                key={token.address}
                                                icon={token.icon}
                                                symbol={token.symbol}
                                                name={token.name}
                                                balance={tokenResults?.[idx]?.result as bigint}
                                                decimals={token.decimals}
                                                usdPrice={prices[token.symbol] || 1.0}
                                                isLoading={tokensLoading}
                                            />
                                        ))}

                                        {/* Empty State for unsupported chains */}
                                        {currentAssets.length === 0 && !nativeLoading && (
                                            <p className="text-center py-4 text-zinc-600 text-[10px] font-black uppercase">
                                                No specific tokens configured for this network
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setView("manual")}
                                        className="w-full mt-2 group bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/10 active:scale-[0.98]"
                                    >
                                        Add Funds to Deposit Address
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        /* DIRECT TRANSFER TAB */
                        <div className="space-y-6 py-2">
                            <div className="text-center space-y-2">
                                <h3 className="text-white font-black text-sm">Your Deposit Address</h3>
                                <p className="text-zinc-500 text-xs px-10">
                                    Send assets to this address on <span className="text-blue-500 font-bold">Polygon Amoy</span> to fund your account
                                </p>
                            </div>

                            <div className="p-6 rounded-[24px] bg-zinc-900/50 border border-zinc-800/80 space-y-5">
                                <div className="space-y-2">
                                    <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest pl-1">
                                        Copy Address
                                    </p>
                                    <div className="flex items-center justify-between bg-[#0a0b0e] rounded-2xl p-4 border border-zinc-800 gap-4 group">
                                        <code className="text-blue-400 font-mono text-sm truncate select-all">
                                            {depositAddress || "Connect wallet to see address"}
                                        </code>
                                        <button
                                            onClick={handleCopy}
                                            disabled={!depositAddress}
                                            className={`p-2.5 rounded-xl transition-all shrink-0 ${copied ? "bg-green-600/20 text-green-500" : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                                                }`}
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { t: "USDC", d: "Stable", c: "bg-blue-500/10 text-blue-400" },
                                        { t: "POL", d: "Native", c: "bg-purple-500/10 text-purple-400" },
                                    ].map((token) => (
                                        <div key={token.t} className="flex flex-col gap-1 p-3 rounded-xl bg-black/30 border border-zinc-800/50">
                                            <span className={`text-xs font-black px-2 py-0.5 rounded-full w-fit ${token.c}`}>{token.t}</span>
                                            <span className="text-[10px] text-zinc-600 font-bold uppercase ml-2">{token.d} Token</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {depositAddress && (
                                <a
                                    href={`https://amoy.polygonscan.com/address/${depositAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-center items-center gap-2 text-zinc-500 hover:text-white text-[11px] font-bold transition-all hover:underline underline-offset-4"
                                >
                                    View on Explorer <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-5 bg-zinc-900/30 border-t border-zinc-800/50">
                    <p className="text-center text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-tighter">
                        Safe & Secure Deposits · Credits automatically after confirmation
                    </p>
                </div>
            </div>
        </div>
    );
}