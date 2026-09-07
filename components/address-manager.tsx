"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import type { UserAddress } from "@/lib/types/user.types";
import {
  useAddMyAddressMutation,
  useDeleteMyAddressMutation,
  useGetMyAddressesQuery,
  useSetDefaultMyAddressMutation,
  useUpdateMyAddressMutation,
} from "@/redux/services/userApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CambodiaMapPicker = dynamic(() => import("@/components/cambodia-map-picker"), {
  ssr: false,
  loading: () => <div className="mt-3 grid h-56 place-items-center rounded-xl bg-[#EEF2FC] text-sm text-gray-500">Loading map...</div>,
});

export default function AddressManager() {
  const { data: addresses = [], isLoading, isError } = useGetMyAddressesQuery();
  const [deleteAddress] = useDeleteMyAddressMutation();
  const [setDefaultAddress] = useSetDefaultMyAddressMutation();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserAddress | "new" | null>(null);

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id).unwrap();
    } catch {
      toast.error("Unable to set default address");
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      await deleteAddress(id).unwrap();
      toast.success("Address removed");
    } catch {
      toast.error("Unable to delete this address");
    }
  }

  return (
    <section className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-new-red-50 text-new-red">
            <MapPin className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Addresses</h3>
        </div>
        <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 rounded-full bg-[#253C95] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1e3179]">
          <Plus className="size-3.5" /> Add
        </button>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-2">{Array.from({ length: 2 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-50" />)}</div>
      ) : isError ? (
        <p className="mt-4 text-sm text-red-600">Unable to load your addresses.</p>
      ) : addresses.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No addresses saved yet.</p>
      ) : (
        <div className="mt-4 space-y-2.5">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3.5">
              <button type="button" onClick={() => setEditing(address)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-slate-700">{[address.addressLine, address.city, address.country].filter(Boolean).join(", ")}</p>
                {address.isDefault ? <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600"><Star className="size-3 fill-emerald-600" /> Default</span> : null}
              </button>
              <div className="flex shrink-0 items-center gap-1">
                {!address.isDefault ? (
                  <button type="button" onClick={() => handleSetDefault(address.id)} title="Set as default" className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-[#253C95]">
                    <Star className="size-3.5" />
                  </button>
                ) : null}
                <button type="button" onClick={() => setDeleteTargetId(address.id)} title="Delete address" className="rounded-full p-2 text-slate-400 hover:bg-white hover:text-new-red">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={Boolean(deleteTargetId)} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this address?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editing ? <AddressFormDialog address={editing === "new" ? null : editing} onClose={() => setEditing(null)} /> : null}
    </section>
  );
}

function AddressFormDialog({ address, onClose }: { address: UserAddress | null; onClose: () => void }) {
  const [addMyAddress, { isLoading: isAdding }] = useAddMyAddressMutation();
  const [updateMyAddress, { isLoading: isUpdating }] = useUpdateMyAddressMutation();
  const [addressLine, setAddressLine] = useState(address?.addressLine ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [country, setCountry] = useState(address?.country ?? "KHM");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    address?.latitude != null && address?.longitude != null ? { lat: address.latitude, lng: address.longitude } : null,
  );
  const isSaving = isAdding || isUpdating;

  async function handleSave() {
    if (!addressLine.trim() || !city.trim() || country.trim().length !== 3) {
      toast.error("Fill in address, city, and a 3-letter country code.");
      return;
    }
    const body = { addressLine: addressLine.trim(), city: city.trim(), country: country.trim().toUpperCase(), latitude: position?.lat, longitude: position?.lng };
    try {
      if (address) await updateMyAddress({ addressId: address.id, body }).unwrap();
      else await addMyAddress(body).unwrap();
      toast.success(address ? "Address updated" : "Address added");
      onClose();
    } catch {
      toast.error("Unable to save this address");
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{address ? "Edit address" : "Add address"}</DialogTitle>
          <DialogDescription>Used for pickup coordination and vendor onboarding.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Address line
              <input value={addressLine} onChange={(event) => setAddressLine(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-[#253C95]" />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-[#253C95]" />
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-700">
            Country code (3 letters)
            <input value={country} maxLength={3} onChange={(event) => setCountry(event.target.value.toUpperCase())} className="mt-1.5 w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal uppercase outline-none focus:border-[#253C95]" />
          </label>
          <div>
            <p className="text-sm font-semibold text-slate-700">Pin location (optional)</p>
            <CambodiaMapPicker position={position} onSelect={setPosition} />
          </div>
        </div>
        <DialogFooter>
          <button type="button" onClick={handleSave} disabled={isSaving} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#253C95] px-5 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : "Save address"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
