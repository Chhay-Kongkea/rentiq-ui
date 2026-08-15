// components/category-card.tsx
import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  image: string;
  title: string;
  count: string;
  href?: string;
}

export default function CategoryCard({ image, title, count, href = "/categories" }: CategoryCardProps) {
  return (
    <Link href={href} className="flex flex-col items-center justify-between rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:shadow-md cursor-pointer">
      <div className="relative mb-2.5 flex size-14 items-center justify-center sm:size-16">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="text-center">
        <h3 className="text-xs font-semibold text-neutral-900 sm:text-sm">{title}</h3>
        <p className="mt-0.5 text-[10px] text-neutral-400">{count}</p>
      </div>
    </Link>
  );
}
