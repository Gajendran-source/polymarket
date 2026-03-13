import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Market {
  title: string;
  image: string;
  options: { name: string; percentage: number }[];
  volume: string;
  badge?: string;
  category: string;
  variant: "single" | "multi" | "binary";
}

interface MarketsState {
  items: Market[];
  selectedCategory: string;
}

const initialState: MarketsState = {
  items: [
    {
      title: "Will the Iranian regime fall by June 30?",
      image: "https://flagcdn.com/ir.svg",
      options: [{ name: "Yes", percentage: 32 }],
      volume: "$12M",
      variant: "single",
      category: "Politics",
    },
    {
      title: "US forces enter Iran by...?",
      image: "https://flagcdn.com/us.svg",
      options: [
        { name: "March 14", percentage: 23 },
        { name: "March 31", percentage: 44 },
      ],
      volume: "$10M",
      variant: "multi",
      category: "Iran",
    },
    {
      title: "BTC 5 Minute Up or Down",
      image: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040",
      options: [{ name: "Up", percentage: 51 }],
      volume: "$42M",
      badge: "LIVE",
      variant: "binary",
      category: "Crypto",
    },
    {
      title: "Oscars 2026: Best Picture Winner",
      image: "https://img.icons8.com/color/96/oscar.png",
      options: [
        { name: "One Battle After Ano...", percentage: 74 },
        { name: "Sinners", percentage: 22 },
      ],
      volume: "$27M",
      variant: "multi",
      category: "Oscars",
    },
    {
      title: "US x Iran ceasefire by...?",
      image: "https://flagcdn.com/un.svg",
      options: [
        { name: "March 15", percentage: 8 },
        { name: "March 31", percentage: 25 },
      ],
      volume: "$14M",
      variant: "multi",
      category: "Politics",
    },
    {
      title: "Dota 2: Xtreme vs BetBoom",
      image: "https://img.icons8.com/ios-filled/100/dota.png",
      options: [
        { name: "Xtreme Gaming", percentage: 66 },
        { name: "BetBoom Team", percentage: 35 },
      ],
      volume: "$671K",
      badge: "Game 3",
      variant: "multi",
      category: "Dota 2",
    },
    {
      title: "CS2: FUT vs B8",
      image: "https://img.icons8.com/ios-filled/100/counter-strike.png",
      options: [
        { name: "FUT Esports", percentage: 64 },
        { name: "B8", percentage: 37 },
      ],
      volume: "$352K",
      badge: "LIVE",
      variant: "multi",
      category: "CS2",
    },
    {
      title: "NBA: 76ers vs Cavaliers",
      image: "https://img.icons8.com/ios-filled/100/basketball.png",
      options: [
        { name: "76ers", percentage: 18 },
        { name: "Cavaliers", percentage: 83 },
      ],
      volume: "$681K",
      variant: "multi",
      category: "NBA",
    },
  ],
  selectedCategory: "All",
};

export const marketsSlice = createSlice({
  name: "markets",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setCategory } = marketsSlice.actions;

export default marketsSlice.reducer;
