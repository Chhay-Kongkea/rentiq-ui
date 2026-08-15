"use client";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

export type CambodiaMapPosition = {
  lat: number;
  lng: number;
};

type CambodiaMapPickerProps = {
  position: CambodiaMapPosition | null;
  onSelect: (position: CambodiaMapPosition) => void;
};

const CAMBODIA_CENTER: [number, number] = [12.5657, 104.991];
const CAMBODIA_BOUNDS: [[number, number], [number, number]] = [
  [9.8, 102.2],
  [14.8, 107.8],
];

function MapClickHandler({
  onSelect,
}: {
  onSelect: CambodiaMapPickerProps["onSelect"];
}) {
  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

export default function CambodiaMapPicker({
  position,
  onSelect,
}: CambodiaMapPickerProps) {
  return (
    <div className="relative mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      <MapContainer
        center={CAMBODIA_CENTER}
        zoom={7}
        minZoom={6}
        maxZoom={18}
        maxBounds={CAMBODIA_BOUNDS}
        maxBoundsViscosity={0.8}
        scrollWheelZoom
        className="h-72 w-full sm:h-80"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelect={onSelect} />
        {position && (
          <CircleMarker
            center={[position.lat, position.lng]}
            radius={10}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#E8402C",
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Popup>
              <strong>Pickup point</strong>
              <br />
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md backdrop-blur">
        Click the map to set your pickup point
      </div>
      {position && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg bg-[#E8402C] px-3 py-2 text-xs font-semibold text-white shadow-md">
          Pin selected in Cambodia
        </div>
      )}
    </div>
  );
}
