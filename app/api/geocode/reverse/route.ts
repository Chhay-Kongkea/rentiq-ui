type NominatimAddress = {
  village?: string;
  hamlet?: string;
  neighbourhood?: string;
  suburb?: string;
  town?: string;
  city?: string;
  municipality?: string;
  county?: string;
  state_district?: string;
  state?: string;
  country?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lng"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < 9.8 || latitude > 14.8 || longitude < 102.2 || longitude > 107.8) {
    return Response.json({ message: "Valid coordinates inside Cambodia are required." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", "18");

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en,km;q=0.8",
        "User-Agent": "Rentiq-Web/1.0 (https://rentiq.site)",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) return Response.json({ message: "Location lookup is unavailable." }, { status: 502 });

    const result = await response.json() as NominatimResponse;
    const address = result.address ?? {};
    const locality = address.village || address.hamlet || address.neighbourhood || address.suburb || address.town || address.city || address.municipality;
    const district = address.county || address.state_district;
    const parts = [locality, district, address.state, address.country].filter((part, index, values): part is string => Boolean(part) && values.indexOf(part) === index);

    return Response.json({ label: parts.join(", ") || result.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` });
  } catch {
    return Response.json({ message: "Location lookup is unavailable." }, { status: 502 });
  }
}
