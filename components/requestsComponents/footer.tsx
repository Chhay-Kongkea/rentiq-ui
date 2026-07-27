import { Camera, MessageCircle, Music2, PlayCircle, Share2 } from "lucide-react";
import Link from "next/link";

export default function SiteFooter() {
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