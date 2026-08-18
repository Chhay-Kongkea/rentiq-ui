"use client";

import { FormEvent, useState } from "react";
import {
  useCreateVendorTopupRequestMutation,
  useGetVendorTopupRequestsQuery,
  useGetVendorWalletQuery,
  useGetVendorWalletTransactionsQuery,
} from "@/redux/services/vendorApi";

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

export default function VendorWalletPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: wallet, isLoading: walletLoading } = useGetVendorWalletQuery();
  const { data: transactions, isLoading: transactionsLoading } = useGetVendorWalletTransactionsQuery({ page: 0, size: 50, sort: "createdAt,desc" });
  const { data: topups, isLoading: topupsLoading } = useGetVendorTopupRequestsQuery({ page: 0, size: 20, sort: "createdAt,desc" });
  const [createTopup, createState] = useCreateVendorTopupRequestMutation();

  async function handleTopup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    const paymentMethod = String(form.get("paymentMethod") || "").trim() || undefined;
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Top-up amount must be greater than 0.");
      return;
    }
    try {
      const result = await createTopup({ amount, paymentMethod }).unwrap();
      setSuccess(`Top-up request created with status ${result.status}.`);
      event.currentTarget.reset();
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to create top-up request."));
    }
  }

  const currency = wallet?.currency || "USD";
  const transactionRows = transactions?.content ?? [];
  const topupRows = topups?.content ?? [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Vendor funds</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Wallet</h1>
        <p className="mt-1 text-sm text-slate-500">Balance, transactions, and wallet top-up requests.</p>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl bg-[#253C95] p-6 text-white shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-white/70">Available balance</p>
          <p className="mt-3 text-4xl font-extrabold">{walletLoading ? "..." : money(wallet?.balance, currency)}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
            <span>Frozen: <strong className="text-white">{money(wallet?.frozenBalance, currency)}</strong></span>
            <span>Status: <strong className="text-white">{wallet?.status || "—"}</strong></span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Top up wallet</h2>
          <p className="mt-1 text-xs text-slate-500">Creates `POST /wallets/me/topup-requests`.</p>
          <form onSubmit={handleTopup} className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Amount<input name="amount" type="number" min="0.01" step="0.01" required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <label className="block text-sm font-semibold text-slate-700">Payment method<input name="paymentMethod" placeholder="KHQR, BANK, ..." className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <button disabled={createState.isLoading} className="w-full rounded-lg bg-[#F73030] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{createState.isLoading ? "Creating..." : "Create top-up"}</button>
          </form>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-950">Transactions</h2><p className="text-xs text-slate-500">{transactions?.totalElements ?? transactionRows.length} total</p></div>
          {transactionsLoading ? <p className="p-6 text-sm text-slate-500">Loading transactions...</p> : null}
          <div className="divide-y divide-slate-100">
            {transactionRows.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{transaction.description || transaction.transactionType}</p><p className="text-xs text-slate-500">{transaction.transactionType} · {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : ""}</p></div>
                <div className="text-right"><p className={`text-sm font-extrabold ${transaction.direction === "IN" ? "text-emerald-600" : "text-red-600"}`}>{transaction.direction === "IN" ? "+" : "-"}{money(Math.abs(transaction.amount), currency)}</p><p className="text-[11px] text-slate-400">Balance {money(transaction.balanceAfter, currency)}</p></div>
              </div>
            ))}
            {!transactionsLoading && !transactionRows.length ? <p className="p-8 text-center text-sm text-slate-500">No wallet transactions.</p> : null}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-950">Top-up requests</h2><p className="text-xs text-slate-500">{topups?.totalElements ?? topupRows.length} total</p></div>
          {topupsLoading ? <p className="p-6 text-sm text-slate-500">Loading top-up requests...</p> : null}
          <div className="divide-y divide-slate-100">
            {topupRows.map((topup) => (
              <div key={topup.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div><p className="text-sm font-semibold text-slate-900">{money(topup.amount, currency)}</p><p className="text-xs text-slate-500">{topup.paymentMethod || "Payment method not specified"}</p></div>
                <div className="text-right"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{topup.status}</span>{topup.bankReference ? <p className="mt-1 text-[10px] text-slate-400">{topup.bankReference}</p> : null}</div>
              </div>
            ))}
            {!topupsLoading && !topupRows.length ? <p className="p-8 text-center text-sm text-slate-500">No top-up requests.</p> : null}
          </div>
        </section>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Your OpenAPI file does not expose a vendor wallet withdrawal endpoint, so I did not keep the old fake withdrawal action.
      </div>
    </div>
  );
}
