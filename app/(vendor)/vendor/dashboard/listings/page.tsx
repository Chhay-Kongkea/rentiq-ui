"use client";
import React, { useState } from 'react';
import { 
  Filter, 
  Plus, 
  Pencil, 
  MoreVertical, 
  ArrowLeft, 
  UploadCloud, 
  Info, 
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';

// Mock Data for Inventory Items
const initialInventory = [
  {
    id: '1',
    name: 'Sony A7 IV Body',
    sn: 'SN: 49201-BXC',
    specs: '33MP Full-Frame',
    dailyRate: 120,
    securityDeposit: 500,
    status: 'ACTIVE',
    available: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'RED V-Raptor 8K VV',
    sn: 'SN: 88102-VR',
    specs: '8K VV Cinema Camera',
    dailyRate: 450,
    securityDeposit: 2500,
    status: 'ACTIVE',
    available: true,
    image: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Canon C300 Mark III',
    sn: 'SN: 10293-C3',
    specs: '4K Super 35 Cinema',
    dailyRate: 210,
    securityDeposit: 1200,
    status: 'ACTIVE',
    available: false,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'ARRI Alexa Mini LF',
    sn: 'SN: 99201-AR',
    specs: 'Large Format Cinema',
    dailyRate: 850,
    securityDeposit: 5000,
    status: 'ACTIVE',
    available: true,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=150&auto=format&fit=crop&q=80',
  },
];

export default function InventoryManagement() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [inventory, setInventory] = useState(initialInventory);

  // New Listing Form State
  const [formData, setFormData] = useState({
    title: 'Sony FX6 Full-Frame Cinema Camera Kit',
    category: 'Cinema Cameras',
    brand: 'Sony',
    model: 'ILME-FX6V',
    serialNumber: 'S01-449202-K',
    dailyRate: 250,
    securityDeposit: 1500,
    coiRequired: true,
    cleaningFeeIncluded: false,
    availableForShipping: true,
  });

  // Toggle item availability in the table view
  const toggleAvailability = (id) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  // Handle Form Submit
  const handleSaveListing = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now().toString(),
      name: formData.title,
      sn: `SN: ${formData.serialNumber}`,
      specs: `${formData.brand} ${formData.model}`,
      dailyRate: Number(formData.dailyRate),
      securityDeposit: Number(formData.securityDeposit),
      status: 'ACTIVE',
      available: true,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80',
    };
    setInventory([newItem, ...inventory]);
    setView('list');
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 space-y-6 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Inventory Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track and manage your professional gear listings.
            </p>
          </div>

          {view === 'list' && (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button
                onClick={() => setView('form')}
                className="flex items-center gap-2 px-4 py-2 bg-[#d91d2a] rounded-lg text-sm font-semibold text-white shadow hover:bg-[#b81823] transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Listing
              </button>
            </div>
          )}
        </div>

        {/* LIST VIEW */}
        {view === 'list' ? (
          <>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/60 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Assets</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-900">{inventory.length + 20}</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">↑ 12%</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/60 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Listings</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-900">{inventory.length + 14}</span>
                  <span className="text-xs font-medium text-slate-500">75% Utility</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/60 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-900">$4,280</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">↑ $850</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/60 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Daily Rate</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-900">$145</span>
                  <span className="text-xs font-medium text-slate-500">Market Comp</span>
                </div>
              </div>
            </div>

            {/* INVENTORY TABLE / LIST */}
            <div className="space-y-4">
              {/* Header row (Visible on desktop) */}
              <div className="hidden md:grid grid-cols-12 px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Asset Name & Details</div>
                <div className="col-span-2 text-right">Daily Rate</div>
                <div className="col-span-2 text-right">Security Deposit</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Availability</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Data Items */}
              {inventory.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white/90 backdrop-blur rounded-2xl p-4 md:px-6 md:py-4 border border-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-0">
                    
                    {/* Item Image & Details */}
                    <div className="md:col-span-5 flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-200 shadow-inner flex-shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{item.sn} | {item.specs}</p>
                      </div>
                    </div>

                    {/* Daily Rate */}
                    <div className="md:col-span-2 md:text-right flex md:block justify-between items-center text-xs md:text-sm">
                      <span className="md:hidden text-slate-400 font-medium">Daily Rate:</span>
                      <span className="font-bold text-slate-900">${item.dailyRate.toFixed(2)}</span>
                    </div>

                    {/* Security Deposit */}
                    <div className="md:col-span-2 md:text-right flex md:block justify-between items-center text-xs md:text-sm">
                      <span className="md:hidden text-slate-400 font-medium">Security Deposit:</span>
                      <span className="font-bold text-slate-900">${item.securityDeposit.toFixed(2)}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="md:col-span-1 flex md:justify-center">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-full tracking-wide">
                        {item.status}
                      </span>
                    </div>

                    {/* Availability Switch */}
                    <div className="md:col-span-1 flex items-center justify-start md:justify-center gap-2">
                      <button 
                        onClick={() => toggleAvailability(item.id)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${item.available ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${item.available ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.available ? 'Available' : 'Rented'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex items-center justify-end gap-2 text-slate-400">
                      <button 
                        onClick={() => setView('form')}
                        className="p-1 hover:text-slate-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* FORM VIEW (New / Edit Listing) */
          <div className="space-y-6">
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </button>

            <form onSubmit={handleSaveListing} className="space-y-6">
              
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                  <Info className="w-4 h-4 text-rose-500" />
                  <span>Basic Information</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Listing Title
                    </label>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <input 
                        type="text"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Brand
                      </label>
                      <input 
                        type="text"
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Model
                      </label>
                      <input 
                        type="text"
                        value={formData.model}
                        onChange={e => setFormData({ ...formData, model: e.target.value })}
                        className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Serial Number
                      </label>
                      <input 
                        type="text"
                        value={formData.serialNumber}
                        onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                        className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: MEDIA UPLOAD */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                  <ImageIcon className="w-4 h-4 text-rose-500" />
                  <span>Media Upload</span>
                </div>

                <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-6 text-center hover:border-rose-300 transition-colors cursor-pointer">
                  <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Drag and drop high-res images here</p>
                  <p className="text-[11px] text-slate-400 mt-1">Minimum 1600x1200px recommended, Max 10MB per file.</p>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-[4/3] group">
                    <span className="absolute top-1 left-1 bg-rose-600 text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded uppercase z-10">
                      PRIMARY
                    </span>
                    <img 
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80" 
                      alt="Primary"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden border border-slate-200 aspect-[4/3]">
                    <img 
                      src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&auto=format&fit=crop&q=80" 
                      alt="Secondary"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg aspect-[4/3] flex items-center justify-center text-slate-300 hover:text-slate-400 hover:border-slate-300 cursor-pointer transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PRICING & RENTAL RULES */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                  <DollarSign className="w-4 h-4 text-rose-500" />
                  <span>Pricing & Rental Rules</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Daily Rate (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                      <input 
                        type="number"
                        value={formData.dailyRate}
                        onChange={e => setFormData({ ...formData, dailyRate: e.target.value })}
                        className="w-full text-sm font-medium pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Recommended: $230 - $280 for this model.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Security Deposit (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                      <input 
                        type="number"
                        value={formData.securityDeposit}
                        onChange={e => setFormData({ ...formData, "securityDeposit": e.target.value })}
                        className="w-full text-sm font-medium pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* CHECKBOXES */}
                <div className="pt-2 space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Rental Rules
                  </span>
                  
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.coiRequired}
                      onChange={e => setFormData({ ...formData, coiRequired: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    COI (Certificate of Insurance) Required
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.cleaningFeeIncluded}
                      onChange={e => setFormData({ ...formData, cleaningFeeIncluded: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    Cleaning fee included in rate
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.availableForShipping}
                      onChange={e => setFormData({ ...formData, availableForShipping: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    Available for shipping
                  </label>
                </div>

                {/* AVAILABILITY PREVIEW CALENDAR */}
                <div className="pt-4 space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Availability Preview
                  </span>
                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                      <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium">
                      <div className="py-2 text-slate-300">28</div>
                      <div className="py-2 text-slate-300">29</div>
                      <div className="py-2 text-slate-300">30</div>
                      <div className="py-2 bg-white rounded border border-slate-200">1</div>
                      <div className="py-2 bg-white rounded border border-slate-200">2</div>
                      <div className="py-2 bg-white rounded border border-slate-200">3</div>
                      <div className="py-2 bg-white rounded border border-slate-200">4</div>
                      <div className="py-2 bg-white rounded border border-slate-200">5</div>
                      <div className="py-2 bg-white rounded border border-slate-200">6</div>
                      <div className="py-2 bg-rose-500 text-white rounded font-bold">7</div>
                      <div className="py-2 bg-rose-500 text-white rounded font-bold">8</div>
                      <div className="py-2 bg-rose-500 text-white rounded font-bold">9</div>
                      <div className="py-2 bg-white rounded border border-slate-200">10</div>
                      <div className="py-2 bg-white rounded border border-slate-200">11</div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-3 mt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white inline-block"></span>
                          Available
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                          Booked
                        </span>
                      </div>
                      <button type="button" className="text-rose-600 font-bold hover:underline">
                        Edit Full Calendar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#d91d2a] hover:bg-[#b81823] text-white text-sm font-bold rounded-xl shadow transition-colors"
                >
                  Finalize & Publish
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}