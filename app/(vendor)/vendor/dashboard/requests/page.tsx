"use client";

import { FormEvent, useMemo, useState } from "react";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import {
  useCreateVendorOfferMutation,
  useGetMyVendorItemsQuery,
  useGetMyVendorOffersQuery,
  useGetOpenItemRequestsForVendorQuery,
  useUpdateVendorOfferMutation,
  useWithdrawVendorOfferMutation,
} from "@/redux/services/vendorApi";
import type { ItemRequestResponse, OfferResponse } from "@/lib/types/vendor.types";

function money(value?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value ?? 0);
}

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
}

export default function VendorRequestsPage() {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [selectedRequest, setSelectedRequest] = useState<ItemRequestResponse | null>(null);
  const [editingOffer, setEditingOffer] = useState<OfferResponse | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: requestPage, isLoading: requestsLoading } = useGetOpenItemRequestsForVendorQuery({
    keyword: keyword.trim() || undefined,
    categoryId,
    status: "OPEN",
    pageNumber: 0,
    pageSize: 30,
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  const { data: itemPage } = useGetMyVendorItemsQuery({ pageSize: 100 });
  const { data: offersPage, isLoading: offersLoading } = useGetMyVendorOffersQuery({ pageSize: 100 });
  const [createOffer, createState] = useCreateVendorOfferMutation();
  const [updateOffer, updateState] = useUpdateVendorOfferMutation();
  const [withdrawOffer, withdrawState] = useWithdrawVendorOfferMutation();

  const requests = requestPage?.content ?? [];
  const myItems = itemPage?.content ?? [];
  const myOffers = offersPage?.content ?? [];
  const offerByRequest = useMemo(() => new Map(myOffers.map((offer) => [offer.requestId, offer])), [myOffers]);

  async function submitOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const offeredPrice = Number(form.get("offeredPrice"));
    const itemId = String(form.get("itemId") || "").trim() || undefined;
    const currency = String(form.get("currency") || "USD").trim().toUpperCase();
    const message = String(form.get("message") || "").trim() || undefined;

    if (!Number.isFinite(offeredPrice) || offeredPrice <= 0) {
      setError("Offer price must be greater than 0.");
      return;
    }

    try {
      if (editingOffer) {
        await updateOffer({ offerId: editingOffer.id, body: { itemId, offeredPrice, currency, message } }).unwrap();
        setSuccess("Offer updated successfully.");
      } else if (selectedRequest) {
        await createOffer({ requestId: selectedRequest.id, body: { itemId, offeredPrice, currency, message } }).unwrap();
        setSuccess("Offer submitted successfully.");
      }
      setSelectedRequest(null);
      setEditingOffer(null);
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to save offer."));
    }
  }

  async function handleWithdraw(offerId: string) {
    if (!window.confirm("Withdraw this offer?")) return;
    setError("");
    setSuccess("");
    try {
      await withdrawOffer(offerId).unwrap();
      setSuccess("Offer withdrawn.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to withdraw offer."));
    }
  }

  const activeFormOffer = editingOffer;
  const formRequest = selectedRequest ?? requests.find((request) => request.id === editingOffer?.requestId) ?? null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Marketplace demand</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Requests & Offers</h1>
        <p className="mt-1 text-sm text-slate-500">Browse open renter requests and manage the offers you send.</p>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search requests..."
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#253C95]"
          />
          <select
            value={categoryId ?? ""}
            onChange={(event) => setCategoryId(event.target.value ? Number(event.target.value) : undefined)}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#253C95]"
          >
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-950">Open requests</h2>
            <p className="text-xs text-slate-500">{requestPage?.totalElements ?? requests.length} matching requests</p>
          </div>

          {requestsLoading ? <p className="p-6 text-sm text-slate-500">Loading requests...</p> : null}
          <div className="divide-y divide-slate-100">
            {requests.map((request) => {
              const existingOffer = offerByRequest.get(request.id);
              return (
                <article key={request.id} className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{request.title || "Untitled request"}</h3>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{request.status || "OPEN"}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{request.description || "No description provided."}</p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                        <span>Budget: {money(request.budgetMin)} – {money(request.budgetMax)}</span>
                        <span>Needed: {request.neededFrom || "?"} → {request.neededTo || "?"}</span>
                        <span>{request.offerCount ?? 0} offers</span>
                      </div>
                    </div>

                    {existingOffer ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => { setEditingOffer(existingOffer); setSelectedRequest(null); }}
                          disabled={existingOffer.status !== "PENDING"}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
                        >
                          Edit
                        </button>
                        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">{existingOffer.status}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSelectedRequest(request); setEditingOffer(null); }}
                        className="shrink-0 rounded-lg bg-[#F73030] px-4 py-2.5 text-xs font-bold text-white"
                      >
                        Make offer
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
            {!requestsLoading && !requests.length ? <p className="p-8 text-center text-sm text-slate-500">No open requests found.</p> : null}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-950">{activeFormOffer ? "Edit offer" : "Create offer"}</h2>
            <p className="mt-1 text-xs text-slate-500">
              {formRequest ? `For: ${formRequest.title || formRequest.id}` : "Choose an open request to create an offer."}
            </p>

            {formRequest || activeFormOffer ? (
              <form key={activeFormOffer?.id || formRequest?.id} onSubmit={submitOffer} className="mt-4 space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Your listing
                  <select name="itemId" defaultValue={activeFormOffer?.itemId || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal">
                    <option value="">No linked listing</option>
                    {myItems.map((item) => <option key={item.id} value={item.id}>{item.title || item.id}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-[1fr_100px] gap-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Offer price
                    <input name="offeredPrice" type="number" min="0.01" step="0.01" required defaultValue={activeFormOffer?.offeredPrice ?? ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Currency
                    <input name="currency" maxLength={3} defaultValue={activeFormOffer?.currency || "USD"} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal uppercase" />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Message
                  <textarea name="message" rows={4} defaultValue={activeFormOffer?.message || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" />
                </label>
                <div className="flex gap-2">
                  <button disabled={createState.isLoading || updateState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                    {createState.isLoading || updateState.isLoading ? "Saving..." : activeFormOffer ? "Update offer" : "Send offer"}
                  </button>
                  <button type="button" onClick={() => { setSelectedRequest(null); setEditingOffer(null); }} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
                </div>
              </form>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-950">My offers</h2>
              <span className="text-xs text-slate-500">{offersPage?.totalElements ?? myOffers.length}</span>
            </div>
            {offersLoading ? <p className="mt-4 text-sm text-slate-500">Loading offers...</p> : null}
            <div className="mt-3 divide-y divide-slate-100">
              {myOffers.slice(0, 10).map((offer) => (
                <div key={offer.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{offer.itemTitle || `Request ${offer.requestId.slice(0, 8)}`}</p>
                      <p className="text-xs text-slate-500">{money(offer.offeredPrice, offer.currency || "USD")} · {offer.status}</p>
                    </div>
                    {offer.status === "PENDING" ? (
                      <button
                        onClick={() => handleWithdraw(offer.id)}
                        disabled={withdrawState.isLoading}
                        className="text-xs font-semibold text-red-600 disabled:opacity-50"
                      >
                        Withdraw
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {!offersLoading && !myOffers.length ? <p className="py-5 text-center text-sm text-slate-500">No offers yet.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
