"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import type { WalletResponse } from "@/lib/types/vendor.types";
import {
  useAdjustAdminWalletMutation,
  useGetAdminWalletTransactionsQuery,
  useGetAdminWalletsQuery,
  useTopupAdminWalletMutation,
} from "@/redux/services/adminWalletApi";

const ACCENT = "#F73030";
const PAGE_SIZE = 15;

const PAYMENT_METHODS = ["KHQR", "BAKONG", "ABA", "ACLEDA", "WING", "BANK", "CARD", "CASH"] as const;

function money(value?: number, currency = "USD") {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
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

/* ------------------------------------------------------------------ */
/* Top-up form                                                        */
/* ------------------------------------------------------------------ */

const topupSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Use a 3-letter currency code (e.g. USD)"),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().trim().max(200, "Reference is too long").optional(),
  note: z.string().trim().max(1000, "Note is too long").optional(),
});
type TopupValues = z.infer<typeof topupSchema>;

function TopupForm({ wallet }: { wallet: WalletResponse }) {
  const [topup, { isLoading }] = useTopupAdminWalletMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof topupSchema>, unknown, TopupValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: { amount: undefined, currency: wallet.currency || "USD", paymentMethod: "", paymentReference: "", note: "" },
  });

  async function onSubmit(values: TopupValues) {
    try {
      const result = await topup({
        walletId: wallet.id,
        body: {
          amount: values.amount,
          currency: values.currency,
          paymentMethod: values.paymentMethod || undefined,
          paymentReference: values.paymentReference || undefined,
          note: values.note || undefined,
        },
      }).unwrap();
      toast.success(
        `Credited ${money(result.amount, result.currency || values.currency)} — new balance ${money(
          result.balanceAfter,
          result.currency || values.currency,
        )}.`,
      );
      reset({ amount: undefined, currency: wallet.currency || "USD", paymentMethod: "", paymentReference: "", note: "" });
    } catch (error) {
      toast.error(apiMessage(error, "Unable to top up this wallet."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-700">
        Amount
        <input
          type="number"
          step="0.01"
          min="0.01"
          {...register("amount")}
          aria-invalid={Boolean(errors.amount)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        />
        {errors.amount ? <span className="mt-1 block text-xs font-medium text-red-500">{errors.amount.message}</span> : null}
      </label>

      <label className="text-sm font-semibold text-slate-700">
        Currency
        <input
          {...register("currency")}
          maxLength={3}
          aria-invalid={Boolean(errors.currency)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal uppercase aria-[invalid=true]:border-red-400"
        />
        {errors.currency ? <span className="mt-1 block text-xs font-medium text-red-500">{errors.currency.message}</span> : null}
      </label>

      <label className="text-sm font-semibold text-slate-700">
        Payment method <span className="font-normal text-slate-400">(optional)</span>
        <select
          {...register("paymentMethod")}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal"
        >
          <option value="">Not specified</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold text-slate-700">
        Payment reference <span className="font-normal text-slate-400">(optional)</span>
        <input
          {...register("paymentReference")}
          aria-invalid={Boolean(errors.paymentReference)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        />
        {errors.paymentReference ? (
          <span className="mt-1 block text-xs font-medium text-red-500">{errors.paymentReference.message}</span>
        ) : null}
      </label>

      <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
        Note <span className="font-normal text-slate-400">(optional)</span>
        <textarea
          {...register("note")}
          rows={2}
          aria-invalid={Boolean(errors.note)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        />
        {errors.note ? <span className="mt-1 block text-xs font-medium text-red-500">{errors.note.message}</span> : null}
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: ACCENT }}
        >
          {isLoading ? "Crediting…" : "Top up wallet"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Adjust form                                                        */
/* ------------------------------------------------------------------ */

const adjustSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  direction: z.enum(["IN", "OUT"], { message: "Choose a direction" }),
  reason: z.string().trim().min(1, "A reason is required").max(500, "Reason is too long"),
});
type AdjustValues = z.infer<typeof adjustSchema>;

function AdjustForm({ wallet }: { wallet: WalletResponse }) {
  const [adjust, { isLoading }] = useAdjustAdminWalletMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof adjustSchema>, unknown, AdjustValues>({
    resolver: zodResolver(adjustSchema),
    defaultValues: { amount: undefined, direction: "IN", reason: "" },
  });

  async function onSubmit(values: AdjustValues) {
    try {
      const result = await adjust({ walletId: wallet.id, body: values }).unwrap();
      toast.success(`Wallet adjusted — new balance ${money(result.balance, result.currency)}.`);
      reset({ amount: undefined, direction: "IN", reason: "" });
    } catch (error) {
      toast.error(apiMessage(error, "Unable to adjust this wallet."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-700">
        Amount
        <input
          type="number"
          step="0.01"
          min="0.01"
          {...register("amount")}
          aria-invalid={Boolean(errors.amount)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        />
        {errors.amount ? <span className="mt-1 block text-xs font-medium text-red-500">{errors.amount.message}</span> : null}
      </label>

      <label className="text-sm font-semibold text-slate-700">
        Direction
        <select
          {...register("direction")}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal"
        >
          <option value="IN">Credit (IN)</option>
          <option value="OUT">Debit (OUT)</option>
        </select>
        {errors.direction ? <span className="mt-1 block text-xs font-medium text-red-500">{errors.direction.message}</span> : null}
      </label>

      <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
        Reason
        <input
          {...register("reason")}
          aria-invalid={Boolean(errors.reason)}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal aria-[invalid=true]:border-red-400"
        />
        {errors.reason ? <span className="mt-1 block text-xs font-medium text-red-500">{errors.reason.message}</span> : null}
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          {isLoading ? "Adjusting…" : "Apply adjustment"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Selected wallet panel                                              */
/* ------------------------------------------------------------------ */

function WalletPanel({ wallet, onClose }: { wallet: WalletResponse; onClose: () => void }) {
  const [tab, setTab] = useState<"topup" | "adjust">("topup");
  const { data: txPage, isLoading: txLoading } = useGetAdminWalletTransactionsQuery({
    walletId: wallet.id,
    page: 0,
    size: 20,
    sort: "createdAt,desc",
  });
  const transactions = txPage?.content ?? [];

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Owner</p>
          <p className="truncate font-mono text-sm text-slate-800">{wallet.ownerId}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-950">{money(wallet.balance, wallet.currency)}</p>
          <p className="text-xs text-slate-500">
            Frozen {money(wallet.frozenBalance, wallet.currency)} · Status {wallet.status}
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500">
          Close
        </button>
      </div>

      <div className="flex gap-2">
        {(["topup", "adjust"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              tab === value ? "bg-[#253C95] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {value === "topup" ? "Top up" : "Adjust"}
          </button>
        ))}
      </div>

      {tab === "topup" ? <TopupForm key={`topup-${wallet.id}`} wallet={wallet} /> : <AdjustForm key={`adjust-${wallet.id}`} wallet={wallet} />}

      <div className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-bold text-slate-900">Recent transactions</h3>
        </div>
        {txLoading ? (
          <p className="p-4 text-sm text-slate-500">Loading transactions…</p>
        ) : transactions.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">No transactions.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {transaction.description || transaction.transactionType}
                  </p>
                  <p className="text-xs text-slate-500">
                    {transaction.transactionType} · {formatDateTime(transaction.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-extrabold ${
                      transaction.direction === "IN" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {transaction.direction === "IN" ? "+" : "-"}
                    {money(Math.abs(transaction.amount), wallet.currency)}
                  </p>
                  <p className="text-[11px] text-slate-400">Balance {money(transaction.balanceAfter, wallet.currency)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminWalletsPage() {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: walletsPage, isLoading, isFetching, isError, refetch } = useGetAdminWalletsQuery({
    page,
    size: PAGE_SIZE,
    sort: "updatedAt,desc",
  });

  const wallets = useMemo(() => walletsPage?.content ?? [], [walletsPage]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return wallets;
    return wallets.filter(
      (wallet) => wallet.ownerId?.toLowerCase().includes(term) || wallet.id?.toLowerCase().includes(term),
    );
  }, [wallets, query]);

  const selected = wallets.find((wallet) => wallet.id === selectedId) ?? null;
  const totalPages = walletsPage?.totalPages ?? 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-sm font-semibold text-[#F73030]">Platform funds</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Wallets</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review any wallet and credit it with a manual top-up or adjustment.
        </p>
      </div>

      {selected ? <WalletPanel wallet={selected} onClose={() => setSelectedId(null)} /> : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by owner or wallet ID…"
            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {isFetching ? <span className="ml-auto text-xs text-slate-400">Refreshing…</span> : null}
        </div>

        {isLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading wallets…</p>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="font-bold text-red-700">Unable to load wallets.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-[#F73030] px-4 py-2 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No wallets found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((wallet) => (
              <div key={wallet.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-slate-800">{wallet.ownerId}</p>
                  <p className="text-xs text-slate-500">
                    {money(wallet.balance, wallet.currency)} available · {money(wallet.frozenBalance, wallet.currency)} frozen ·{" "}
                    <span className={wallet.status === "ACTIVE" ? "text-emerald-600" : "text-amber-600"}>{wallet.status}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(wallet.id)}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={walletsPage?.first ?? page === 0}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {page + 1} of {totalPages} · {walletsPage?.totalElements ?? 0} total
            </span>
            <button
              type="button"
              onClick={() => setPage((value) => (walletsPage?.last ? value : value + 1))}
              disabled={walletsPage?.last ?? true}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
