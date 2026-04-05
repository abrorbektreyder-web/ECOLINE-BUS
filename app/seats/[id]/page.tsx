'use client';

import React, { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function SeatSelection() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const from = searchParams.get('from') || 'Toshkent';
  const to = searchParams.get('to') || 'Guanchjou';
  const basePrice = parseInt(searchParams.get('price') || '120');

  const [selectedSeats, setSelectedSeats] = useState<string[]>(['12A']);

  const toggleSeat = (seatId: string) => {
    if (seatId === 'occupied') return;
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const totalPrice = selectedSeats.length * basePrice;

  const Seat = ({ id, isOccupied = false }: { id: string, isOccupied?: boolean }) => {
    if (isOccupied) return <button className="aspect-square bg-surface-dim dark:bg-slate-700/50 rounded-xl cursor-not-allowed"></button>;
    
    const isSelected = selectedSeats.includes(id);
    return (
      <button 
        onClick={() => toggleSeat(id)}
        className={`aspect-square ${isSelected ? 'seat-selected text-white shadow-lg ring-4 ring-primary/10' : 'bg-surface-container-lowest dark:bg-slate-800 border border-outline-variant/40 rounded-xl hover:border-primary/50 transition-colors'} active:scale-90 flex items-center justify-center font-bold text-[10px]`}
      >
        {isSelected ? id : ''}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* TopAppBar - Restored from original design */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0px_4px_12px_rgba(25,28,29,0.03)] flex items-center px-6 h-16">
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200 rounded-full">
              <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100">arrow_back</span>
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
                <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
            </button>
            <h1 className="font-semibold tracking-tight text-indigo-900 dark:text-indigo-100">Joy tanlash</h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-indigo-900 dark:text-indigo-100 font-medium text-sm">Trip Details</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Passenger</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Payment</span>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-64 px-6 max-w-lg mx-auto min-h-screen">
        {/* Legend Section */}
        <div className="flex justify-center gap-6 mb-10 py-4 bg-surface-container-low dark:bg-slate-800/40 rounded-2xl border dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md border border-outline-variant/30 bg-surface-container-lowest dark:bg-slate-800"></div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant dark:text-slate-400 text-[9px] sm:text-[11px]">BO'SH</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md seat-selected shadow-sm"></div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant dark:text-slate-400 text-[9px] sm:text-[11px]">TANLANGAN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-surface-dim dark:bg-slate-700"></div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant dark:text-slate-400 text-[9px] sm:text-[11px]">BAND</span>
          </div>
        </div>

        {/* Bus Floorplan Container */}
        <div className="relative bg-surface-container-low dark:bg-slate-800/40 rounded-[40px] p-8 shadow-inner border border-white/40 dark:border-slate-700/30">
          {/* Cockpit Area */}
          <div className="flex justify-between items-center mb-12 px-4 border-b border-outline-variant/20 dark:border-slate-700/50 pb-8">
            <div className="w-12 h-12 bg-surface-container-high dark:bg-slate-700 rounded-full flex items-center justify-center text-on-surface-variant dark:text-slate-300">
              <span className="material-symbols-outlined text-3xl">steering_wheel_heat</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-500 opacity-60">KIRISH</span>
              <span className="block w-8 h-1 bg-tertiary-fixed-dim rounded-full mt-1 ml-auto"></span>
            </div>
          </div>

          {/* Seat Grid (2+2 Layout) */}
          <div className="grid grid-cols-5 gap-y-6 items-center max-w-[280px] mx-auto">
            {/* Rows generated based on legacy template */}
            {[1, 2, 3, 4, 5, 6, 7].map((row) => (
              <React.Fragment key={row}>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <Seat id={`${row}A`} isOccupied={row === 1 || row === 5} />
                  <Seat id={`${row}B`} isOccupied={row === 1 || row === 5} />
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <Seat id={`${row}C`} isOccupied={row === 2} />
                  <Seat id={`${row}D`} />
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Rear Section */}
          <div className="mt-12 flex justify-center">
            <div className="h-1.5 w-16 bg-outline-variant/20 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </main>

      {/* Bottom Selection Detail (Bottom Sheet) */}
      <section className="fixed bottom-0 w-full z-50 rounded-t-[32px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0px_-12px_32px_rgba(25,28,29,0.08)] px-8 py-8 pb-safe">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant dark:text-slate-500 mb-1">TANLANGAN JOY</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : '---'}
                </span>
                {selectedSeats.length > 0 && (
                  <span className="bg-tertiary-container/10 dark:bg-indigo-500/10 text-on-tertiary-container dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">DERAZA YONIDA</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant dark:text-slate-500 mb-1">UMUMIY NARX</span>
              <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">${totalPrice}</span>
            </div>
          </div>
          <button 
            disabled={selectedSeats.length === 0}
            onClick={() => router.push(`/booking?seats=${selectedSeats.join(',')}&price=${totalPrice}&from=${from}&to=${to}`)}
            className="w-full flex items-center justify-center gap-3 seat-selected text-white rounded-2xl px-6 py-5 font-bold text-sm tracking-[0.05em] uppercase shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            DAVOM ETISH <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
}
