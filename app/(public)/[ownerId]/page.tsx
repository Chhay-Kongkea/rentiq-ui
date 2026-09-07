"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import Footer from "@/components/footer";
import ReportDialog from "@/components/report-dialog";
import RentalCard from "@/components/rental-card";
import type { Item } from "@/lib/types/item.types";
import { useGetPublicUserProfileQuery } from "@/redux/services/userApi";
import { useGetOwnerItemsQuery } from "@/redux/services/itemApi";

const FALLBACK_IMAGE = "/img/electronics.png";

function getImage(item: Item): string {
  if (item.primaryImageUrl) return item.primaryImageUrl;
  const firstImage = item.images?.find((image) => image.primary) ?? item.images?.[0];
  return firstImage?.imageUrl ?? firstImage?.thumbnailUrl ?? firstImage?.url ?? FALLBACK_IMAGE;
}

function statusOf(error: unknown): number | undefined {
  return typeof error === "object" && error !== null && "status" in error && typeof error.status === "number" ? error.status : undefined;
}

export default function PublicOwnerProfilePage() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const { data: profile, error, isLoading, refetch } = useGetPublicUserProfileQuery(ownerId);
  const { data: ownerItems, isLoading: isItemsLoading } = useGetOwnerItemsQuery({ ownerId, pageNumber: 0, pageSize: 8 }, { skip: !profile });
  const items = ownerItems?.content ?? [];

  return <>
    <main className="min-h-[65vh] bg-[#f7f8fb] px-4 py-12 sm:px-8">
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        {isLoading ? (
          <div className="animate-pulse"><div className="mx-auto size-24 rounded-full bg-slate-100" /><div className="mx-auto mt-6 h-7 w-48 rounded bg-slate-100" /><div className="mx-auto mt-3 h-4 w-32 rounded bg-slate-100" /></div>
        ) : error || !profile ? (
          <div><span className="mx-auto grid size-20 place-items-center rounded-full bg-slate-100 text-slate-400"><UserRound className="size-9" /></span><h1 className="mt-5 text-2xl font-bold text-slate-900">{statusOf(error) === 404 ? "User not found" : "Unable to load this profile"}</h1><p className="mt-2 text-sm text-slate-500">{statusOf(error) === 404 ? "This public profile does not exist." : "The profile service may be temporarily unavailable."}</p>{statusOf(error) !== 404 ? <button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-[#F73030] px-5 py-2.5 text-sm font-semibold text-white">Try again</button> : null}</div>
        ) : (
          <div>
            <div className="mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full bg-rose-50 text-[#F73030]">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} className="size-full object-cover" /> : <UserRound className="size-10" />}</div>
            <h1 className="mt-5 text-2xl font-bold text-[#253C95]">{`${profile.firstName} ${profile.lastName}`.trim() || profile.username}</h1>
            <p className="mt-1 text-sm text-slate-500">@{profile.username}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500"><CalendarDays className="size-4 text-[#F73030]" /> Member since {new Date(profile.memberSince).toLocaleDateString(undefined, { year: "numeric", month: "long" })}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4"><Link href="/items" className="inline-flex rounded-xl bg-[#F73030] px-6 py-3 text-sm font-bold text-white hover:bg-[#dd2b2b]">Browse rentals</Link><ReportDialog target={{ type: "USER", id: ownerId, label: profile.username }} triggerLabel="Report this user" /></div>
          </div>
        )}
      </section>

      {profile && (isItemsLoading || items.length > 0) ? (
        <section className="mx-auto mt-10 max-w-6xl">
          <h2 className="text-lg font-bold text-slate-800">Listings from {profile.username}</h2>
          {isItemsLoading ? (
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl bg-white" />)}</div>
          ) : (
            <div className="mt-5 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-4">
              {items.map((item) => (
                <RentalCard key={item.id} id={item.id} category="Rental" image={getImage(item)} title={item.title ?? "Untitled item"} location={item.locationText ?? "Location unavailable"} rating={item.averageRating ?? 0} price={item.pricePerDay ?? 0} condition={item.condition} featured={item.featured} available={item.available} totalReviews={item.totalReviews} />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </main>
    <Footer />
  </>;
}
