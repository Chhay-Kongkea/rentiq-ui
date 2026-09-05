export type Coordinates = {
  latitude: number;
  longitude: number;
};

type GeocodingResult = {
  lat?: string;
  lon?: string;
};

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  const query = address.trim();
  if (!query) return null;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kh&q=${encodeURIComponent(query)}`,
    { headers: { Accept: "application/json" } },
  );
  if (!response.ok) return null;

  const results = (await response.json()) as GeocodingResult[];
  const latitude = Number(results[0]?.lat);
  const longitude = Number(results[0]?.lon);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : null;
}
