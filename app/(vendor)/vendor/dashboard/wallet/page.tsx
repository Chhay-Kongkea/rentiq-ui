"use client";
import React, { useState } from 'react';
import {
  ArrowDownLeft,
  Plus,
  Hourglass,
  Calendar,
  Filter,
  Download,
  ArrowLeft,
  ShieldCheck,
  Clock,
  MessageCircle,
  Zap,
  Receipt,
  Lightbulb,
  CreditCard,
  Building2,
  Wrench,
  Building,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

// --- MOCK DATA ---
const initialTransactions = [
  {
    id: 'RT-982931',
    date: 'Oct 20, 2026',
    entity: 'Skyline Loft B',
    type: 'income',
    status: 'Completed',
    amount: 3450.00,
    icon: Building,
  },
  {
    id: 'RT-884322',
    date: 'Oct 18, 2026',
    entity: 'Payout to Visa Business',
    type: 'income',
    status: 'Completed',
    amount: 3450.00,
    icon: CreditCard,
  },
  {
    id: 'RT-982886',
    date: 'Oct 17, 2026',
    entity: 'Green Valley Estates',
    type: 'income',
    status: 'Processing',
    amount: 1200.00,
    icon: Building,
  },
  {
    id: 'RT-775411',
    date: 'Oct 15, 2026',
    entity: 'Maintenance: HVAC Repair',
    type: 'expense',
    status: 'Completed',
    amount: -51.00,
    icon: Wrench,
  },
  {
    id: 'RT-991300',
    date: 'Oct 14, 2026',
    entity: 'Downtown Tech Hub',
    type: 'income',
    status: 'Completed',
    amount: 5800.00,
    icon: Building,
  },
];

export default function WalletApp() {
  const [currentView, setCurrentView] = useState('wallet'); // 'wallet' | 'withdraw' | 'topup'

  // Form & Balance States
  const [balance, setBalance] = useState(24850.00);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState('visa');
  
  const [topUpAmount, setTopUpAmount] = useState(1000);
  const [selectedTopUpMethod, setSelectedTopUpMethod] = useState('visa');

  // Calculations
  const withdrawFee = 2.50;
  const withdrawTotal = Math.max(0, (parseFloat(withdrawAmount) || 0) - withdrawFee);

  const topUpFee = topUpAmount * 0.005; // 0.5%
  const topUpTotal = topUpAmount + topUpFee;

  return (
    <div className="min-h-screen bg-[#f3edea]">
      {/* EXACT WRAPPER CLASS */}
      <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6 space-y-6 text-slate-800">

        {/* ========================================================= */}
        {/* VIEW 1: MAIN WALLET MANAGEMENT                            */}
        {/* ========================================================= */}
        {currentView === 'wallet' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Wallet Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Monitor your rental income and manage payouts effortlessly.
              </p>
            </div>

            {/* TOP CARDS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* AVAILABLE BALANCE CARD (8 Cols) */}
              <div className="lg:col-span-7 bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Available Balance
                    </p>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ↗ +12.5%
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setCurrentView('withdraw')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-rose-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    Withdraw
                  </button>
                  <button
                    onClick={() => setCurrentView('topup')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff3b30] hover:bg-[#e03126] text-white font-bold text-xs sm:text-sm transition-colors shadow"
                  >
                    <Plus className="w-4 h-4" />
                    Top Up
                  </button>
                </div>
              </div>

              {/* EARNINGS GOAL CARD (5 Cols) */}
              <div className="lg:col-span-5 bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-sm">Earnings Goal</h3>
                    <span className="text-xs font-extrabold text-blue-600">80%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-[#ff3b30] rounded-full" style={{ width: '80%' }}></div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    You're <span className="font-bold text-slate-700">$5,150</span> away from your monthly target of $30k.
                  </p>
                </div>

                <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Adjust Goal
                </button>
              </div>

            </div>

            {/* THREE SUB-METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Clearances</p>
                  <p className="text-lg font-black text-slate-900">$3,240.15</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Payout</p>
                  <p className="text-lg font-black text-slate-900">$8,900.00</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-white/60 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Settlement</p>
                  <p className="text-lg font-black text-slate-900">Oct 24, 2026</p>
                </div>
              </div>

            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-white shadow-sm overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-base">Detailed Transactions</h2>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    <Filter className="w-3.5 h-3.5" />
                    Filter
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-6">Entity / Asset</th>
                      <th className="py-3 px-6">Transaction ID</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {initialTransactions.map((tx, idx) => {
                      const IconComponent = tx.icon;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-6 text-slate-500">{tx.date}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-slate-900 text-sm">{tx.entity}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-[11px] text-slate-400">{tx.id}</td>
                          <td className="py-4 px-6 text-center">
                            {tx.status === 'Completed' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                                Processing
                              </span>
                            )}
                          </td>
                          <td className={`py-4 px-6 text-right font-black text-sm ${tx.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 text-center border-t border-slate-100 bg-slate-50/30">
                <button className="text-xs font-bold text-blue-600 hover:underline">
                  Load More Transactions ∨
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: WITHDRAW FUNDS                                    */}
        {/* ========================================================= */}
        {currentView === 'withdraw' && (
          <div className="space-y-6">
            
            {/* Top Navigation Back Button */}
            <button
              onClick={() => setCurrentView('wallet')}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Wallet
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Withdraw Funds
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Transfer earnings directly to your verified payout methods.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT FORM (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Available Balance Header */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Available Balance
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                    <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[10px] font-bold uppercase">
                      Fully Verified
                    </span>
                    <span>Last updated: Today, 09:41 AM</span>
                  </div>
                </div>

                {/* Withdraw Input Block */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Withdraw Amount</label>
                    <button 
                      type="button" 
                      onClick={() => setWithdrawAmount(balance.toString())}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Withdraw All
                    </button>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-3 text-2xl font-bold text-slate-300">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full text-3xl font-black pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Processing fee: ${withdrawFee.toFixed(2)}</span>
                    <span>Min. withdrawal: $50.00</span>
                  </div>
                </div>

                {/* Payout Method Selection */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Payout Method</label>
                    <button className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline">
                      <Plus className="w-3.5 h-3.5" />
                      Add New Method
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Method 1 */}
                    <div 
                      onClick={() => setSelectedWithdrawMethod('visa')}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        selectedWithdrawMethod === 'visa' 
                          ? 'border-rose-500 bg-rose-50/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-slate-900 rounded text-white flex items-center justify-center font-bold text-[10px]">
                          VISA
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Visa Business</p>
                          <p className="text-[11px] text-slate-400">Ending in 8821 • Exp 12/26</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedWithdrawMethod === 'visa' ? 'border-rose-500 bg-rose-500' : 'border-slate-300'}`}>
                        {selectedWithdrawMethod === 'visa' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    {/* Method 2 */}
                    <div 
                      onClick={() => setSelectedWithdrawMethod('chase')}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        selectedWithdrawMethod === 'chase' 
                          ? 'border-rose-500 bg-rose-50/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-slate-100 border border-slate-200 rounded text-slate-600 flex items-center justify-center font-bold text-[10px]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Chase Savings (Main)</p>
                          <p className="text-[11px] text-slate-400">Ending in 0039 • Direct Deposit</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedWithdrawMethod === 'chase' ? 'border-rose-500 bg-rose-500' : 'border-slate-300'}`}>
                        {selectedWithdrawMethod === 'chase' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR SUMMARY (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                    Withdrawal Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Amount</span>
                      <span className="font-bold text-slate-800">${(parseFloat(withdrawAmount) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Fee</span>
                      <span className="font-bold text-slate-800">${withdrawFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-800">Total to receive</span>
                    <span className="text-2xl font-black text-rose-600">${withdrawTotal.toFixed(2)}</span>
                  </div>

                  <button 
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) < 50}
                    className="w-full py-3 bg-[#ff3b30] hover:bg-[#e03126] disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    Withdraw Now
                  </button>
                </div>

                {/* Secure & Info Cards */}
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 space-y-3">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Secure Transaction</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Your withdrawal is protected by end-to-end 256-bit encryption and fraud prevention.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Estimated Arrival</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Funds usually arrive within 1-3 business days depending on your bank's schedule.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-white shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Need help?</p>
                      <p className="text-[10px] text-slate-400">Contact 24/7 support team.</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-rose-600 hover:underline">Chat Now</button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: TOP UP WALLET                                     */}
        {/* ========================================================= */}
        {currentView === 'topup' && (
          <div className="space-y-6">
            
            {/* Top Back Navigation */}
            <button
              onClick={() => setCurrentView('wallet')}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Wallet
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Top Up Wallet
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Add funds to your primary Rentia operating account.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT FORM (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Header Balances Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#ff3b30] text-white rounded-2xl p-5 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Available Balance</p>
                    <p className="text-2xl font-black">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] font-medium opacity-90 pt-1">↗ +12% vs last month</p>
                  </div>

                  <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Inflow</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">$4,200.00</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                      <span>Last deposit: Oct 12, 2026</span>
                      <button className="font-bold text-rose-600 hover:underline">History</button>
                    </div>
                  </div>
                </div>

                {/* Amount Inputs & Quick Selectors */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                  <label className="text-xs font-bold text-slate-700">Top Up Amount</label>

                  <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4">
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-3xl font-black text-slate-400">$</span>
                      <input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                        className="w-full text-3xl font-black pl-8 bg-transparent focus:outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[500, 1000, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTopUpAmount(preset)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                          topUpAmount === preset 
                            ? 'border-rose-500 text-rose-600 bg-rose-50' 
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        +${preset.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="bg-blue-50/60 rounded-xl p-3 text-xs text-blue-700 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    Minimum top-up amount is $50.00 per transaction.
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Payment Method</label>
                    <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                      <Plus className="w-3.5 h-3.5" />
                      Add New Method
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Method 1 */}
                    <div 
                      onClick={() => setSelectedTopUpMethod('visa')}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        selectedTopUpMethod === 'visa' 
                          ? 'border-rose-500 bg-rose-50/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-slate-900 rounded text-white flex items-center justify-center font-bold text-[10px]">
                          VISA
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Visa Business **** 8821</p>
                          <p className="text-[11px] text-slate-400">Expires 04/26 • Default</p>
                        </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>

                    {/* Method 2 */}
                    <div 
                      onClick={() => setSelectedTopUpMethod('mastercard')}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        selectedTopUpMethod === 'mastercard' 
                          ? 'border-rose-500 bg-rose-50/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-amber-500 rounded text-white flex items-center justify-center font-bold text-[10px]">
                          MC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Mastercard Platinum **** 4492</p>
                          <p className="text-[11px] text-slate-400">Expires 11/25</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedTopUpMethod === 'mastercard' ? 'border-rose-500 bg-rose-500' : 'border-slate-300'}`}>
                        {selectedTopUpMethod === 'mastercard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    {/* Method 3 */}
                    <div 
                      onClick={() => setSelectedTopUpMethod('ach')}
                      className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        selectedTopUpMethod === 'ach' 
                          ? 'border-rose-500 bg-rose-50/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-[10px]">
                          ACH
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Bank Transfer (ACH)</p>
                          <p className="text-[11px] text-slate-400">J.P. Morgan Chase **** 0019</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedTopUpMethod === 'ach' ? 'border-rose-500 bg-rose-500' : 'border-slate-300'}`}>
                        {selectedTopUpMethod === 'ach' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT SUMMARY (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                    Top Up Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Top up amount</span>
                      <span className="font-bold text-slate-800">${topUpAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Service fee (0.5%)</span>
                      <span className="font-bold text-slate-800">${topUpFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-800">Total to pay</span>
                    <span className="text-2xl font-black text-rose-600">${topUpTotal.toFixed(2)}</span>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      setBalance(prev => prev + topUpAmount);
                      setCurrentView('wallet');
                    }}
                    className="w-full py-3 bg-[#ff3b30] hover:bg-[#e03126] text-white font-bold text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                  >
                    Confirm Top Up
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Features list */}
                <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-white shadow-sm space-y-4 text-xs">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Secure Transactions</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">End-to-end 256-bit SSL encryption. Rentia never stores your CVV or PIN details.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Immediate Availability</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Funds are typically cleared and available in your wallet within seconds.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Receipt className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Tax Compliant</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">A detailed transaction receipt will be sent to your registered email.</p>
                    </div>
                  </div>
                </div>

                {/* Pro tip */}
                <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100 flex gap-3 text-xs">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-blue-900">Pro Tip</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Auto-top up can be configured in your <span className="underline cursor-pointer font-bold">Wallet Settings</span> to ensure you never miss a property maintenance payment.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}