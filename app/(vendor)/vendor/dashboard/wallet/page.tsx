"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import type { TopupRequestStatus, WalletResponse } from "@/lib/types/vendor.types";
import {
  useCreateVendorTopupRequestMutation,
  useGetVendorTopupRequestsQuery,
  useGetVendorWalletQuery,
  useGetVendorWalletTransactionsQuery,
} from "@/redux/services/vendorApi";

const ACCENT = "#F73030";

const PAYMENT_METHODS = [
  { value: "KHQR", label: "KHQR" },
  { value: "BAKONG", label: "Bakong" },
  { value: "ABA", label: "ABA Bank" },
  { value: "ACLEDA", label: "ACLEDA Bank" },
  { value: "WING", label: "Wing" },
  { value: "BANK", label: "Bank transfer" },
  { value: "CARD", label: "Credit / debit card" },
  { value: "CASH", label: "Cash" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  SUCCESS: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  EXPIRED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

function money(value?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value ?? 0);
}

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string; validationErrors?: Record<string, string> } }).data;
    const validation = data?.validationErrors ? Object.values(data.validationErrors).filter(Boolean) : [];
    if (validation.length) return validation.join(" ");
    if (data?.message) return data.message;
  }
  return fallback;
}

function StatusBadge({ status }: { status?: TopupRequestStatus }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 ring-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Request-a-top-up form                                              */
/* ------------------------------------------------------------------ */

const topupSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMethod: z.string().trim().max(50, "Payment method is too long").optional(),
  bankReference: z.string().trim().max(255, "Reference is too long").optional(),
});
type TopupValues = z.infer<typeof topupSchema>;

function TopupRequestForm({ wallet }: { wallet: WalletResponse }) {
  const currency = wallet.currency || "USD";
  const [createRequest, { isLoading }] = useCreateVendorTopupRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof topupSchema>, unknown, TopupValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: { amount: undefined, paymentMethod: "", bankReference: "" },
  });

  async function onSubmit(values: TopupValues) {
    try {
      await createRequest({
        amount: values.amount,
        paymentMethod: values.paymentMethod,
        bankReference: values.bankReference || undefined,
      }).unwrap();
      toast.success("Top-up request submitted — an admin will review it.");
      reset({ amount: undefined, paymentMethod: "", bankReference: "" });
    } catch (error) {
      toast.error(apiMessage(error, "Unable to submit the top-up request."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        Amount ({currency})
        <input
          type="number"
          step="0.01"
          min="0.01"
          {...register("amount")}
          aria-invalid={Boolean(errors.amount)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        />
        {errors.amount ? (
          <span className="mt-1 block text-xs font-medium text-red-500">{errors.amount.message}</span>
        ) : null}
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Payment method
        <select
          {...register("paymentMethod")}
          aria-invalid={Boolean(errors.paymentMethod)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        >
          <option value="">Select payment method</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
        {errors.paymentMethod ? <span className="mt-1 block text-xs font-medium text-red-500">{errors.paymentMethod.message}</span> : null}
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Bank reference <span className="font-normal text-slate-400">(optional)</span>
        <input
          {...register("bankReference")}
          aria-invalid={Boolean(errors.bankReference)}
          placeholder="Transaction / receipt no."
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        />
        {errors.bankReference ? (
          <span className="mt-1 block text-xs font-medium text-red-500">{errors.bankReference.message}</span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: ACCENT }}
      >
        {isLoading ? "Submitting…" : "Submit top-up request"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function VendorWalletPage() {
  const { data: wallet, isLoading: walletLoading } = useGetVendorWalletQuery();
  const { data: transactions, isLoading: transactionsLoading } = useGetVendorWalletTransactionsQuery({
    page: 0,
    size: 50,
    sort: "createdAt,desc",
  });
  const { data: topups, isLoading: topupsLoading } = useGetVendorTopupRequestsQuery({
    page: 0,
    size: 20,
    sort: "createdAt,desc",
  });

  const currency = wallet?.currency || "USD";
  const transactionRows = transactions?.content ?? [];
  const topupRows = topups?.content ?? [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Vendor funds</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Wallet</h1>
        <p className="mt-1 text-sm text-slate-500">
          Balance, top-up requests, and wallet transaction history.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl bg-[#253C95] p-6 text-white shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-white/70">Available balance</p>
          <p className="mt-3 text-4xl font-extrabold">
            {walletLoading ? "..." : money(wallet?.balance, currency)}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
            <span>
              Frozen: <strong className="text-white">{money(wallet?.frozenBalance, currency)}</strong>
            </span>
            <span>
              Status: <strong className="text-white">{wallet?.status || "—"}</strong>
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-950">Request a top-up</h2>
          <p className="mt-1 text-xs text-slate-500">
            Send the amount you paid and how you paid it. An admin reviews the request and credits
            your wallet once the payment is confirmed.
          </p>
          {walletLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading wallet…</p>
          ) : wallet ? (
            <TopupRequestForm wallet={wallet} />
          ) : (
            <p className="mt-4 text-sm text-slate-500">Wallet unavailable.</p>
          )}
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-950">Top-up requests</h2>
            <p className="text-xs text-slate-500">{topups?.totalElements ?? topupRows.length} total</p>
          </div>
          {topupsLoading ? <p className="p-6 text-sm text-slate-500">Loading requests...</p> : null}
          <div className="divide-y divide-slate-100">
            {topupRows.map((topup) => (
              <div key={topup.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {money(topup.amount, currency)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {topup.paymentMethod || "Method not specified"}
                    {topup.createdAt ? ` · ${new Date(topup.createdAt).toLocaleDateString()}` : ""}
                  </p>
                  {topup.bankReference ? (
                    <p className="mt-1 text-xs text-slate-400">Bank reference: {topup.bankReference}</p>
                  ) : null}
                </div>
                <StatusBadge status={topup.status} />
              </div>
            ))}
            {!topupsLoading && !topupRows.length ? (
              <p className="p-8 text-center text-sm text-slate-500">No top-up requests yet.</p>
            ) : null}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-950">Transactions</h2>
            <p className="text-xs text-slate-500">
              {transactions?.totalElements ?? transactionRows.length} total
            </p>
          </div>
          {transactionsLoading ? (
            <p className="p-6 text-sm text-slate-500">Loading transactions...</p>
          ) : null}
          <div className="divide-y divide-slate-100">
            {transactionRows.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {transaction.description || transaction.transactionType}
                  </p>
                  <p className="text-xs text-slate-500">
                    {transaction.transactionType} ·{" "}
                    {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-extrabold ${
                      transaction.direction === "IN" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {transaction.direction === "IN" ? "+" : "-"}
                    {money(Math.abs(transaction.amount), currency)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Balance {money(transaction.balanceAfter, currency)}
                  </p>
                </div>
              </div>
            ))}
            {!transactionsLoading && !transactionRows.length ? (
              <p className="p-8 text-center text-sm text-slate-500">No wallet transactions.</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
