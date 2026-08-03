
import Image from "next/image";

interface LocationCardProps {
  image: string;
  title: string;
  className?: string;
}

export default function LocationCard({ image, title, className = "" }: LocationCardProps) {
  return (
    <div className={`relative group overflow-hidden rounded-2xl shadow-md cursor-pointer ${className}`}>
      {/* Background Image with zoom effect on hover */}
      <div className="relative h-full w-full min-h-[220px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Location Title */}
      <div className="absolute bottom-4 left-4 z-10">
        <h3 className="text-lg font-bold text-white tracking-wide sm:text-xl">
          {title}
        </h3>
      </div>
    </div>
  );
}