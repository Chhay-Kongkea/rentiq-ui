import { redirect } from "next/navigation";

export default function LegacyProfileFavoritesPage() {
  redirect("/user/favorites");
}
