'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import BottomNav from '@/components/BottomNav';

export default function MyTrips() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const activeTrips = [
    {
      id: 'B-2934',
      from: 'Tashkent',
      to: 'Guangzhou',
      date: '12 Aprel',
      time: '08:00',
      status: 'Tasdiqlangan',
      gate: 'A-12',
    }
  ];

  const pastTrips = [
    {
      id: 'B-1022',
      from: 'Paris',
      to: 'London',
      date: '2 Mart',
      time: '14:30',
      status: 'Tugalangan',
    },
    {
      id: 'B-0982',
      from: 'Berlin',
      to: 'Paris',
      date: '15 Fevral',
      time: '09:15',
      status: 'Tugalangan',
    }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100 font-bold">arrow_back</span>
          </button>
          <h1 className="font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight text-lg">Mening Safarlarim</h1>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
            <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
        </button>
      </header>

      <main className="px-6 pt-6 max-w-2xl mx-auto space-y-8">
        {/* Active Trips */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em]">KELGUSI SAFARLAR</h2>
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
          </div>
          
          {activeTrips.map((trip) => (
            <div key={trip.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-[0px_4px_12px_rgba(25,28,29,0.03)] border border-outline-variant/20 dark:border-slate-700/50 relative overflow-hidden group">
               <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{trip.id}</span>
                 </div>
                 <span className="text-[10px] font-bold text-tertiary dark:text-emerald-400 flex items-center gap-1">
                   <span className="material-symbols-outlined text-xs">check_circle</span>
                   {trip.status}
                 </span>
               </div>

               <div className="flex items-center justify-between relative mb-6 px-2">
                  <div className="flex flex-col">
                     <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">{trip.from}</span>
                     <span className="text-xs font-medium text-on-surface-variant/60 dark:text-slate-500">{trip.date}, {trip.time}</span>
                  </div>
                  
                  <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20">
                     <span className="material-symbols-outlined text-indigo-900 dark:text-slate-400">directions_bus</span>
                     <div className="w-12 h-[1px] bg-indigo-900 dark:bg-slate-400 border-t border-dashed"></div>
                  </div>

                  <div className="flex flex-col text-right">
                     <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">{trip.to}</span>
                     <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Terminal {trip.gate}</span>
                  </div>
               </div>

               <button className="w-full py-4 bg-indigo-900 dark:bg-indigo-600 text-white rounded-3xl font-bold text-sm tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">qr_code_2</span>
                  CHIPTANI KO'RISH
               </button>
            </div>
          ))}
        </section>

        {/* Reys History */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2">TARIX</h2>
          <div className="space-y-3">
             {pastTrips.map((trip) => (
                <div key={trip.id} className="bg-white dark:bg-slate-800/50 rounded-3xl p-5 border border-outline-variant/10 dark:border-white/5 flex items-center justify-between group grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container dark:bg-slate-700 flex items-center justify-center">
                         <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400">history</span>
                      </div>
                      <div className="flex flex-col">
                         <div className="flex items-center gap-2">
                            <span className="font-black text-indigo-900 dark:text-indigo-100 text-sm">{trip.from} - {trip.to}</span>
                         </div>
                         <span className="text-[10px] font-medium text-on-surface-variant/60 dark:text-slate-500">{trip.date} • {trip.status}</span>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-outline/30 dark:text-slate-600">chevron_right</span>
                </div>
             ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
