"use client";
import React, { useState } from 'react';
import {
  CheckCheck,
  Calendar,
  CreditCard,
  Wrench,
  Info,
  RotateCw,
  Sliders,
  Check
} from 'lucide-react';

// --- MOCK NOTIFICATIONS DATA ---
const initialNotifications = [
  {
    id: 1,
    category: 'Booking Requests',
    title: 'New Booking Request',
    description: (
      <span>
        <strong className="font-bold text-slate-900">Sarah Jenkins</strong> requested to rent your <strong className="font-bold text-slate-900">DSLR Rig & Cinema Lens Kit</strong> for 4 days.
      </span>
    ),
    time: '2 mins ago',
    timestamp: 'NEWEST',
    isUnread: true,
    icon: Calendar,
    iconBg: 'bg-blue-50 text-blue-600',
    actions: [
      { label: 'Review Request', primary: true },
      { label: 'Dismiss', primary: false },
    ],
  },
  {
    id: 2,
    category: 'Payments',
    title: 'Payout Confirmed',
    description: (
      <span>
        Funds totaling <strong className="font-bold text-emerald-600">$1,240.00</strong> have been successfully transferred to your linked bank account.
      </span>
    ),
    time: '1 hour ago',
    timestamp: 'NEWEST',
    isUnread: true,
    icon: CreditCard,
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 3,
    category: 'Maintenance',
    title: 'Maintenance Alert',
    description: (
      <span>
        Routine sensor calibration is due for <strong className="font-bold text-slate-900">Asset #RT-992 (Industrial Drone)</strong> to maintain warranty compliance.
      </span>
    ),
    time: 'Yesterday, 4:12 PM',
    timestamp: 'YESTERDAY',
    isUnread: false,
    icon: Wrench,
    iconBg: 'bg-rose-50 text-rose-500',
    linkAction: 'Schedule Now ›',
  },
  {
    id: 4,
    category: 'System',
    title: 'System Update',
    description: (
      <span>
        We ve updated our <a href="#terms" className="underline font-semibold text-slate-700 hover:text-slate-900">Terms of Service</a> regarding cross-border rental insurance policies.
      </span>
    ),
    time: 'Yesterday, 9:30 AM',
    timestamp: 'YESTERDAY',
    isUnread: false,
    icon: Info,
    iconBg: 'bg-slate-100 text-slate-600',
  },
];

const categories = [
  'All',
  'Booking Requests',
  'Payments',
  'Maintenance',
  'System',
];

export default function NotificationsCenter() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [notifications, setNotifications] = useState(initialNotifications);

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  // Group notifications by section (NEWEST vs YESTERDAY)
  const newestGroup = filteredNotifications.filter((n) => n.timestamp === 'NEWEST');
  const yesterdayGroup = filteredNotifications.filter((n) => n.timestamp === 'YESTERDAY');

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false }))
    );
  };

  return (
    <div className="min-h-screen bg-[#f3edea] relative">
      {/* EXACT WRAPPER CLASS */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 space-y-6 text-slate-800 pb-28">
        
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Notifications Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage and review all your property interactions.
            </p>
          </div>

          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#ff3b30] text-white shadow-sm'
                    : 'bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* NOTIFICATIONS CONTAINER */}
        <div className="space-y-6 pt-2">
          
          {/* NEWEST SECTION */}
          {newestGroup.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
                Newest
              </h2>
              <div className="space-y-3">
                {newestGroup.map((item) => (
                  <NotificationCard key={item.id} notification={item} />
                ))}
              </div>
            </div>
          )}

          {/* YESTERDAY SECTION */}
          {yesterdayGroup.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
                Yesterday
              </h2>
              <div className="space-y-3">
                {yesterdayGroup.map((item) => (
                  <NotificationCard key={item.id} notification={item} />
                ))}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredNotifications.length === 0 && (
            <div className="bg-white/80 backdrop-blur rounded-2xl p-12 text-center border border-white/60 shadow-sm space-y-2">
              <p className="font-bold text-slate-800 text-sm">No notifications found</p>
              <p className="text-xs text-slate-500">There are no notifications in the selected category.</p>
            </div>
          )}

          {/* LOAD PREVIOUS NOTIFICATIONS BUTTON */}
          <div className="pt-4 flex justify-center">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white shadow-sm transition-colors">
              <RotateCw className="w-3.5 h-3.5 text-slate-500" />
              Load previous notifications
            </button>
          </div>

        </div>

      </div>

      {/* FLOATING QUICK STATS WIDGET (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-white shadow-lg space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Stats</span>
            <Sliders className="w-3 h-3 text-slate-400 cursor-pointer" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-100/50">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase">Unread</p>
              <p className="text-lg font-black text-rose-500 leading-tight mt-0.5">12</p>
            </div>

            <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/50">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase">Pending</p>
              <p className="text-lg font-black text-blue-500 leading-tight mt-0.5">04</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// --- SUB-COMPONENT FOR SINGLE NOTIFICATION CARD ---
function NotificationCard({ notification, }: { notification: typeof initialNotifications[0] }) {
  const IconComponent = notification.icon;

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-4 sm:p-5 border border-white shadow-sm flex items-start gap-4 transition-all hover:shadow-md">
      
      {/* Category Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.iconBg}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-sm">{notification.title}</h3>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">{notification.time}</span>
            {notification.isUnread && (
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {notification.description}
        </p>

        {/* Optional Action Link (e.g. Schedule Now >) */}
        {notification.linkAction && (
          <div className="pt-1">
            <a href="#action" className="text-xs font-bold text-blue-600 hover:underline inline-block">
              {notification.linkAction}
            </a>
          </div>
        )}

        {/* Optional Action Buttons (e.g. Review Request / Dismiss) */}
        {notification.actions && (
          <div className="flex items-center gap-2 pt-2">
            {notification.actions.map((act, idx) => (
              <button
                key={idx}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  act.primary
                    ? 'bg-[#ff3b30] hover:bg-[#e03126] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}