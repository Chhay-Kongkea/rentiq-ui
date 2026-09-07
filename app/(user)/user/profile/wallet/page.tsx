"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, Wallet as WalletIcon } from "lucide-react";
import type { WalletTransactionResponse } from "@/lib/types/vendor.types";
import { useGetWalletQuery, useGetWalletTransactionQuery, useGetWalletTransactionsQuery } from "@/redux/services/renterApi";

function formatMoney(amount = 0, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatLabel(value?: string) {
  if (!value) return "";
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function WalletPage() {
  const { data: wallet, isLoading: isWalletLoading, isError: isWalletError, refetch } = useGetWalletQuery();
  const { data: transactionsPage, isLoading: isTransactionsLoading } = useGetWalletTransactionsQuery({ "pageable.page": 0, "pageable.size": 30, "pageable.sort": "createdAt,desc" });
  const transactions = transactionsPage?.content ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800"><span className="text-new-blue">My </span><span className="text-new-red">Wallet</span></h1>
          <p className="mt-1.5 text-sm text-slate-400">Your Rentiq balance and transaction history.</p>
        </div>

        {isWalletLoading ? (
          <div className="h-32 animate-pulse rounded-3xl bg-white" />
        ) : isWalletError || !wallet ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="text-sm font-semibold text-red-700">Unable to load your wallet.</p>
            <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-new-red px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><WalletIcon className="size-3.5" /> Available balance</p>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">{formatMoney(wallet.balance, wallet.currency)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${wallet.status === "ACTIVE" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>{wallet.status}</span>
            </div>
            {wallet.frozenBalance > 0 ? <p className="mt-2 text-xs text-slate-400">{formatMoney(wallet.frozenBalance, wallet.currency)} frozen</p> : null}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-sm font-bold text-slate-800">Transaction history</h2>
          {isTransactionsLoading ? (
            <div className="mt-4 space-y-3">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-2xl bg-white" />)}</div>
          ) : transactions.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-400">No transactions yet.</div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
              {transactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isLast={index === transactions.length - 1}
                  isSelected={selectedId === transaction.id}
                  onToggle={() => setSelectedId((current) => (current === transaction.id ? null : transaction.id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TransactionRow({ transaction, isLast, isSelected, onToggle }: { transaction: WalletTransactionResponse; isLast: boolean; isSelected: boolean; onToggle: () => void }) {
  const { data: detail, isFetching } = useGetWalletTransactionQuery(transaction.id, { skip: !isSelected });
  const isCredit = transaction.direction === "IN";

  return (
    <div className={isLast ? "" : "border-b border-slate-100"}>
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-50">
        <div className="flex items-center gap-3">
          <span className={`flex size-9 items-center justify-center rounded-full ${isCredit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-new-red"}`}>
            {isCredit ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-800">{formatLabel(transaction.transactionType)}</p>
            <p className="text-xs text-slate-400">{formatDateTime(transaction.createdAt)}</p>
          </div>
        </div>
        <span className={`text-sm font-bold ${isCredit ? "text-emerald-600" : "text-new-red"}`}>{isCredit ? "+" : "-"}{formatMoney(transaction.amount, "USD")}</span>
      </button>
      {isSelected ? (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">
          {isFetching ? <Loader2 className="size-3.5 animate-spin" /> : (
            <div className="space-y-1">
              {(detail?.description || transaction.description) ? <p>{detail?.description || transaction.description}</p> : null}
              <p>Balance after: <span className="font-semibold text-slate-700">{formatMoney((detail ?? transaction).balanceAfter)}</span></p>
              {transaction.bookingId ? <p>Booking: {transaction.bookingId.slice(0, 8)}</p> : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
