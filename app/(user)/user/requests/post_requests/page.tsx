"use client";

import { Suspense, useState } from "react";
import { useGetCategoriesQuery } from "@/redux/services/categoryApi";
import { useCreateItemRequestMutation, useGetItemRequestQuery } from "@/redux/services/userApi";
import { useUpdateItemRequestMutation } from "@/redux/services/renterApi";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Tag,
  RefreshCcw,
  Globe,
  Menu,
  Search,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Share2,
  Camera,
  Music2,
  PlayCircle,
  AlertCircle,
} from "lucide-react";

const CambodiaMapPicker = dynamic(
  () => import("@/components/cambodia-map-picker"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 grid h-72 place-items-center rounded-xl bg-[#EEF2FC] text-sm text-gray-500 sm:h-80">
        Loading Cambodia map...
      </div>
    ),
  },
);

const CATEGORIES = [
  "Cameras & Drones",
  "Tools & Equipment",
  "Vehicles",
  "Electronics",
  "Party & Events",
  "Sports & Outdoors",
];

type FieldKey =
  | "category"
  | "itemName"
  | "description"
  | "minBudget"
  | "maxBudget"
  | "startDate"
  | "endDate"
  | "location";

type FormErrors = Partial<Record<FieldKey, string>>;

function apiMessage(error: unknown) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data.trim()) return data;
    if (typeof data === "object" && data) {
      const response = data as { message?: string; error?: string; details?: string };
      return response.message || response.error || response.details || "Unable to post your request. Please check the form and try again.";
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return "Unable to post your request. Please try again.";
}

export default function PostRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F4F7]" />}>
      <PostRequestPageGate />
    </Suspense>
  );
}

function PostRequestPageGate() {
  const searchParams = useSearchParams();
  const editRequestId = searchParams.get("mode") === "edit" ? searchParams.get("requestId") : null;
  const { data: existingRequest, isLoading } = useGetItemRequestQuery(editRequestId ?? "", { skip: !editRequestId });

  if (editRequestId && isLoading) {
    return <div className="min-h-screen bg-[#F2F4F7]" />;
  }

  return <PostRequestPageContent key={existingRequest?.id ?? editRequestId ?? "new"} editRequestId={editRequestId} existingRequest={existingRequest} />;
}

function PostRequestPageContent({ editRequestId, existingRequest }: { editRequestId: string | null; existingRequest?: { categoryId?: string; title?: string; description?: string; budgetMin?: number; budgetMax?: number; neededFrom?: string; neededTo?: string; latitude?: number; longitude?: number; location?: string } }) {
  const router = useRouter();
  const isEditMode = Boolean(editRequestId);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createItemRequest] = useCreateItemRequestMutation();
  const [updateItemRequest] = useUpdateItemRequestMutation();

  const [category, setCategory] = useState(existingRequest?.categoryId ?? "");
  const [itemName, setItemName] = useState(existingRequest?.title ?? "");
  const [description, setDescription] = useState(existingRequest?.description ?? "");
  const [minBudget, setMinBudget] = useState(existingRequest?.budgetMin != null ? String(existingRequest.budgetMin) : "");
  const [maxBudget, setMaxBudget] = useState(existingRequest?.budgetMax != null ? String(existingRequest.budgetMax) : "");
  const [startDate, setStartDate] = useState(existingRequest?.neededFrom ?? "");
  const [endDate, setEndDate] = useState(existingRequest?.neededTo ?? "");
  const [location, setLocation] = useState(
    existingRequest?.latitude != null && existingRequest?.longitude != null
      ? existingRequest.location || `Pinned location (${existingRequest.latitude.toFixed(5)}, ${existingRequest.longitude.toFixed(5)}), Cambodia`
      : "",
  );
  const [pickupCoordinates, setPickupCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(
    existingRequest?.latitude != null && existingRequest?.longitude != null
      ? { lat: existingRequest.latitude, lng: existingRequest.longitude }
      : null,
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (!category) next.category = "Please select a category.";

    if (!itemName.trim()) next.itemName = "Tell us what you're looking for.";
    else if (itemName.trim().length < 3)
      next.itemName = "Item name should be at least 3 characters.";

    if (!description.trim())
      next.description = "A short description helps owners respond faster.";
    else if (description.trim().length < 20)
      next.description = "Please add at least 20 characters of detail.";

    const min = Number(minBudget);
    const max = Number(maxBudget);
    if (!minBudget) next.minBudget = "Enter a minimum budget.";
    else if (Number.isNaN(min) || min <= 0)
      next.minBudget = "Minimum budget must be a positive number.";

    if (!maxBudget) next.maxBudget = "Enter a maximum budget.";
    else if (Number.isNaN(max) || max <= 0)
      next.maxBudget = "Maximum budget must be a positive number.";

    if (
      !next.minBudget &&
      !next.maxBudget &&
      min > max
    ) {
      next.maxBudget = "Max budget must be greater than or equal to min.";
    }

    if (!startDate) next.startDate = "Choose a start date.";
    if (!endDate) next.endDate = "Choose an end date.";

    if (startDate && endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start < today) next.startDate = "Start date can't be in the past.";
      if (end < start)
        next.endDate = "End date must be on or after the start date.";
    }

    if (!pickupCoordinates) next.location = "Pin the pickup location on the map.";
    if (!location.trim())
      next.location = "Add a neighborhood or city for pickup.";

    return next;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus/scroll to the first invalid field.
      const firstErrorKey = Object.keys(validationErrors)[0];
      document
        .querySelector(`[data-field="${firstErrorKey}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      if (!pickupCoordinates) return;
      const payload = { categoryId: category, title: itemName.trim(), description: description.trim(), budgetMin: Number(minBudget), budgetMax: Number(maxBudget), neededFrom: startDate, neededTo: endDate, latitude: pickupCoordinates.lat, longitude: pickupCoordinates.lng, radiusKm: 10 };
      if (isEditMode && editRequestId) {
        await updateItemRequest({ id: editRequestId, body: payload }).unwrap();
        router.push(`/user/requests/requests_detail?requestId=${editRequestId}`);
      } else {
        const createdRequest = await createItemRequest(payload).unwrap();
        router.push(`/user/requests/requests_submit?requestId=${createdRequest.id}`);
      }
    } catch (error) {
      setSubmitError(apiMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#1A2340]">

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-14 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-[#1A2E6B]">{isEditMode ? "Edit your " : "Post a "}</span>
          <span className="text-[#E8402C]">Request</span>
        </h1>
        <p className="mt-4 text-sm text-gray-500 sm:text-base">
          Can&apos;t find what you need? Let the community know and get offers
          from lenders.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 rounded-2xl bg-white p-8 text-left shadow-[0_4px_24px_rgba(20,30,60,0.06)] sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Item Category" error={errors.category}>
              <select
                data-field="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category)
                    setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={fieldClass(!!errors.category, "appearance-none")}
              >
                <option value="">Select a category</option>
                {categories.filter((c) => c.active).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="I am looking for..." error={errors.itemName}>
              <input
                data-field="itemName"
                type="text"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  if (errors.itemName)
                    setErrors((prev) => ({ ...prev, itemName: undefined }));
                }}
                placeholder="e.g. Professional Camera Drone"
                className={fieldClass(!!errors.itemName)}
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field
              label="What do you need? (Description)"
              error={errors.description}
            >
              <textarea
                data-field="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: undefined }));
                }}
                placeholder="Describe the item, specific features you need, or how you plan to use it..."
                rows={4}
                className={fieldClass(!!errors.description, "resize-none")}
              />
            </Field>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field
              label="Budget Range (Per Day)"
              error={errors.minBudget || errors.maxBudget}
            >
              <div className="flex items-center gap-3">
                <div
                  data-field="minBudget"
                  className={fieldWrapperClass(!!errors.minBudget)}
                >
                  <span className="text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => {
                      setMinBudget(e.target.value);
                      if (errors.minBudget || errors.maxBudget)
                        setErrors((prev) => ({
                          ...prev,
                          minBudget: undefined,
                          maxBudget: undefined,
                        }));
                    }}
                    placeholder="Min"
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </div>
                <span className="text-sm text-gray-400">to</span>
                <div
                  data-field="maxBudget"
                  className={fieldWrapperClass(!!errors.maxBudget)}
                >
                  <span className="text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => {
                      setMaxBudget(e.target.value);
                      if (errors.minBudget || errors.maxBudget)
                        setErrors((prev) => ({
                          ...prev,
                          minBudget: undefined,
                          maxBudget: undefined,
                        }));
                    }}
                    placeholder="Max"
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>
            </Field>

            <Field
              label="Rental Period"
              error={errors.startDate || errors.endDate}
            >
              <div className="flex items-center gap-2">
                <div
                  data-field="startDate"
                  className={fieldWrapperClass(!!errors.startDate, "flex-1")}
                >
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate || errors.endDate)
                        setErrors((prev) => ({
                          ...prev,
                          startDate: undefined,
                          endDate: undefined,
                        }));
                    }}
                    className="w-full bg-transparent text-sm text-gray-700 outline-none [color-scheme:light]"
                  />
                </div>
                <span className="text-sm text-gray-400">-</span>
                <div
                  data-field="endDate"
                  className={fieldWrapperClass(!!errors.endDate, "flex-1")}
                >
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (errors.startDate || errors.endDate)
                        setErrors((prev) => ({
                          ...prev,
                          startDate: undefined,
                          endDate: undefined,
                        }));
                    }}
                    className="w-full bg-transparent text-sm text-gray-700 outline-none [color-scheme:light]"
                  />
                </div>
              </div>
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Pickup Location" error={errors.location}>
              <div
                data-field="location"
                className={fieldWrapperClass(!!errors.location)}
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#E8402C]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location)
                      setErrors((prev) => ({ ...prev, location: undefined }));
                  }}
                  placeholder="Search for a neighborhood or city..."
                  className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                />
              </div>
            </Field>
          </div>

          <CambodiaMapPicker
            position={pickupCoordinates}
            onSelect={(position) => {
              setPickupCoordinates(position);
              setLocation(
                `Pinned location (${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}), Cambodia`,
              );
              if (errors.location) {
                setErrors((previous) => ({
                  ...previous,
                  location: undefined,
                }));
              }
            }}
          />

          <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
            <p className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Your request is protected by our Trust &amp; Safety policy.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl cursor-pointer bg-[#E8402C] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#d6371f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : isEditMode ? "Save Changes" : "Submit Request"}
            </button>
          </div>
          {submitError ? (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {submitError}
            </p>
          ) : null}
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#E8402C]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </span>
      )}
    </label>
  );
}

function fieldClass(hasError: boolean, extra = "") {
  return [
    "w-full rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none",
    hasError
      ? "bg-[#FDECEA] ring-1 ring-[#E8402C] focus:bg-[#FDECEA]"
      : "bg-[#EEF2FC] focus:bg-[#E6ECFA]",
    extra,
  ].join(" ");
}

function fieldWrapperClass(hasError: boolean, extra = "") {
  return [
    "flex items-center gap-1 rounded-xl px-4 py-3",
    hasError ? "bg-[#FDECEA] ring-1 ring-[#E8402C]" : "bg-[#EEF2FC]",
    extra,
  ].join(" ");
}

function SiteHeader() {
  const navItems = [
    { label: "Homes", icon: Home },
    { label: "Deals", icon: Tag },
    { label: "Request", icon: RefreshCcw },
  ];

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8402C] text-lg font-bold text-white">
          R
        </span>
        <span className="text-xl font-bold text-[#E8402C]">Rentiq</span>
      </Link>

      <nav className="hidden items-center gap-10 md:flex">
        {navItems.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href="#"
            className="flex items-center gap-2 text-gray-700 hover:text-[#1A2340]"
          >
            <Icon className="h-5 w-5 text-[#E8402C]" />
            <span className="text-base">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Language"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Globe className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function SearchBar() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-8">
      <div className="flex flex-col items-stretch divide-y divide-gray-200 rounded-3xl border border-gray-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:divide-x sm:divide-y-0">
        <div className="flex-1 px-6 py-2">
          <p className="text-sm font-semibold">Categories</p>
          <p className="text-sm text-gray-400">Many choices for you</p>
        </div>
        <div className="flex-1 px-6 py-2">
          <p className="text-sm font-semibold">Where</p>
          <p className="text-sm text-gray-400">Search destinations</p>
        </div>
        <div className="flex flex-1 items-center justify-between px-6 py-2">
          <div>
            <p className="text-sm font-semibold">When</p>
            <p className="text-sm text-gray-400">Add dates</p>
          </div>
          <button
            type="button"
            aria-label="Search"
            className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8402C] text-white hover:bg-[#d6371f]"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SiteFooter() {
  const columns = [
    {
      title: "Product",
      links: ["Categories", "Pricing", "For Vendors", "Features"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "FAQs", "Safety Tips"],
    },
    {
      title: "Legal",
      links: [
        "Privacy Policy",
        "Terms of Service",
        "Cookie Policy",
        "Community Guidelines",
      ],
    },
  ];

  const socials = [MessageCircle, Share2, Camera, Music2, PlayCircle];

  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-14 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8402C] text-lg font-bold text-white">
              R
            </span>
            <span className="text-xl font-bold text-[#E8402C]">Rentiq</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-gray-500">
            Cambodia&apos;s trusted marketplace for renting anything,
            anywhere.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((Icon, i) => (
              <span
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-[#1A2340]">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-gray-500 hover:text-[#E8402C]"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="rounded-xl border border-gray-100 p-4 sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-semibold text-[#1A2340]">
            Download the App
          </p>
          <p className="mt-1 text-xs text-gray-500">Rent on the go, anytime.</p>
          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-black px-3 py-2 text-center text-xs text-white">
              Get it on Google Play
            </div>
            <div className="rounded-lg bg-black px-3 py-2 text-center text-xs text-white">
              Download on the App Store
            </div>
          </div>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-gray-400">
        © 2026 RentalHub. All rights reserved.
      </p>
    </footer>
  );
}
