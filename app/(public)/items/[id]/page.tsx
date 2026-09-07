"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, BadgeCheck, CalendarDays, Check, ChevronRight, Heart, MapPin, PackageCheck, ShieldCheck, Star } from "lucide-react";
import type { Item, ItemImage, ItemReview } from "@/lib/types/item.types";
import { useGetItemQuery } from "@/redux/services/itemApi";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useAddFavoriteMutation, useGetFavoritesQuery, useGetItemAvailabilityQuery, useGetItemReviewsQuery, useRemoveFavoriteMutation } from "@/redux/services/renterApi";
import Footer from "@/components/footer";
import ReportDialog from "@/components/report-dialog";

const FALLBACK_IMAGE = "/img/electronics.png";
const imageUrl = (image?: ItemImage) => image?.imageUrl ?? image?.url ?? image?.thumbnailUrl ?? FALLBACK_IMAGE;
const label = (value?: string) => value ? value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Not specified";

function getImages(item: Item): ItemImage[] {
  if (!item.images?.length) return [{ imageUrl: item.primaryImageUrl ?? FALLBACK_IMAGE, primary: true }];
  return [...item.images].sort((a, b) => (a.sortOrder ?? a.displayOrder ?? 0) - (b.sortOrder ?? b.displayOrder ?? 0));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();
  const { data: item, isLoading, isError, refetch } = useGetItemQuery(id);
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: availability = [], isLoading: availabilityLoading } = useGetItemAvailabilityQuery(id);
  const { data: reviews, isLoading: reviewsLoading, isError: reviewsError } = useGetItemReviewsQuery({ itemId: id, params: { "pageable.page": 0, "pageable.size": 6, "pageable.sort": "createdAt,desc" } });
  const { data: favoritesResponse } = useGetFavoritesQuery(
    { "pageable.page": 0, "pageable.size": 100, "pageable.sort": "favoritedAt,desc" },
    { skip: status !== "authenticated" },
  );
  const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
  const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
  const [favoriteOverride, setFavoriteOverride] = useState<boolean | null>(null);
  const [favoriteError, setFavoriteError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const favoriteItems = Array.isArray(favoritesResponse) ? favoritesResponse : favoritesResponse?.content ?? [];
  const apiFavorite = favoriteItems.some((favorite) => favorite.itemId === item?.id);
  const isSaved = favoriteOverride ?? apiFavorite;
  const isUpdatingFavorite = isAddingFavorite || isRemovingFavorite;

  async function toggleFavorite() {
    if (!item || isUpdatingFavorite) return;
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/items/${item.id}`)}`);
      return;
    }
    const previous = isSaved;
    setFavoriteError(false);
    setFavoriteOverride(!previous);
    try {
      if (previous) await removeFavorite(item.id).unwrap();
      else await addFavorite(item.id).unwrap();
    } catch {
      setFavoriteOverride(previous);
      setFavoriteError(true);
    }
  }

  if (isLoading) return <DetailSkeleton />;
  if (isError || !item) return <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-6"><div className="max-w-md rounded-3xl border border-slate-200 bg-white p-9 text-center shadow-sm"><PackageCheck className="mx-auto size-9 text-slate-300" /><h1 className="mt-4 text-xl font-bold text-slate-900">Unable to load this item</h1><p className="mt-2 text-sm leading-6 text-slate-500">The item may be unavailable or no longer listed.</p><button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-[#253C95] px-5 py-2.5 text-sm font-bold text-white">Try again</button></div></main>;

  const images = getImages(item);
  const primary = images.find((image) => image.primary) ?? images[0];
  const activeImage = selectedImage ?? imageUrl(primary);
  const categoryName = categories.find((category) => category.id === item.categoryId)?.name || "Rental item";
  const specs = Object.entries(item.specifications ?? {});
  const bookingHref = item.available ? `/listings/${item.id}/checkout` : "#";

  return <>
    <main className="min-h-screen bg-slate-50 pb-28 font-sans lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
        <nav className="mb-5 flex items-center gap-2 text-sm text-slate-500"><Link href="/items" className="inline-flex items-center gap-2 font-semibold transition hover:text-[#253C95]"><ArrowLeft className="size-4" /> Items</Link><ChevronRight className="size-3.5" /><span className="truncate">{item.title ?? "Item details"}</span></nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] xl:gap-10">
          <div className="min-w-0 space-y-7">
            <section aria-label="Item gallery">
              <div className="relative flex aspect-[4/3] max-h-[620px] items-center justify-center overflow-hidden rounded-[28px] bg-white shadow-[0_12px_45px_rgba(15,23,42,0.08)] sm:aspect-[16/10]">
                <img src={activeImage} alt={item.title ?? "Rental item"} className="size-full object-contain p-5 sm:p-8" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">{item.featured ? <span className="rounded-full bg-[#253C95] px-3 py-1.5 text-xs font-bold text-white shadow">Featured</span> : null}<span className={`rounded-full px-3 py-1.5 text-xs font-bold shadow ${item.available ? "bg-emerald-500 text-white" : "bg-slate-800 text-white"}`}>{item.available ? "Available" : "Unavailable"}</span></div>
              </div>
              {images.length > 1 ? <div className="mt-3 flex gap-3 overflow-x-auto pb-1">{images.map((image, index) => { const url = imageUrl(image); const selected = url === activeImage; return <button key={image.id ?? `${url}-${index}`} type="button" aria-label={`View image ${index + 1}`} aria-pressed={selected} onClick={() => setSelectedImage(url)} className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition sm:size-24 ${selected ? "border-[#253C95] shadow-md" : "border-transparent hover:border-slate-300"}`}><img src={url} alt="" className="size-full rounded-xl object-cover" /></button>; })}</div> : null}
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#F73030]">{categoryName}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{label(item.condition)}</span>{item.approvalStatus === "APPROVED" ? <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#253C95]"><BadgeCheck className="size-3.5" /> Verified listing</span> : null}</div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{item.title ?? "Untitled item"}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5 font-semibold text-slate-800"><Star className="size-4 fill-amber-400 text-amber-400" />{(item.averageRating ?? 0).toFixed(1)} <span className="font-normal text-slate-400">({item.totalReviews ?? 0} reviews)</span></span><span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-[#F73030]" />{item.locationText || "Location unavailable"}</span></div>
              <div className="mt-7 border-t border-slate-100 pt-7"><h2 className="text-xl font-bold text-slate-900">About this item</h2><p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-600">{item.description || "The owner has not added a description yet."}</p></div>
            </section>

            {specs.length ? <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8"><h2 className="text-xl font-bold text-slate-900">Specifications</h2><div className="mt-5 grid gap-x-8 sm:grid-cols-2">{specs.map(([key, value]) => <div key={key} className="flex items-center justify-between gap-4 border-b border-slate-100 py-4"><span className="text-sm text-slate-500">{label(key)}</span><span className="text-right text-sm font-semibold text-slate-800">{String(value)}</span></div>)}</div></section> : null}

            <AvailabilitySection loading={availabilityLoading} blocks={availability} />
            <ReviewsSection loading={reviewsLoading} error={reviewsError} reviews={reviews?.content ?? []} total={reviews?.totalElements ?? item.totalReviews ?? 0} rating={item.averageRating ?? 0} />
          </div>

          <aside className="hidden self-start lg:sticky lg:top-6 lg:block"><BookingPanel item={item} categoryName={categoryName} bookingHref={bookingHref} isSaved={isSaved} isUpdating={isUpdatingFavorite} favoriteError={favoriteError} onFavorite={toggleFavorite} /></aside>
        </div>
      </div>
    </main>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_35px_rgba(15,23,42,0.1)] backdrop-blur lg:hidden"><div className="mx-auto flex max-w-7xl items-center gap-3"><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">From</p><p className="truncate text-xl font-extrabold text-[#F73030]">${item.pricePerDay ?? 0}<span className="text-xs font-medium text-slate-400"> / day</span></p></div><button type="button" onClick={toggleFavorite} disabled={isUpdatingFavorite} aria-label={isSaved ? "Remove saved item" : "Save item"} className={`grid size-12 place-items-center rounded-xl border ${isSaved ? "border-red-100 bg-red-50 text-[#F73030]" : "border-slate-200 text-slate-600"}`}><Heart className={`size-5 ${isSaved ? "fill-current" : ""}`} /></button><Link href={bookingHref} aria-disabled={!item.available} className={`flex h-12 min-w-36 items-center justify-center rounded-xl px-5 text-sm font-bold text-white ${item.available ? "bg-[#F73030]" : "pointer-events-none bg-slate-300"}`}>{item.available ? "Book now" : "Unavailable"}</Link></div></div>
    <Footer />
  </>;
}

function BookingPanel({ item, categoryName, bookingHref, isSaved, isUpdating, favoriteError, onFavorite }: { item: Item; categoryName: string; bookingHref: string; isSaved: boolean; isUpdating: boolean; favoriteError: boolean; onFavorite: () => void }) {
  return <div className="space-y-5"><section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.09)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#F73030]">{categoryName}</p><p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">${item.pricePerDay ?? 0}<span className="text-sm font-medium text-slate-400"> / day</span></p></div><button type="button" onClick={onFavorite} disabled={isUpdating} aria-label={isSaved ? "Remove saved item" : "Save item"} aria-pressed={isSaved} title={favoriteError ? "Unable to update favorites" : undefined} className={`grid size-11 place-items-center rounded-full border transition ${isSaved ? "border-red-100 bg-red-50 text-[#F73030]" : "border-slate-200 text-slate-600 hover:border-red-200 hover:text-[#F73030]"}`}><Heart className={`size-5 ${isSaved ? "fill-current" : ""}`} /></button></div><div className="my-6 h-px bg-slate-100" /><div className="space-y-3.5 text-sm"><Row name="Security deposit" value={`$${item.depositAmount ?? 0}`} /><Row name="Condition" value={label(item.condition)} /><Row name="Availability" value={item.available ? "Ready to rent" : "Currently unavailable"} accent={item.available} /></div><Link href={bookingHref} aria-disabled={!item.available} className={`mt-6 flex h-13 w-full items-center justify-center rounded-xl text-sm font-bold text-white transition ${item.available ? "bg-[#F73030] shadow-lg shadow-red-200 hover:bg-[#dc2929]" : "pointer-events-none bg-slate-300"}`}>{item.available ? "Choose dates & book" : "Currently unavailable"}</Link><p className="mt-3 text-center text-xs text-slate-400">You won&apos;t be charged yet</p></section>{item.ownerId ? <Link href={`/${encodeURIComponent(item.ownerId)}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-[#253C95] transition hover:border-[#253C95]/30"><span className="inline-flex items-center gap-2"><BadgeCheck className="size-5" /> View verified owner</span><ChevronRight className="size-4" /></Link> : null}
    <div className="flex justify-center"><ReportDialog target={{ type: "ITEM", id: item.id, label: item.title }} triggerLabel="Report this listing" /></div><section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><div className="grid grid-cols-3 gap-2 text-center"><Trust icon={<ShieldCheck />} value="Protected" /><Trust icon={<PackageCheck />} value={label(item.approvalStatus)} /><Trust icon={<CalendarDays />} value={`${item.totalBookings ?? 0} bookings`} /></div><p className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-700"><Check className="size-3.5" /> Secure rental through Rentiq</p></section></div>;
}

function AvailabilitySection({ loading, blocks }: { loading: boolean; blocks: Array<{ id: string; startDate: string; endDate: string; reason?: string }> }) {
  return <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#253C95]"><CalendarDays className="size-5" /></span><div><h2 className="text-xl font-bold text-slate-900">Availability</h2><p className="text-sm text-slate-500">Dates that are already unavailable</p></div></div>{loading ? <div className="mt-5 h-16 animate-pulse rounded-2xl bg-slate-100" /> : blocks.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{blocks.slice(0, 6).map((block) => <div key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><p className="text-sm font-bold text-slate-800">{formatDate(block.startDate)} – {formatDate(block.endDate)}</p><p className="mt-1 text-xs text-slate-500">{block.reason || "Reserved"}</p></div>)}</div> : <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">No blocked dates are currently listed.</div>}</section>;
}

function ReviewsSection({ loading, error, reviews, total, rating }: { loading: boolean; error: boolean; reviews: ItemReview[]; total: number; rating: number }) {
  return <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-8"><div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-900">Renter reviews</h2><p className="mt-1 text-sm text-slate-500">Feedback from completed rentals</p></div><div className="flex items-center gap-1 text-sm font-bold text-slate-800"><Star className="size-5 fill-amber-400 text-amber-400" />{rating.toFixed(1)} <span className="font-normal text-slate-400">({total})</span></div></div>{loading ? <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="h-36 animate-pulse rounded-2xl bg-slate-100" /><div className="h-36 animate-pulse rounded-2xl bg-slate-100" /></div> : error ? <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">Reviews are temporarily unavailable.</p> : reviews.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2">{reviews.map((review) => <article key={review.id} className="rounded-2xl border border-slate-200 p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-1">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < (review.rating ?? 0) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} />)}</div>{review.createdAt ? <time className="text-[11px] text-slate-400">{new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(review.createdAt))}</time> : null}</div><p className="mt-3 text-sm leading-6 text-slate-600">{review.reviewText || "The renter left a rating for this item."}</p>{review.vendorReply ? <div className="mt-4 rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-[#253C95]">Owner response</p><p className="mt-1 text-xs leading-5 text-slate-600">{review.vendorReply}</p></div> : null}<div className="mt-3 flex justify-end"><ReportDialog target={{ type: "REVIEW", id: review.id }} triggerLabel="Report" /></div></article>)}</div> : <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No reviews yet. Be the first renter to share an experience.</p>}</section>;
}

function DetailSkeleton() { return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-5 w-40 rounded bg-slate-200" /><div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]"><div className="space-y-6"><div className="aspect-[16/10] rounded-[28px] bg-white" /><div className="h-64 rounded-[28px] bg-white" /></div><div className="h-[430px] rounded-[28px] bg-white" /></div></div></main>; }
function Row({ name, value, accent }: { name: string; value: string; accent?: boolean }) { return <p className="flex justify-between gap-4 text-slate-500"><span>{name}</span><strong className={accent ? "text-emerald-600" : "text-slate-800"}>{value}</strong></p>; }
function Trust({ icon, value }: { icon: React.ReactNode; value: string }) { return <div className="flex min-w-0 flex-col items-center gap-2 text-[#253C95] [&>svg]:size-5"><span>{icon}</span><span className="w-full truncate text-[10px] font-semibold text-slate-600">{value}</span></div>; }
