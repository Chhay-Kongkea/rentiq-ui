"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  type: "overdue" | "approved" | "info";
}

interface GroupedNotifications {
  section: string;
  items: Notification[];
}

const INITIAL_NOTIFICATIONS: GroupedNotifications[] = [
  {
    section: "TODAY",
    items: [
      {
        id: 1,
        title: "Rental Return Overdue",
        description:
          "ការប្រគល់មកវិញនៃឧបករណ៍ DJI Mavic 3 Pro របស់អ្នកត្រូវបានហួសពេលកំណត់។ សូមប្រគល់មកវិញជាបន្ទាន់ដើម្បីជៀសវាងពិន័យ។",
        time: "2h",
        isUnread: true,
        type: "overdue",
      },
      {
        id: 2,
        title: "Booking Request Approved",
        description:
          "សំណើកក់ Sony A7 IV របស់អ្នកត្រូវបានយល់ព្រមដោយម្ចាស់ឧបករណ៍។ អ្នកអាចទៅយកវានៅថ្ងៃស្អែក។",
        time: "5h",
        isUnread: true,
        type: "approved",
      },
    ],
  },
  {
    section: "YESTERDAY",
    items: [
      {
        id: 3,
        title: "Security Deposit Released",
        description:
          "កាបបង្វិលប្រាក់កក់ $150.00 របស់អ្នកត្រូវបានធ្វើការផ្ទេរត្រឡប់មកវិញដោយជោគជ័យ បន្ទាប់ពីការពិនិត្យឧបករណ៍។",
        time: "Yesterday",
        isUnread: false,
        type: "info",
      },
    ],
  },
  {
    section: "OLDER",
    items: [
      {
        id: 4,
        title: "Upcoming Rental Reminder",
        description:
          "សូមកុំភ្លេចការកក់ទុក DJI RS 3 Pro របស់អ្នកដែលនឹងចាប់ផ្តើមនៅថ្ងៃស្អែកនេះ។",
        time: "2d ago",
        isUnread: false,
        type: "info",
      },
    ],
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<GroupedNotifications[]>(
    INITIAL_NOTIFICATIONS
  );

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) => ({ ...item, isUnread: false })),
      }))
    );
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-new-blue">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              View rental history and status.
            </p>
          </div>

          {/* Mark All as Read Button */}
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold text-new-red shadow-xs transition hover:bg-red-50 focus:outline-none"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="h-3 w-3" />
            Mark all as read
          </button>
        </div>

        {/* Grouped Notifications List */}
        <div className="space-y-8">
          {notifications.map((group) => (
            <section key={group.section}>
              {/* Section Header */}
              <h2 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                {group.section}
              </h2>

              {/* Section Card Wrapper */}
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                {group.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex items-start justify-between p-5 transition ${
                      index !== group.items.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    } ${item.isUnread ? "bg-slate-50/50" : "bg-white"}`}
                  >
                    <div className="flex items-start gap-3.5 pr-4">
                      {/* Unread Status Dot */}
                      <div className="pt-1 shrink-0">
                        {item.isUnread ? (
                          <span
                            className={`block h-2.5 w-2.5 rounded-full ${
                              item.type === "overdue"
                                ? "bg-new-red"
                                : "bg-new-blue"
                            }`}
                          />
                        ) : (
                          <div className="h-2.5 w-2.5" />
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h3
                          className={`text-sm font-bold ${
                            item.isUnread ? "text-slate-800" : "text-slate-600"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-medium">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Time Badge */}
                    <span className="shrink-0 text-xs font-medium text-slate-400">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}