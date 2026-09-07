"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faTrash, faBell } from "@fortawesome/free-solid-svg-icons";
import type { NotificationResponse, ReferenceType } from "@/lib/types/vendor.types";
import { Switch } from "@/components/ui/switch";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/redux/services/renterApi";
import { useGetMyNotificationPreferencesQuery, useUpdateMyNotificationPreferencesMutation } from "@/redux/services/userApi";
import type { NotificationPreferences } from "@/lib/types/user.types";

function referenceHref(referenceType?: ReferenceType, referenceId?: string) {
  if (!referenceId) return null;
  switch (referenceType) {
    case "BOOKING":
      return `/user/profile/my-booking/detail?bookingId=${encodeURIComponent(referenceId)}`;
    case "ITEM_REQUEST":
      return `/user/requests/requests_detail?requestId=${encodeURIComponent(referenceId)}`;
    case "OFFER":
      return `/user/requests/offer_detail?offerId=${encodeURIComponent(referenceId)}`;
    case "ITEM":
      return `/items/${encodeURIComponent(referenceId)}`;
    default:
      return null;
  }
}

function sectionLabel(createdAt?: string) {
  if (!createdAt) return "OLDER";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "OLDER";
  const today = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(today) - startOfDay(date)) / 86400000);
  if (diffDays <= 0) return "TODAY";
  if (diffDays === 1) return "YESTERDAY";
  return "OLDER";
}

function relativeTime(createdAt?: string) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return `${Math.max(1, Math.floor(diffMs / 60000))}m`;
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  return `${diffD}d ago`;
}

function dotColor(type: NotificationResponse["notificationType"]) {
  if (type === "PAYMENT") return "bg-new-red";
  if (type === "BOOKING" || type === "OFFER") return "bg-new-blue";
  return "bg-slate-400";
}

const SECTION_ORDER = ["TODAY", "YESTERDAY", "OLDER"] as const;
const PREFERENCE_FIELDS: Array<{ key: keyof NotificationPreferences; label: string }> = [
  { key: "bookingNotifications", label: "Booking updates" },
  { key: "paymentNotifications", label: "Payment updates" },
  { key: "emailNotifications", label: "Email notifications" },
  { key: "pushNotifications", label: "Push notifications" },
  { key: "marketingNotifications", label: "Marketing & promotions" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery({ pageNumber: 0, pageSize: 50 });
  const notifications = Array.isArray(data) ? data : data?.content ?? [];
  const { data: preferences } = useGetMyNotificationPreferencesQuery();
  const [updatePreferences] = useUpdateMyNotificationPreferencesMutation();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const grouped = SECTION_ORDER.map((section) => ({
    section,
    items: notifications.filter((item) => sectionLabel(item.createdAt) === section),
  })).filter((group) => group.items.length > 0);

  async function handleMarkAllAsRead() {
    try {
      await markAllRead().unwrap();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Unable to mark notifications as read");
    }
  }

  async function handleOpen(item: NotificationResponse) {
    if (!item.read) {
      markRead(item.id).catch(() => undefined);
    }
    const href = referenceHref(item.referenceType, item.referenceId);
    if (href) router.push(href);
  }

  async function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
    } catch {
      toast.error("Unable to delete notification");
    }
  }

  async function togglePreference(key: keyof NotificationPreferences, checked: boolean) {
    try {
      await updatePreferences({ [key]: checked }).unwrap();
    } catch {
      toast.error("Unable to update preferences");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-new-blue">Notifications</h1>
            <p className="mt-1 text-sm text-slate-400">Stay up to date on your bookings, offers, and requests.</p>
          </div>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || notifications.every((item) => item.read)}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold text-new-red shadow-xs transition hover:bg-red-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="h-3 w-3" />
            Mark all as read
          </button>
        </div>

        {preferences ? (
          <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notify me about</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PREFERENCE_FIELDS.map((field) => (
                <label key={field.key} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  <Switch
                    checked={preferences[field.key]}
                    onCheckedChange={(checked) => togglePreference(field.key, checked)}
                    className="data-checked:bg-new-red"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />)}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-sm font-semibold text-red-700">Unable to load your notifications.</p>
            <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-new-red px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            <FontAwesomeIcon icon={faBell} className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium">You&apos;re all caught up. No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map((group) => (
              <section key={group.section}>
                <h2 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">{group.section}</h2>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                  {group.items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleOpen(item)}
                      className={`group relative flex w-full items-start justify-between p-5 text-left transition hover:bg-slate-50 ${
                        index !== group.items.length - 1 ? "border-b border-slate-100" : ""
                      } ${!item.read ? "bg-slate-50/50" : "bg-white"}`}
                    >
                      <div className="flex items-start gap-3.5 pr-4">
                        <div className="shrink-0 pt-1">
                          {!item.read ? <span className={`block h-2.5 w-2.5 rounded-full ${dotColor(item.notificationType)}`} /> : <div className="h-2.5 w-2.5" />}
                        </div>
                        <div>
                          <h3 className={`text-sm font-bold ${!item.read ? "text-slate-800" : "text-slate-600"}`}>{item.title}</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-medium">{item.body}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs font-medium text-slate-400">{relativeTime(item.createdAt)}</span>
                        <span
                          role="button"
                          tabIndex={0}
                          aria-label="Delete notification"
                          onClick={(event) => handleDelete(item.id, event)}
                          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") handleDelete(item.id, event as unknown as React.MouseEvent); }}
                          className="rounded-full p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-new-red group-hover:opacity-100"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
