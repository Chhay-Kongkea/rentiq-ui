"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import Footer from "@/components/footer";
import { useGetPublicUserProfileQuery } from "@/redux/services/userApi";

function statusOf(error: unknown): number | undefined {
  return typeof error === "object" && error !== null && "status" in error && typeof error.status === "number" ? error.status : undefined;
}

export default function PublicOwnerProfilePage() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const { data: profile, error, isLoading, refetch } = useGetPublicUserProfileQuery(ownerId);

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
            <div className="mt-8"><Link href="/items" className="inline-flex rounded-xl bg-[#F73030] px-6 py-3 text-sm font-bold text-white hover:bg-[#dd2b2b]">Browse rentals</Link></div>
          </div>
        )}
      </section>
    </main>
    <Footer />
  </>;
}
