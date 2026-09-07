"use client";

import { useState } from "react";
import Link from "next/link";
import { Banknote, CalendarDays, Compass, MapPin, Tag } from "lucide-react";
import { useGetNearbyItemRequestsQuery, useGetOpenItemRequestsQuery } from "@/redux/services/renterApi";
import type { ItemRequestResponse } from "@/lib/types/vendor.types";
import Footer from "@/components/footer";

export default function ItemRequestsPage() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [useNearby, setUseNearby] = useState(false);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setUseNearby(true);
        setLocationError("");
      },
      () => setLocationError("Unable to access your location."),
    );
  }

  const nearbyQuery = useGetNearbyItemRequestsQuery(
    { latitude: coords?.latitude, longitude: coords?.longitude, radiusKm: 25, pageNumber: 0, pageSize: 24 },
    { skip: !useNearby || !coords },
  );
  const openQuery = useGetOpenItemRequestsQuery({ pageNumber: 0, pageSize: 24 }, { skip: useNearby });
  const { data, isLoading, isError } = useNearby ? nearbyQuery : openQuery;
  const requests = data?.content ?? [];

  return (
    <>
      <main className="mx-auto min-h-[65vh] w-full max-w-7xl px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold"><span className="text-[#253C95]">Open </span><span className="text-[#F73030]">Requests</span></h1>
            <p className="mt-2 text-sm text-neutral-500">Browse what renters near you are looking for.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setUseNearby(false)} className={`rounded-full px-4 py-2 text-xs font-semibold ${!useNearby ? "bg-[#253C95] text-white" : "bg-slate-100 text-slate-600"}`}>All open</button>
            <button type="button" onClick={requestLocation} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold ${useNearby ? "bg-[#253C95] text-white" : "bg-slate-100 text-slate-600"}`}>
              <Compass className="size-3.5" /> Near me
            </button>
          </div>
        </div>

        {locationError ? <p className="mt-3 text-xs font-medium text-red-600">{locationError}</p> : null}

        {isLoading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl bg-neutral-100" />)}</div>
        ) : isError ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><p className="font-semibold text-red-700">Unable to load requests.</p></div>
        ) : requests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center text-neutral-500">No open requests right now.</div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request: ItemRequestResponse) => (
              <Link key={request.id} href={`/user/requests/requests_detail?requestId=${request.id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#F73030]"><Tag className="size-3.5" />{request.status || "OPEN"}</div>
                <h3 className="mt-2 line-clamp-1 text-base font-bold text-slate-900">{request.title || "Rental request"}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{request.description}</p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5"><Banknote className="size-3.5 text-[#253C95]" />{request.budgetMin ?? 0} - {request.budgetMax ?? 0} / day</p>
                  <p className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-[#253C95]" />{request.neededFrom} - {request.neededTo}</p>
                  {request.latitude != null ? <p className="flex items-center gap-1.5"><MapPin className="size-3.5 text-[#F73030]" />{request.latitude.toFixed(3)}, {request.longitude?.toFixed(3)}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
