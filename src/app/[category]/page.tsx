import MarketsDisplay from "@/components/MarketsDisplay";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return (
    <div className="bg-white dark:bg-[#0b0c10] min-h-screen transition-colors duration-200">
      <MarketsDisplay category={decodedCategory} />
    </div>
  );
}
