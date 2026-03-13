import MarketsDisplay from "@/components/MarketsDisplay";

export default function Home() {
  return (
    <main className="bg-white dark:bg-[#0b0c10] min-h-screen transition-colors duration-200">
      <MarketsDisplay category="Trending" />
    </main>
  );
}
