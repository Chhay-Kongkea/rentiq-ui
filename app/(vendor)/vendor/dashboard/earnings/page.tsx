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
  DollarSign,
  Banknote, 
  TrendingUp, 
  Hourglass, 
  Package, 
  Download, 
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  Boxes
} from 'lucide-react';

// --- MOCK DATA ---
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

const initialPayouts = [
  {
    id: '#TX-984210',
    name: 'Caterpillar 320 GC',
    details: 'Excavator • Serial CAT-882',
    date: 'Oct 24, 2023',
    status: 'Completed',
    amount: 1240.00,
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '#TX-984105',
    name: 'Volvo VNL 860 Fleet',
    details: 'Long Haul • Serial VLV-211',
    date: 'Oct 22, 2023',
    status: 'Completed',
    amount: 2850.50,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '#TX-984098',
    name: 'Climate Control Unit B4',
    details: 'Storage • ID STR-098',
    date: 'Oct 21, 2023',
    status: 'Processing',
    amount: 450.00,
  },
  {
    id: '#TX-984085',
    name: 'CAT D8 Crawler',
    details: 'Dozer • Serial CAT-443',
    date: 'Oct 19, 2023',
    status: 'Completed',
    amount: 1920.00,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80',
  },
];

export default function DashboardApp() {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'earnings'
  const [inventoryView, setInventoryView] = useState('list'); // 'list' or 'form'
  
  // State
  const [inventory, setInventory] = useState(initialInventory);
  const [selectedYear, setSelectedYear] = useState('2023');
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

  // Actions
  const toggleAvailability = (id: string | number) => {
    setInventory(prev =>
      prev.map(item => item.id === id ? { ...item, available: !item.available } : item)
    );
  };

  const handleSaveListing = (e: React.FormEvent<HTMLFormElement>) => {
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
    setInventoryView('list');
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 space-y-6 text-slate-800">
      {/* WRAPPER CONTAINER WITH EXACT CLASS SPECIFICATION */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 space-y-6 text-slate-800">

        {/* TAB NAVIGATION HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('inventory'); setInventoryView('list'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'inventory' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-4 h-4" />
              Inventory Management
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'earnings' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Earnings Overview
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: INVENTORY MANAGEMENT                              */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                  Inventory Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Track and manage your professional gear listings.
                </p>
              </div>

              {inventoryView === 'list' && (
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-xs sm:text-sm font-semibold border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button
                    onClick={() => setInventoryView('form')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#d91d2a] rounded-lg text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#b81823] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Listing
                  </button>
                </div>
              )}
            </div>

            {inventoryView === 'list' ? (
              <>
                {/* Stats Cards */}
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

                {/* Inventory Table/List */}
                <div className="space-y-3">
                  <div className="hidden md:grid grid-cols-12 px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-5">Asset Name & Details</div>
                    <div className="col-span-2 text-right">Daily Rate</div>
                    <div className="col-span-2 text-right">Security Deposit</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Availability</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>

                  {inventory.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white/90 backdrop-blur rounded-2xl p-4 md:px-6 md:py-4 border border-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-0">
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

                        <div className="md:col-span-2 md:text-right flex md:block justify-between items-center text-xs md:text-sm">
                          <span className="md:hidden text-slate-400 font-medium">Daily Rate:</span>
                          <span className="font-bold text-slate-900">${item.dailyRate.toFixed(2)}</span>
                        </div>

                        <div className="md:col-span-2 md:text-right flex md:block justify-between items-center text-xs md:text-sm">
                          <span className="md:hidden text-slate-400 font-medium">Security Deposit:</span>
                          <span className="font-bold text-slate-900">${item.securityDeposit.toFixed(2)}</span>
                        </div>

                        <div className="md:col-span-1 flex md:justify-center">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-full tracking-wide">
                            {item.status}
                          </span>
                        </div>

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

                        <div className="md:col-span-1 flex items-center justify-end gap-2 text-slate-400">
                          <button onClick={() => setInventoryView('form')} className="p-1 hover:text-slate-600 transition-colors">
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
              /* FORM VIEW */
              <div className="space-y-6">
                <button 
                  onClick={() => setInventoryView('list')}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Inventory
                </button>

                <form onSubmit={handleSaveListing} className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                      <Info className="w-4 h-4 text-rose-500" />
                      <span>Basic Information</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Listing Title</label>
                        <input 
                          type="text" 
                          value={formData.title} 
                          onChange={e => setFormData({ ...formData, title: e.target.value })} 
                          className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                          <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Brand</label>
                          <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Model</label>
                          <input type="text" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Serial Number</label>
                          <input type="text" value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                      <ImageIcon className="w-4 h-4 text-rose-500" />
                      <span>Media Upload</span>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-6 text-center hover:border-rose-300 cursor-pointer">
                      <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-2">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">Drag and drop high-res images here</p>
                      <p className="text-[11px] text-slate-400 mt-1">Minimum 1600x1200px recommended, Max 10MB per file.</p>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-[4/3]">
                        <span className="absolute top-1 left-1 bg-rose-600 text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded uppercase z-10">PRIMARY</span>
                        <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80" alt="Primary" className="w-full h-full object-cover" />
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-200 aspect-[4/3]">
                        <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&auto=format&fit=crop&q=80" alt="Secondary" className="w-full h-full object-cover" />
                      </div>
                      <div className="border-2 border-dashed border-slate-200 rounded-lg aspect-[4/3] flex items-center justify-center text-slate-300 hover:text-slate-400 cursor-pointer">
                        <Plus className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                      <DollarSign className="w-4 h-4 text-rose-500" />
                      <span>Pricing & Rental Rules</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Daily Rate (USD)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                          <input type="number" value={formData.dailyRate} onChange={e => setFormData({ ...formData, dailyRate: e.target.value })} className="w-full text-sm font-medium pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Security Deposit (USD)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                          <input type="number" value={formData.securityDeposit} onChange={e => setFormData({ ...formData, securityDeposit: e.target.value })} className="w-full text-sm font-medium pl-8 pr-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.coiRequired} onChange={e => setFormData({ ...formData, coiRequired: e.target.checked })} className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300" />
                        COI (Certificate of Insurance) Required
                      </label>
                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.cleaningFeeIncluded} onChange={e => setFormData({ ...formData, cleaningFeeIncluded: e.target.checked })} className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300" />
                        Cleaning fee included in rate
                      </label>
                      <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.availableForShipping} onChange={e => setFormData({ ...formData, availableForShipping: e.target.checked })} className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300" />
                        Available for shipping
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2.5 bg-[#d91d2a] hover:bg-[#b81823] text-white text-sm font-bold rounded-xl shadow transition-colors">
                      Finalize & Publish
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: EARNINGS OVERVIEW                                 */}
        {/* ========================================================= */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Earnings Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time performance tracking for your asset portfolio.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.5%
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">$142,580.00</p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Average</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">$18,450.00</p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Hourglass className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">$4,120.45</p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Assets</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">24 Units</p>
              </div>
            </div>

            {/* Chart + Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Earnings Trend</h2>
                    <p className="text-xs text-slate-400">Fiscal Year Performance</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-1.5 pr-7 focus:outline-none cursor-pointer"
                      >
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                    </div>

                    <button className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="w-full h-52 relative mt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d91d2a" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#d91d2a" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeDasharray="4" />
                    <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeDasharray="4" />

                    <path
                      d="M0,130 L0,120 L40,105 L80,122 L120,95 L160,82 L200,102 L240,70 L280,82 L320,55 L360,45 L400,68 L440,32 L480,25 L480,150 L0,150 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0,120 L40,105 L80,122 L120,95 L160,82 L200,102 L240,70 L280,82 L320,55 L360,45 L400,68 L440,32 L480,25"
                      fill="none"
                      stroke="#d91d2a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase mt-4 px-1">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                  </div>
                </div>
              </div>

              {/* Asset Breakdown */}
              <div className="lg:col-span-4 bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm flex flex-col justify-between">
                <h2 className="font-bold text-slate-900 text-base mb-4">Asset Breakdown</h2>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">Heavy Machinery</span>
                      <span className="text-slate-900">$82,400 <span className="text-slate-400 font-normal">(58%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#d91d2a] rounded-full" style={{ width: '58%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">Fleet Vehicles</span>
                      <span className="text-slate-900">$45,180 <span className="text-slate-400 font-normal">(32%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">Storage Units</span>
                      <span className="text-slate-900">$15,000 <span className="text-slate-400 font-normal">(10%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-800 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium text-center">
                  Updated automatically based on paid rentals.
                </div>
              </div>
            </div>

            {/* Payouts Table */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-white shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-base">Recent Payouts</h2>
                <button className="text-xs font-bold text-rose-600 hover:underline">View All History</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-6">Transaction ID</th>
                      <th className="py-3 px-6">Asset Details</th>
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {initialPayouts.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">{item.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-200" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                              <p className="text-[11px] text-slate-400 font-normal">{item.details}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{item.date}</td>
                        <td className="py-4 px-6 text-center">
                          {item.status === 'Completed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              Processing
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-900 text-sm">
                          ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}