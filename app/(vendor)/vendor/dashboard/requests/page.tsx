"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "leaflet/dist/leaflet.css";
import {
  faList,
  faMapLocationDot,
  faCar,
  faCamera,
  faMotorcycle,
  faWrench,
  faCheckCircle,
  faArrowDownWideShort,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

// Dynamically import Leaflet components to prevent SSR errors in Next.js
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

// ---------------- CATEGORIES ----------------
const CATEGORIES = [
  { id: "all", label: "All", icon: null },
  { id: "cars", label: "Cars", icon: faCar },
  { id: "electronics", label: "Electronics", icon: faCamera },
  { id: "motorbikes", label: "Motorbikes", icon: faMotorcycle },
  { id: "tools", label: "Tools", icon: faWrench },
];

// ---------------- ALL REQUESTS (PHNOM PENH DATA) ----------------
const PHNOM_PENH_REQUESTS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    locationName: "Tuol Kouk, Phnom Penh",
    distance: "2.4 miles away",
    statusBadge: "LIVE",
    badgeColor: "bg-red-500 text-white",
    category: "cars",
    lookingFor: "Tesla Model 3",
    note: '"Need a clean EV for a weekend trip to Siem Reap. Reliable driver with 5-star rating..."',
    duration: "3 Days (July 15 - 18)",
    budget: "$85",
    rating: "4.9",
    rentals: "8 rentals",
    lat: 11.5682,
    lng: 104.8921,
  },
  {
    id: 2,
    name: "David Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    locationName: "Chroy Changvar, Phnom Penh",
    distance: "0.8 miles away",
    statusBadge: "NEW",
    badgeColor: "bg-blue-100 text-blue-600",
    category: "electronics",
    lookingFor: "Sony A7IV",
    note: '"Filming a small wedding this Saturday near the Mekong. Need the body + a 35mm lens if possible."',
    duration: "1 Day (July 12)",
    budget: "$120",
    rating: "5.0",
    rentals: "15 rentals",
    lat: 11.5891,
    lng: 104.9352,
  },
  {
    id: 3,
    name: "Sokha Mean",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    locationName: "Boeung Keng Kang 1 (BKK1)",
    distance: "1.2 miles away",
    statusBadge: "LIVE",
    badgeColor: "bg-red-500 text-white",
    category: "motorbikes",
    lookingFor: "Honda Dream 125",
    note: '"Need a reliable motorbike for daily commuting around Chamkarmon area."',
    duration: "3 Days",
    budget: "$35",
    rating: "4.8",
    rentals: "12 rentals",
    lat: 11.5489,
    lng: 104.9282,
  },
  {
    id: 4,
    name: "Vannak Chan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    locationName: "Daun Penh, Phnom Penh",
    distance: "3.5 miles away",
    statusBadge: "NEW",
    badgeColor: "bg-blue-100 text-blue-600",
    category: "electronics",
    lookingFor: "Sony A7IV",
    note: '"Filming project near Wat Phnom. Need extra camera body for 24 hours."',
    duration: "24 Hours",
    budget: "$45",
    rating: "5.0",
    rentals: "4 rentals",
    lat: 11.5762,
    lng: 104.9231,
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    locationName: "Chamkarmon, Phnom Penh",
    distance: "4.1 miles away",
    statusBadge: "LIVE",
    badgeColor: "bg-red-500 text-white",
    category: "tools",
    lookingFor: "Heavy Duty Drill",
    note: '"DIY project at home. Need something powerful for concrete walls."',
    duration: "2 Days (July 14 - 15)",
    budget: "$35",
    rating: "4.7",
    rentals: "6 rentals",
    lat: 11.5392,
    lng: 104.9211,
  },
];

export default function NearbyRequestsPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [requests, setRequests] = useState(PHNOM_PENH_REQUESTS);
  const [activeMapItem, setActiveMapItem] = useState<number | null>(3);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Custom Price Pin Marker Icon (Safely created on Client-Side)
  const createCustomIcon = (price: string, isActive: boolean) => {
    if (!isClient) return undefined;
    const L = require("leaflet");
    return L.divIcon({
      className: "custom-map-pin",
      html: `
        <div style="
          background-color: ${isActive ? "#ff3b30" : "#ffffff"};
          color: ${isActive ? "#ffffff" : "#0f172a"};
          font-weight: 800;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          border: 1px solid ${isActive ? "#ff3b30" : "#cbd5e1"};
          text-align: center;
          white-space: nowrap;
          transition: all 0.2s ease;
        ">
          ${price}/day
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });
  };

  const filteredRequests = requests.filter((req) =>
    selectedCategory === "all" ? true : req.category === selectedCategory
  );

  const handleSendOffer = (name: string) => {
    alert(`Offer form opened for ${name}`);
  };

  const handleIgnore = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 space-y-6 text-slate-800">
      
      {/* ---------------- 1. PAGE HEADER & TOGGLE ---------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Nearby Requests</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Connect with renters looking for items in Phnom Penh, Cambodia.
          </p>
        </div>

        {/* List / Map Switcher */}
        <div className="flex items-center rounded-xl bg-slate-200/60 p-1 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FontAwesomeIcon icon={faList} className="h-3.5 w-3.5" />
            List
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition ${
              viewMode === "map"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FontAwesomeIcon icon={faMapLocationDot} className="h-3.5 w-3.5" />
            Map
          </button>
        </div>
      </div>

      {/* ---------------- 2. CATEGORY FILTERS & SORT ---------------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? "bg-[#ff3b30] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat.icon && <FontAwesomeIcon icon={cat.icon} className="h-3 w-3" />}
              {cat.label}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 self-end sm:self-auto">
          <FontAwesomeIcon icon={faArrowDownWideShort} className="h-3.5 w-3.5 text-slate-400" />
          <span>Sort by: <strong className="text-slate-900">Newest First</strong></span>
        </button>
      </div>

      {/* ---------------- 3. VIEW MODE CONTENT ---------------- */}
      {viewMode === "list" ? (
        
        /* ================= LIST VIEW ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.avatar}
                        alt={req.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-extrabold text-slate-900 truncate">{req.name}</h3>
                          <FontAwesomeIcon icon={faCheckCircle} className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{req.locationName}</p>
                      </div>
                    </div>

                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase shrink-0 ${req.badgeColor}`}>
                      {req.statusBadge}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-bold text-[#ff3b30]">
                      Looking for: {req.lookingFor}
                    </p>
                    <p className="mt-1.5 text-[11px] italic text-slate-500 leading-relaxed line-clamp-3">
                      {req.note}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Duration</p>
                      <p className="font-bold text-slate-800">{req.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Budget</p>
                      <p className="text-sm font-extrabold text-[#ff3b30]">
                        {req.budget}<span className="text-[10px] font-semibold text-slate-400">/day</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={() => handleSendOffer(req.name)}
                    className="flex-1 rounded-xl bg-[#ff3b30] py-2.5 text-xs font-bold text-white transition hover:bg-red-600 active:scale-95"
                  >
                    Send Offer
                  </button>
                  <button
                    onClick={() => handleIgnore(req.id)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 active:scale-95"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button className="flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-white px-6 py-2.5 text-xs font-bold text-blue-600 shadow-sm transition hover:bg-blue-50/50">
              <span>Load More Nearby Requests</span>
              <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
            </button>
          </div>
        </div>

      ) : (

        /* ================= MAP VIEW ================= */
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-5 min-h-[550px]">
          
          {/* Requests Sidebar */}
          <div className="space-y-3 lg:col-span-4 max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Nearby Requests</h3>
                <p className="text-[10px] text-slate-400">Available requests in Phnom Penh</p>
              </div>
              <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600">
                {filteredRequests.length} ACTIVE
              </span>
            </div>

            {filteredRequests.map((req) => {
              const isActive = activeMapItem === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setActiveMapItem(req.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    isActive
                      ? "border-red-500 bg-red-50/20 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={req.avatar} alt={req.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{req.name}</h4>
                        <p className="text-[10px] text-slate-400">
                          ★ {req.rating} · {req.rentals}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Equipment</span>
                      <span className="font-bold text-slate-800">{req.lookingFor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration</span>
                      <span className="font-semibold text-slate-700">{req.duration}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-sm font-extrabold text-[#ff3b30]">{req.budget}<span className="text-[10px] font-normal text-slate-400">/day</span></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendOffer(req.name);
                      }}
                      className="rounded-lg bg-[#ff3b30] px-4 py-1.5 text-xs font-bold text-white hover:bg-red-600 active:scale-95"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leaflet Map Area */}
          <div className="relative min-h-[350px] sm:min-h-[450px] lg:min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 lg:col-span-8 shadow-sm">
            {isClient && (
              <MapContainer
                center={[11.5564, 104.9282]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full min-h-[350px] sm:min-h-[450px] lg:min-h-[600px]"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredRequests.map((req) => (
                  <Marker
                    key={req.id}
                    position={[req.lat, req.lng]}
                    icon={createCustomIcon(req.budget, activeMapItem === req.id)}
                    eventHandlers={{
                      click: () => setActiveMapItem(req.id),
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 p-1">
                        <p className="font-bold text-slate-900">{req.name}</p>
                        <p className="text-slate-500">{req.lookingFor}</p>
                        <p className="text-[11px] text-slate-400">{req.locationName}</p>
                        <p className="font-bold text-[#ff3b30]">{req.budget}/day</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

        </div>
      )}

    </div>
  );
}