'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function BusSearch() {
  const router = useRouter();
  const [from, setFrom] = useState('London, Viktoriya');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(format(new Date(), 'dd-MMM, yyyy'));
  const [travelers, setTravelers] = useState('1 Kattalar');

  const handleSearch = () => {
    if (!to) {
      alert("Iltimos, boradigan shaharni kiriting!");
      return;
    }
    router.push(`/search?from=${from}&to=${to}&date=${date}&travelers=${travelers}`);
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to || 'Jo\'nash shahri');
    setTo(temp);
  };

  return (
    <section className="relative mb-12">
      <div className="glass-card dark:bg-slate-800/40 rounded-3xl p-6 shadow-[0_24px_64px_rgba(25,28,29,0.06)] border border-white/50 dark:border-slate-700/50">
        <div className="space-y-4 relative">
          {/* From Field */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 dark:text-slate-500 mb-1.5 ml-1">DAN</label>
            <div className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-bg-surface-container-lowest focus-within:ring-2 ring-primary/5">
              <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-3">location_on</span>
              <input
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-semibold text-on-surface dark:text-slate-100"
                placeholder="Jo'nash shahri"
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="absolute right-8 top-[50%] -translate-y-[50%] z-10">
            <button
              onClick={swapLocations}
              className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-lg">swap_vert</span>
            </button>
          </div>

          {/* To Field */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5 ml-1">GA</label>
            <div className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary/5">
              <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-3">map</span>
              <input
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-semibold text-on-surface dark:text-slate-100"
                placeholder="Boradigan shahar"
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>

          {/* Date & Passengers Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5 ml-1">KETISH SANASI</label>
              <div className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-surface-container-lowest">
                <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-3">calendar_today</span>
                <input
                  className="bg-transparent border-none p-0 focus:ring-0 w-full font-semibold text-on-surface dark:text-slate-100 text-sm"
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1.5 ml-1">YO'LOVCHILAR</label>
              <div className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-surface-container-lowest">
                <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-3">group</span>
                <input
                  className="bg-transparent border-none p-0 focus:ring-0 w-full font-semibold text-on-surface dark:text-slate-100 text-sm"
                  type="text"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full py-5 rounded-3xl bg-gradient-to-br from-primary to-primary-container text-white font-black uppercase tracking-widest text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>AVTOBUSLARNI QIDIRISH</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
