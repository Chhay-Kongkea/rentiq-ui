// components/footer.tsx
import Link from "next/link";
import { Globe, Share2, Camera, Video, Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-20 pb-10 border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-16">
          
          {/* Brand Info & Socials (Span 2 cols on large) */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black text-[#FF2B2B] tracking-tight flex items-center">
                <span className="bg-[#FF2B2B] text-white p-1 rounded-lg mr-1.5 text-lg font-bold">R</span>
                Rentiq
              </span>
            </div>

            <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-sm">
              Cambodia&apos;s trusted marketplace for renting anything, anywhere.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-[#FF2B2B] transition-colors">
                <Globe className="h-4 w-4" />
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-[#FF2B2B] transition-colors">
                <Share2 className="h-4 w-4" />
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-[#FF2B2B] transition-colors">
                <Camera className="h-4 w-4" />
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-[#FF2B2B] transition-colors">
                <Video className="h-4 w-4" />
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-[#FF2B2B] transition-colors">
                <Play className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-sm font-bold text-neutral-900 mb-4 tracking-wide">Product</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-500">
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Categories</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">For Vendors</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Features</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-sm font-bold text-neutral-900 mb-4 tracking-wide">Company</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-500">
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-sm font-bold text-neutral-900 mb-4 tracking-wide">Support</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-500">
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Safety Tips</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-start text-left">
            <h4 className="text-sm font-bold text-neutral-900 mb-4 tracking-wide">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-500">
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-[#FF2B2B] transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Download Card Bar / Copyright */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Download App Box matching reference design */}
            <div className="bg-neutral-50/80 border border-neutral-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
              <div className="text-left">
                <h5 className="text-sm font-bold text-neutral-900">Download the App</h5>
                <p className="text-xs text-neutral-500">Rent on the go, anytime.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="#" className="block">
                  <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:opacity-85 transition-opacity">
                    <span>Google Play</span>
                  </div>
                </Link>
                <Link href="#" className="block">
                  <div className="bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 hover:opacity-85 transition-opacity">
                    <span>App Store</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400 text-center md:text-right">
            &copy; 2026 RentalHub. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}