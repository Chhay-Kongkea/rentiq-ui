"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useGetCategoriesQuery, useGetCategoryQuery } from "@/redux/services/categoryApi";
import { useGetMyAddressesQuery } from "@/redux/services/userApi";
import { geocodeAddress } from "@/lib/geocoding";
import type { VendorItem } from "@/lib/types/vendor.types";
import {
  useCreateVendorItemAvailabilityBlockMutation,
  useCreateVendorItemMutation,
  useDeleteVendorItemAvailabilityBlockMutation,
  useDeleteVendorItemImageMutation,
  useDeleteVendorItemMutation,
  useGetMyVendorItemsQuery,
  useGetVendorItemAvailabilityBlocksQuery,
  useGetVendorItemImagesQuery,
  useUpdateVendorItemAvailabilityMutation,
  useUpdateVendorItemImageMutation,
  useUpdateVendorItemMutation,
  useUpdateVendorItemStatusMutation,
  useUploadVendorItemImagesMutation,
} from "@/redux/services/vendorApi";

function apiMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return fallback;
}

function money(value?: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);
}

export default function VendorListingsPage() {
  const [editing, setEditing] = useState<VendorItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [manageItem, setManageItem] = useState<VendorItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: selectedCategory, isLoading: specificationFieldsLoading } = useGetCategoryQuery(selectedCategoryId, { skip: !selectedCategoryId });
  const { data: addresses = [], isLoading: addressesLoading } = useGetMyAddressesQuery();
  const vendorLocation = addresses.find((address) => address.isDefault) ?? addresses[0];
  const { data: itemPage, isLoading } = useGetMyVendorItemsQuery({ pageSize: 100 });
  const items = itemPage?.content ?? [];

  const [createItem, createState] = useCreateVendorItemMutation();
  const [updateItem, updateState] = useUpdateVendorItemMutation();
  const [deleteItem, deleteState] = useDeleteVendorItemMutation();
  const [updateStatus, statusState] = useUpdateVendorItemStatusMutation();
  const [updateAvailability, availabilityState] = useUpdateVendorItemAvailabilityMutation();

  const manageId = manageItem?.id ?? "";
  const { data: images = [], isLoading: imagesLoading } = useGetVendorItemImagesQuery(manageId, { skip: !manageItem });
  const { data: blocks = [], isLoading: blocksLoading } = useGetVendorItemAvailabilityBlocksQuery(manageId, { skip: !manageItem });
  const [uploadImages, uploadState] = useUploadVendorItemImagesMutation();
  const [updateImage, updateImageState] = useUpdateVendorItemImageMutation();
  const [deleteImage, deleteImageState] = useDeleteVendorItemImageMutation();
  const [createBlock, createBlockState] = useCreateVendorItemAvailabilityBlockMutation();
  const [deleteBlock, deleteBlockState] = useDeleteVendorItemAvailabilityBlockMutation();

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  async function resolveVendorLocation() {
    if (!vendorLocation || (Number.isFinite(vendorLocation.latitude) && Number.isFinite(vendorLocation.longitude))) return;

    const address = [vendorLocation.addressLine, vendorLocation.city, vendorLocation.country || "Cambodia"]
      .filter(Boolean)
      .join(", ");
    setLocationLoading(true);
    try {
      const coordinates = await geocodeAddress(address);
      if (coordinates) {
        setCurrentCoordinates(coordinates);
        return;
      }

      if (navigator.geolocation) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              setCurrentCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
              resolve();
            },
            () => resolve(),
            { enableHighAccuracy: true, timeout: 10000 },
          );
        });
      }
    } catch {
      // The form validation below will show a clear message if no coordinates were resolved.
    } finally {
      setLocationLoading(false);
    }
  }

  function openCreate() {
    resetMessages();
    setEditing(null);
    setSelectedCategoryId("");
    void resolveVendorLocation();
    setShowForm(true);
  }

  function openEdit(item: VendorItem) {
    resetMessages();
    setEditing(item);
    setSelectedCategoryId(item.categoryId || "");
    setShowForm(true);
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();
    const form = new FormData(event.currentTarget);
    const categoryId = String(form.get("categoryId") || "").trim();
    const pricePerDay = Number(form.get("pricePerDay"));
    const depositAmountRaw = String(form.get("depositAmount") || "").trim();
    const latitude = editing ? Number(form.get("latitude")) : (vendorLocation?.latitude ?? currentCoordinates?.latitude ?? NaN);
    const longitude = editing ? Number(form.get("longitude")) : (vendorLocation?.longitude ?? currentCoordinates?.longitude ?? NaN);
    const specifications: Record<string, unknown> = {};
    for (const field of selectedCategory?.specificationFields ?? []) {
      const rawValue = String(form.get(`specification.${field.key}`) || "").trim();
      if (!rawValue) continue;
      if (field.type.toUpperCase() === "NUMBER") specifications[field.key] = Number(rawValue);
      else if (field.type.toUpperCase() === "BOOLEAN") specifications[field.key] = rawValue === "true";
      else specifications[field.key] = rawValue;
    }
    if (!selectedCategory && selectedCategoryId) {
      setError("Loading the selected category specifications. Please try again.");
      return;
    }

    const locationText = editing
      ? String(form.get("locationText") || "").trim()
      : [vendorLocation?.addressLine, vendorLocation?.city, vendorLocation?.country].filter(Boolean).join(", ");

    if (!categoryId || !Number.isFinite(pricePerDay) || pricePerDay <= 0 || !locationText || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setError(editing ? "Category, daily price, and a valid location are required." : "Add a default address with coordinates before creating a listing.");
      return;
    }

    const body = {
      categoryId,
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim() || undefined,
      condition: String(form.get("condition") || "GOOD") as "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR",
      specifications,
      locationText,
      latitude,
      longitude,
      pricePerDay,
      depositAmount: depositAmountRaw ? Number(depositAmountRaw) : undefined,
    };

    try {
      if (editing) {
        await updateItem({ itemId: editing.id, body }).unwrap();
        setSuccess("Listing updated successfully.");
      } else {
        const created = await createItem(body).unwrap();
        setSuccess("Listing created. You can now upload images and manage availability.");
        setManageItem(created);
      }
      setShowForm(false);
      setEditing(null);
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to save listing."));
    }
  }

  async function handleDelete(item: VendorItem) {
    if (!window.confirm(`Delete “${item.title || "this listing"}”?`)) return;
    resetMessages();
    try {
      await deleteItem(item.id).unwrap();
      if (manageItem?.id === item.id) setManageItem(null);
      setSuccess("Listing deleted.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to delete listing."));
    }
  }

  async function toggleStatus(item: VendorItem) {
    resetMessages();
    const next = item.status === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    try {
      await updateStatus({ itemId: item.id, body: { status: next } }).unwrap();
      setSuccess(`Listing status changed to ${next}.`);
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to update listing status."));
    }
  }

  async function setAvailability(itemId: string, availability: "AVAILABLE" | "UNAVAILABLE" | "HIDDEN") {
    resetMessages();
    try {
      await updateAvailability({ itemId, body: { availability } }).unwrap();
      setSuccess(`Availability updated to ${availability}.`);
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to update availability."));
    }
  }

  async function handleImageUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manageItem) return;
    resetMessages();
    const form = new FormData(event.currentTarget);
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    if (!files.length) {
      setError("Choose at least one image.");
      return;
    }
    try {
      await uploadImages({ itemId: manageItem.id, files }).unwrap();
      event.currentTarget.reset();
      setSuccess("Images uploaded.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to upload images."));
    }
  }

  async function makePrimary(imageId: string) {
    if (!manageItem) return;
    resetMessages();
    try {
      await updateImage({ itemId: manageItem.id, imageId, body: { primary: true } }).unwrap();
      setSuccess("Primary image updated.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to update image."));
    }
  }

  async function removeImage(imageId: string) {
    if (!manageItem || !window.confirm("Delete this image?")) return;
    resetMessages();
    try {
      await deleteImage({ itemId: manageItem.id, imageId }).unwrap();
      setSuccess("Image deleted.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to delete image."));
    }
  }

  async function handleBlockSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!manageItem) return;
    resetMessages();
    const form = new FormData(event.currentTarget);
    const startDate = String(form.get("startDate") || "");
    const endDate = String(form.get("endDate") || "");
    const reason = String(form.get("reason") || "").trim() || undefined;
    if (!startDate || !endDate || endDate < startDate) {
      setError("Choose a valid blocked date range.");
      return;
    }
    try {
      await createBlock({ itemId: manageItem.id, body: { startDate, endDate, reason } }).unwrap();
      event.currentTarget.reset();
      setSuccess("Availability block created.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to create availability block."));
    }
  }

  async function removeBlock(blockId: string) {
    if (!manageItem) return;
    resetMessages();
    try {
      await deleteBlock({ itemId: manageItem.id, blockId }).unwrap();
      setSuccess("Availability block removed.");
    } catch (requestError) {
      setError(apiMessage(requestError, "Unable to remove availability block."));
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#F73030]">Inventory</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Listings</h1>
          <p className="mt-1 text-sm text-slate-500">Create listings, manage images, status, and rental availability.</p>
        </div>
        <button onClick={openCreate} className="rounded-xl bg-[#F73030] px-4 py-2.5 text-sm font-semibold text-white">Add listing</button>
      </div>

      {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

      {showForm ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">{editing ? "Edit listing" : "Create listing"}</h2>
              <p className="text-xs text-slate-500">Fields match your CreateItemRequest / UpdateItemRequest API.</p>
            </div>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm font-semibold text-slate-500">Close</button>
          </div>

          {!editing && !addressesLoading && !vendorLocation ? <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Your listing location comes from your default vendor address. <Link href="/user/profile/edit-profile" className="font-bold underline">Add an address in your profile</Link> before creating a listing.</div> : null}
          {!editing && vendorLocation && (!Number.isFinite(vendorLocation.latitude) || !Number.isFinite(vendorLocation.longitude)) ? <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{locationLoading ? "Converting your vendor address to coordinates..." : "Your vendor address is used to fill the listing location automatically."}</div> : null}
          <form key={`${editing?.id || "new"}-${vendorLocation?.id || "no-location"}-${currentCoordinates?.latitude || "no-coordinates"}`} onSubmit={saveItem} className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Title<input name="title" required defaultValue={editing?.title || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold text-slate-700">Category<select name="categoryId" required value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="text-sm font-semibold text-slate-700">Condition<select name="condition" defaultValue={editing?.condition || "GOOD"} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal"><option value="NEW">New</option><option value="LIKE_NEW">Like new</option><option value="GOOD">Good</option><option value="FAIR">Fair</option><option value="POOR">Poor</option></select></label>
            <label className="text-sm font-semibold text-slate-700">Price / day<input name="pricePerDay" type="number" min="0.01" step="0.01" required defaultValue={editing?.pricePerDay ?? ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold text-slate-700">Security deposit<input name="depositAmount" type="number" min="0" step="0.01" defaultValue={editing?.depositAmount ?? ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold text-slate-700">Location text<input name="locationText" required readOnly={!editing} defaultValue={editing?.locationText || (!addressesLoading ? [vendorLocation?.addressLine, vendorLocation?.city, vendorLocation?.country].filter(Boolean).join(", ") : "")} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal read-only:bg-slate-50" /></label>
            <label className="text-sm font-semibold text-slate-700">Latitude<input name="latitude" type="number" step="any" min="-90" max="90" required readOnly={!editing} defaultValue={editing?.latitude ?? vendorLocation?.latitude ?? currentCoordinates?.latitude ?? ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal read-only:bg-slate-50" /></label>
            <label className="text-sm font-semibold text-slate-700">Longitude<input name="longitude" type="number" step="any" min="-180" max="180" required readOnly={!editing} defaultValue={editing?.longitude ?? vendorLocation?.longitude ?? currentCoordinates?.longitude ?? ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal read-only:bg-slate-50" /></label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">Description<textarea name="description" rows={3} defaultValue={editing?.description || ""} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2"><div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-bold text-slate-900">Specifications</h3><p className="mt-1 text-xs text-slate-500">Fields are provided by the selected category.</p></div>{specificationFieldsLoading ? <span className="text-xs text-slate-500">Loading...</span> : null}</div><div className="mt-4 grid gap-4 md:grid-cols-2">{(selectedCategory?.specificationFields ?? []).map((field) => { const currentValue = editing?.specifications?.[field.key]; const fieldType = field.type.toUpperCase(); return <label key={field.key} className="text-sm font-semibold text-slate-700">{field.label}{field.required ? " *" : ""}{fieldType === "SELECT" ? <select name={`specification.${field.key}`} required={field.required} defaultValue={String(currentValue ?? "")} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal"><option value="">Select {field.label}</option>{(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}</select> : fieldType === "BOOLEAN" ? <select name={`specification.${field.key}`} required={field.required} defaultValue={currentValue == null ? "" : String(currentValue)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal"><option value="">Select</option><option value="true">Yes</option><option value="false">No</option></select> : <input name={`specification.${field.key}`} type={fieldType === "NUMBER" ? "number" : "text"} required={field.required} defaultValue={String(currentValue ?? "")} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal" />}</label>; })}{!specificationFieldsLoading && selectedCategoryId && !selectedCategory?.specificationFields?.length ? <p className="text-xs text-slate-500 md:col-span-2">This category has no additional specifications.</p> : null}{!selectedCategoryId ? <p className="text-xs text-slate-500 md:col-span-2">Select a category to see its specification fields.</p> : null}</div></div>
            <div className="flex gap-2 md:col-span-2"><button disabled={createState.isLoading || updateState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{createState.isLoading || updateState.isLoading ? "Saving..." : editing ? "Save changes" : "Create listing"}</button><button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button></div>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? <p className="p-6 text-sm text-slate-500">Loading listings...</p> : null}
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <article key={item.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">{item.primaryImageUrl ? <img src={item.primaryImageUrl} alt="" className="h-full w-full object-cover" /> : null}</div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-bold text-slate-950">{item.title || "Untitled"}</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{item.approvalStatus || "—"}</span></div>
                    <p className="mt-1 text-sm font-semibold text-[#253C95]">{money(item.pricePerDay)} / day</p>
                    <p className="mt-1 text-xs text-slate-500">{item.locationText || "No location"} · {item.available ? "Available" : "Unavailable"} · {item.status || "—"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setManageItem(item)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Images & dates</button>
                  <button onClick={() => openEdit(item)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Edit</button>
                  <button onClick={() => toggleStatus(item)} disabled={statusState.isLoading} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">{item.status === "ACTIVE" ? "Hide" : "Activate"}</button>
                  <select aria-label="Availability" defaultValue={item.available ? "AVAILABLE" : "UNAVAILABLE"} onChange={(event) => setAvailability(item.id, event.target.value as "AVAILABLE" | "UNAVAILABLE" | "HIDDEN")} disabled={availabilityState.isLoading} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"><option value="AVAILABLE">Available</option><option value="UNAVAILABLE">Unavailable</option><option value="HIDDEN">Hidden</option></select>
                  <button onClick={() => handleDelete(item)} disabled={deleteState.isLoading} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">Delete</button>
                </div>
              </div>
            </article>
          ))}
          {!isLoading && !items.length ? <p className="p-10 text-center text-sm text-slate-500">You do not have any listings yet.</p> : null}
        </div>
      </section>

      {manageItem ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="text-lg font-bold text-slate-950">Manage: {manageItem.title}</h2><p className="text-xs text-slate-500">Images and unavailable rental date ranges.</p></div>
            <button onClick={() => setManageItem(null)} className="text-sm font-semibold text-slate-500">Close</button>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-2">
            <div>
              <h3 className="font-bold text-slate-900">Images</h3>
              <form onSubmit={handleImageUpload} className="mt-3 flex flex-col gap-3 sm:flex-row"><input name="files" type="file" accept="image/*" multiple className="min-w-0 flex-1 rounded-lg border border-slate-300 p-2 text-sm" /><button disabled={uploadState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{uploadState.isLoading ? "Uploading..." : "Upload"}</button></form>
              {imagesLoading ? <p className="mt-4 text-sm text-slate-500">Loading images...</p> : null}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="aspect-square bg-slate-100">{image.imageUrl || image.url ? <img src={image.imageUrl || image.url} alt="" className="h-full w-full object-cover" /> : null}</div>
                    <div className="flex items-center justify-between gap-2 p-2"><span className="text-[10px] font-bold text-slate-500">{image.primary ? "PRIMARY" : `#${image.sortOrder ?? 0}`}</span><div className="flex gap-2">{!image.primary && image.id ? <button onClick={() => makePrimary(image.id!)} disabled={updateImageState.isLoading} className="text-[10px] font-bold text-[#253C95]">Primary</button> : null}{image.id ? <button onClick={() => removeImage(image.id!)} disabled={deleteImageState.isLoading} className="text-[10px] font-bold text-red-600">Delete</button> : null}</div></div>
                  </div>
                ))}
                {!imagesLoading && !images.length ? <p className="col-span-full py-5 text-center text-sm text-slate-500">No images uploaded.</p> : null}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Blocked rental dates</h3>
              <form onSubmit={handleBlockSubmit} className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-600">Start<input name="startDate" type="date" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" /></label><label className="text-xs font-semibold text-slate-600">End<input name="endDate" type="date" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal" /></label><input name="reason" placeholder="Reason (optional)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2" /><button disabled={createBlockState.isLoading} className="rounded-lg bg-[#253C95] px-4 py-2 text-sm font-semibold text-white sm:col-span-2 disabled:opacity-50">{createBlockState.isLoading ? "Adding..." : "Block dates"}</button></form>
              {blocksLoading ? <p className="mt-4 text-sm text-slate-500">Loading blocked dates...</p> : null}
              <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {blocks.map((block) => <div key={block.id} className="flex items-center justify-between gap-3 p-3"><div><p className="text-sm font-semibold text-slate-900">{block.startDate} → {block.endDate}</p><p className="text-xs text-slate-500">{block.reason || block.source || "Unavailable"}</p></div><button onClick={() => removeBlock(block.id)} disabled={deleteBlockState.isLoading} className="text-xs font-semibold text-red-600">Remove</button></div>)}
                {!blocksLoading && !blocks.length ? <p className="p-5 text-center text-sm text-slate-500">No blocked dates.</p> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
