import { redirect } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const incoming = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(incoming)) {
    for (const entry of Array.isArray(value) ? value : value ? [value] : []) params.append(key, entry);
  }
  redirect(`/items${params.size ? `?${params.toString()}` : ""}`);
}
