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
    const isSelected = selectedSeats.includes(id);
    
    // Seat Colors logic:
    // Selected: Blue (bg-indigo-600)
    // Occupied: Red (bg-rose-500)
    // Free: Gray (bg-slate-200 / dark:bg-slate-700)
    
    let seatClasses = "aspect-square rounded-xl transition-all duration-300 flex items-center justify-center font-bold text-xs";
    
    if (isOccupied) {
      seatClasses += " bg-rose-500 text-white cursor-not-allowed";
    } else if (isSelected) {
      seatClasses += " bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-500/20 active:scale-95 scale-105";
    } else {
      seatClasses += " bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-90 border border-outline-variant/30";
    }

    return (
      <button 
        onClick={() => !isOccupied && toggleSeat(id)}
        disabled={isOccupied}
        className={seatClasses}
      >
        {!isOccupied && isSelected ? id : ''}
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
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">BO'SH</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-indigo-600 shadow-sm"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">TANLANGAN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-rose-500"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">BAND</span>
          </div>
        </div>

        {/* Bus Floorplan Container */}
        <div className="relative bg-surface-container-low dark:bg-slate-800/40 rounded-[40px] p-8 shadow-inner border border-white/40 dark:border-slate-700/30">
          {/* Cockpit Area */}
          <div className="flex justify-between items-center mb-8 px-4 border-b border-outline-variant/10 dark:border-slate-700/30 pb-6">
            <div className="w-12 h-12 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <span className="material-symbols-outlined text-2xl">airline_seat_recline_extra</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-500 opacity-60 italic">Driver Area</span>
              <div className="flex items-center gap-1 mt-1 justify-end">
                <span className="block w-6 h-1 bg-tertiary-fixed-dim rounded-full"></span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-slate-500">Entrance</span>
              </div>
            </div>
          </div>

          {/* Seat Grid (2+2 Layout) */}
          <div className="grid grid-cols-5 gap-y-4 items-center max-w-[280px] mx-auto">
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
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl px-6 py-5 font-extrabold text-sm tracking-[0.1em] uppercase shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            DAVOM ETISH <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
}
