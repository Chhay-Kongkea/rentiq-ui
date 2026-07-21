"use client";
import React, { useState } from 'react';
import { User, Store, Shield, HelpCircle, Info } from 'lucide-react';

export default function TermsAndPolicy() {
  const [activeTab, setActiveTab] = useState<'renter' | 'owner' | 'privacy'>('renter');

  return (
    <div className="min-h-screen bg-background text-app-text p-6 md:p-12 font-sans flex flex-col items-center justify-center">
      {/* Header Title */}
      <h1 className="text-header font-bold text-center mb-10 text-new-blue">
        Terms and <span className="text-new-red">Policy</span>
      </h1>

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Sidebar */}
        <aside className="md:col-span-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-3">
            {/* Renter Policy Tab */}
            <button
              onClick={() => setActiveTab('renter')}
              className={`flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-200 border text-caption ${
                activeTab === 'renter'
                  ? 'bg-card text-new-red border-l-4 border-l-new-red border-t-transparent border-r-transparent border-b-transparent shadow-sm'
                  : 'bg-card text-app-text/70 border-transparent hover:bg-third/30'
              }`}
            >
              <span>Renter Policy</span>
              <User className="w-5 h-5" />
            </button>

            {/* Owner Policy Tab */}
            <button
              onClick={() => setActiveTab('owner')}
              className={`flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-200 border text-caption ${
                activeTab === 'owner'
                  ? 'bg-card text-new-red border-l-4 border-l-new-red border-t-transparent border-r-transparent border-b-transparent shadow-sm'
                  : 'bg-card text-app-text/70 border-transparent hover:bg-third/30'
              }`}
            >
              <span>Owner Policy</span>
              <Store className="w-5 h-5" />
            </button>

            {/* Privacy Policy Tab */}
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center justify-between p-4 rounded-xl font-medium transition-all duration-200 border text-caption ${
                activeTab === 'privacy'
                  ? 'bg-card text-new-red border-l-4 border-l-new-red border-t-transparent border-r-transparent border-b-transparent shadow-sm'
                  : 'bg-card text-app-text/70 border-transparent hover:bg-third/30'
              }`}
            >
              <span>Privacy Policy</span>
              <Shield className="w-5 h-5" />
            </button>
          </nav>

          {/* Need Help Card */}
          <div className="bg-secondary text-primary-foreground rounded-2xl p-6 mt-2 shadow-md flex flex-col items-start gap-3">
            <h3 className="text-heading-2 font-bold leading-tight">Need Help?</h3>
            <p className="text-label text-primary-foreground/80 leading-snug">
              Our support team is available 24/7 for policy clarifications.
            </p>
            <button className="mt-2 w-full bg-card text-secondary font-semibold py-2.5 px-4 rounded-full text-in-button hover:bg-third transition-colors">
              Contact Support
            </button>
          </div>
        </aside>

        {/* Right Main Content Card */}
        <main className="md:col-span-8 bg-card border border-third/60 rounded-3xl p-6 md:p-10 shadow-sm">
          {activeTab === 'renter' && (
            <div className="flex flex-col gap-6">
              {/* Card Header */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-third rounded-full text-new-red">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-heading-1 font-bold text-app-text">Renter Policy</h2>
              </div>

              {/* Requirement Callout Banner */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-950 rounded-xl border border-blue-100">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-label leading-relaxed">
                  <span className="font-semibold">Key Requirement:</span>{' '}
                  <span className="text-new-red font-semibold">User must return item back</span>{' '}
                  in the same condition as received by the specified deadline.
                </p>
              </div>

              {/* Section 1 */}
              <section className="flex flex-col gap-2">
                <h3 className="text-heading-2 font-bold text-app-text">1. General Conduct</h3>
                <p className="text-english text-app-text/80 leading-relaxed">
                  All renters are expected to treat borrowed equipment with proper care, adhere to local regulatory standards, and maintain clear communication through the platform.
                </p>
              </section>

              {/* Section 2 */}
              <section className="flex flex-col gap-2">
                <h3 className="text-heading-2 font-bold text-app-text">2. Late Returns</h3>
                <p className="text-english text-app-text/80 leading-relaxed">
                  Returning an item after the agreed-upon window will incur late fees calculated at 1.5x the daily rental rate. Communication with the owner regarding delays is mandatory.
                </p>
              </section>

              {/* Section 3 */}
              <section className="flex flex-col gap-2">
                <h3 className="text-heading-2 font-bold text-app-text">3. Damage and Loss</h3>
                <p className="text-english text-app-text/80 leading-relaxed">
                  In the event of damage or loss, the Renter must notify both the Owner and VibrantRent support within 2 hours. Fees will be assessed based on professional repair estimates.
                </p>
              </section>

              {/* Product Image */}
              <div className="w-full h-64 md:h-80 overflow-hidden rounded-2xl my-2">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
                  alt="Camera equipment"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Section 4 */}
              <section className="flex flex-col gap-2">
                <h3 className="text-heading-2 font-bold text-app-text">4. Verification</h3>
                <p className="text-english text-app-text/80 leading-relaxed">
                  All renters must undergo a baseline identity verification process to ensure the security of the marketplace community.
                </p>
              </section>
            </div>
          )}

          {/* Placeholder for Owner Policy */}
          {activeTab === 'owner' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-third rounded-full text-new-red">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-heading-1 font-bold text-app-text">Owner Policy</h2>
              </div>
              <p className="text-english text-app-text/80">
                Owner guidelines and terms for listing items...
              </p>
            </div>
          )}

          {/* Placeholder for Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-third rounded-full text-new-red">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-heading-1 font-bold text-app-text">Privacy Policy</h2>
              </div>
              <p className="text-english text-app-text/80">
                Information on how we handle user data and privacy...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}