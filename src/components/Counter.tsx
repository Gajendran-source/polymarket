"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  increment,
  decrement,
  incrementByAmount,
} from "@/lib/redux/features/counter/counterSlice";

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="p-8 w-full max-w-sm bg-[#1c1f26] rounded-2xl flex flex-col items-center space-y-6 border border-zinc-800 shadow-xl">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Trading Volume
        </h2>
        <p className="text-xs text-zinc-500 font-medium">REAL-TIME COUNTER</p>
      </div>

      <div className="text-6xl font-black font-mono text-blue-500 tabular-nums">
        ${count.toLocaleString()}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-bold text-sm border border-zinc-700"
        >
          Sell
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-900/20"
        >
          Buy
        </button>
      </div>

      <button
        onClick={() => dispatch(incrementByAmount(5))}
        className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl transition-all w-full font-semibold text-xs border border-zinc-800"
      >
        + Add Leverage (5)
      </button>
    </div>
  );
}
