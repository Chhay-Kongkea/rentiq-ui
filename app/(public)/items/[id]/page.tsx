"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, CalendarDays, Check, Heart, MapPin, PackageCheck, ShieldCheck, Star } from "lucide-react";
import type { Item, ItemImage } from "@/lib/types/item.types";
import { useGetItemQuery } from "@/redux/services/itemApi";
import Footer from "@/components/footer";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@/redux/services/renterApi";

const FALLBACK_IMAGE = "/img/electronics.png";
const imageUrl = (image?: ItemImage) => image?.imageUrl ?? image?.url ?? image?.thumbnailUrl ?? FALLBACK_IMAGE;
const label = (value?: string) => value ? value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not specified";

function getImages(item: Item): ItemImage[] {
  if (!item.images?.length) return [{ imageUrl: item.primaryImageUrl ?? FALLBACK_IMAGE, primary: true }];
  return [...item.images].sort((a, b) => (a.sortOrder ?? a.displayOrder ?? 0) - (b.sortOrder ?? b.displayOrder ?? 0));
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, isError, refetch } = useGetItemQuery(id);
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: favoritesResponse } = useGetFavoritesQuery({ "pageable.page": 0, "pageable.size": 50, "pageable.sort": "favoritedAt,desc" });
  const favoriteItems = Array.isArray(favoritesResponse) ? favoritesResponse : Array.isArray((favoritesResponse as { content?: unknown[] } | undefined)?.content) ? (favoritesResponse as { content: unknown[] }).content : [];
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const isSaved = favoriteItems.some((favorite) => (favorite as { itemId?: string; id?: string }).itemId === item?.id || (favorite as { itemId?: string; id?: string }).id === item?.id);

  if (isLoading) return <main className="min-h-screen bg-[#f7f7f8] px-6 py-10"><div className="mx-auto max-w-6xl animate-pulse space-y-6"><div className="h-6 w-28 rounded bg-slate-200" /><div className="grid gap-8 lg:grid-cols-[1fr_380px]"><div className="h-[520px] rounded-3xl bg-white" /><div className="h-[420px] rounded-3xl bg-white" /></div></div></main>;

  if (isError || !item) return <main className="flex min-h-[60vh] items-center justify-center bg-[#f7f7f8] px-6"><div className="rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-bold text-slate-900">Unable to load this item</h1><p className="mt-2 text-sm text-slate-500">The item may be unavailable or no longer listed.</p><button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#F73030]/90">Try again</button></div></main>;

  const images = getImages(item);
  const categoryName = categories.find((category) => category.id === item.categoryId)?.name || `Category ${item.categoryId ?? "-"}`;
  const primary = images.find((image) => image.primary) ?? images[0];
  const specs = Object.entries(item.specifications ?? {});

  return (<>
    <main className="min-h-screen bg-[#f7f7f8] px-6 py-8 font-sans sm:px-12 lg:px-24 lg:py-10 xl:px-32">
      <div className="mx-auto max-w-6xl">
        <Link href="/items" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#253C95]"><ArrowLeft className="size-4" /> Back to items</Link>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-[#fafafa] p-8"><img src={imageUrl(primary)} alt={item.title ?? "Rental item"} className="max-h-[440px] w-full object-contain" /></div>
              {images.length > 1 ? <div className="mt-4 grid grid-cols-4 gap-3">{images.slice(0, 4).map((image, index) => <div key={image.id ?? index} className="flex h-24 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#fafafa] p-2"><img src={imageUrl(image)} alt="" className="size-full object-contain" /></div>)}</div> : null}
            </section>
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-900">About this item</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{item.description || "The owner has not added a description yet."}</p></section>
            {specs.length ? <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-900">Specifications</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{specs.map(([key, value]) => <div key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3.5"><span className="text-sm text-slate-500">{label(key)}</span><span className="text-sm font-semibold text-slate-800">{String(value)}</span></div>)}</div></section> : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4"><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#F73030]">Category {item.categoryId ?? "—"}</span><button type="button" aria-label={isSaved ? "Remove saved item" : "Save item"} onClick={() => item && (isSaved ? removeFavorite(item.id) : addFavorite(item.id))} className={`flex size-10 items-center justify-center rounded-full bg-slate-50 transition hover:text-[#F73030] ${isSaved ? "text-[#F73030]" : "text-slate-500"}`}><Heart className={`size-5 ${isSaved ? "fill-current" : ""}`} /></button></div>
              <h1 className="mt-5 text-2xl font-bold leading-tight text-[#253C95]">{item.title ?? "Untitled item"}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /> {(item.averageRating ?? 0).toFixed(1)} ({item.totalReviews ?? 0} reviews)</span>{item.featured ? <span className="flex items-center gap-1 font-semibold text-[#F73030]"><BadgeCheck className="size-4" /> Featured</span> : null}</div>
              <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><MapPin className="size-4 text-[#F73030]" /> {item.locationText || "Location unavailable"}</p>
              <div className="my-6 h-px bg-slate-100" />
              <p className="text-xs text-slate-400">Price per day</p><p className="mt-1 text-3xl font-bold text-[#F73030]">${item.pricePerDay ?? 0}<span className="text-sm font-medium text-slate-400"> / day</span></p>
              <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm"><Row name="Deposit" value={`$${item.depositAmount ?? 0}`} /><Row name="Condition" value={label(item.condition)} /><Row name="Availability" value={item.available ? "Available" : "Unavailable"} accent={item.available} /></div>
              <Link href={item.available ? `/listings/${item.id}/checkout` : "#"} aria-disabled={!item.available} className={`mt-5 flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold text-white transition-colors ${item.available ? "bg-[#F73030] hover:bg-[#F73030]/90" : "pointer-events-none bg-slate-300"}`}>{item.available ? "Book Now" : "Currently unavailable"}</Link>
            </section>
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div className="grid grid-cols-3 gap-2 text-center"><Trust icon={<ShieldCheck />} value="Protected" /><Trust icon={<PackageCheck />} value={label(item.approvalStatus)} /><Trust icon={<CalendarDays />} value={`${item.totalBookings ?? 0} bookings`} /></div><p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400"><Check className="size-3.5 text-emerald-500" /> Secure rental through Rentiq</p></section>
          </aside>
        </div>
      </div>
    </main>
    <Footer />
  </>);
}

function Row({ name, value, accent }: { name: string; value: string; accent?: boolean }) {
  return <p className="flex justify-between text-slate-500"><span>{name}</span><strong className={accent ? "text-emerald-600" : "text-slate-800"}>{value}</strong></p>;
}

function Trust({ icon, value }: { icon: React.ReactNode; value: string }) {
  return <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 px-2 py-3 text-[#253C95] [&>svg]:size-4">{icon}<span className="text-[10px] font-semibold text-slate-600">{value}</span></div>;
}