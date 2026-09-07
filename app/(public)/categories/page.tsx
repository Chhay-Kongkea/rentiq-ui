"use client";

import CategoryCard from "@/components/category-card";
import Footer from "@/components/footer";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";

const FALLBACK_ICON = "/img/electronics.png";

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery();
  const activeCategories = categories.filter((category) => category.active);

  return <>
    <main className="mx-auto min-h-[65vh] w-full max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="text-3xl font-bold"><span className="text-[#253C95]">Rental </span><span className="text-[#F73030]">Categories</span></h1>
      <p className="mt-2 text-sm text-neutral-500">Browse available rental types.</p>
      {isLoading ? <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-xl bg-neutral-100" />)}</div>
        : isError ? <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><p className="font-semibold text-red-700">Unable to load categories.</p><button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-semibold text-white">Try again</button></div>
        : activeCategories.length === 0 ? <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center text-neutral-500">No active categories are available.</div>
        : <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">{activeCategories.map((category) => <CategoryCard key={category.id} image={category.iconUrl || FALLBACK_ICON} title={category.name} count="View rentals" href={`/categories/${category.id}`} />)}</div>}
    </main>
    <Footer />
  </>;
}
