"use client";

import { useMemo, useState } from "react";
import {
  useDeleteVendorNotificationMutation,
  useGetVendorNotificationsQuery,
  useGetVendorUnreadNotificationCountQuery,
  useMarkAllVendorNotificationsReadMutation,
  useMarkVendorNotificationReadMutation,
} from "@/redux/services/vendorApi";
import type { NotificationType } from "@/lib/types/vendor.types";

const FILTERS: Array<"ALL" | NotificationType> = ["ALL", "BOOKING", "PAYMENT", "ITEM_REQUEST", "OFFER", "ITEM", "MARKETING", "SYSTEM"];

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
}

export default function VendorNotificationsPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("ALL");
  const [error, setError] = useState("");
  const { data: page, isLoading } = useGetVendorNotificationsQuery({ pageSize: 100 });
  const { data: unread } = useGetVendorUnreadNotificationCountQuery();
  const [markRead, markReadState] = useMarkVendorNotificationReadMutation();
  const [markAllRead, markAllState] = useMarkAllVendorNotificationsReadMutation();
  const [deleteNotification, deleteState] = useDeleteVendorNotificationMutation();

  const notifications = page?.content ?? [];
  const filtered = useMemo(
    () => active === "ALL" ? notifications : notifications.filter((notification) => notification.notificationType === active),
    [notifications, active],
  );

  async function handleRead(id: string) {
    setError("");
    try {
      await markRead(id).unwrap();
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to mark notification as read."));
    }
  }

  async function handleReadAll() {
    setError("");
    try {
      await markAllRead().unwrap();
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to mark all notifications as read."));
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteNotification(id).unwrap();
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to delete notification."));
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#F73030]">Activity</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">{unread?.unreadCount ?? 0} unread notifications.</p>
        </div>
        <button onClick={handleReadAll} disabled={markAllState.isLoading || !notifications.length} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50">
          {markAllState.isLoading ? "Updating..." : "Mark all as read"}
        </button>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max gap-1">
          {FILTERS.map((filter) => (
            <button key={filter} onClick={() => setActive(filter)} className={`rounded-xl px-3 py-2 text-xs font-semibold ${active === filter ? "bg-[#253C95] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {filter === "ALL" ? "All" : filter.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? <p className="p-6 text-sm text-slate-500">Loading notifications...</p> : null}
        <div className="divide-y divide-slate-100">
          {filtered.map((notification) => (
            <article key={notification.id} className={`p-5 ${notification.read ? "bg-white" : "bg-blue-50/40"}`}>
              <div className="flex gap-4">
                <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? "bg-slate-200" : "bg-[#F73030]"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-950">{notification.title}</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{notification.notificationType}</span></div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{notification.body}</p>
                      <p className="mt-2 text-xs text-slate-400">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}{notification.referenceType ? ` · ${notification.referenceType}` : ""}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {!notification.read ? <button onClick={() => handleRead(notification.id)} disabled={markReadState.isLoading} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">Mark read</button> : null}
                      <button onClick={() => handleDelete(notification.id)} disabled={deleteState.isLoading} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {!isLoading && !filtered.length ? <p className="p-10 text-center text-sm text-slate-500">No notifications in this category.</p> : null}
        </div>
      </section>
    </div>
  );
}
