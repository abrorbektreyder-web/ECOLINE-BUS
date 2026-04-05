'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function SearchResults() {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const from = searchParams.get('from') || 'Toshkent';
  const to = searchParams.get('to') || 'Guanchjou';
  const date = searchParams.get('date') || '24-okt, 2023';

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const buses = [
    { 
      id: 1, 
      operator: 'VIP EKSKLYUZIV', 
      type: 'A2 Platforma', 
      departure: '08:00', 
      arrival: '16:15', 
      duration: '8 SOAT 15 DAQIQA', 
      fromStation: from.toUpperCase() + ' MARKAZIY',
      toStation: to.toUpperCase() + ' ASOSIY',
      toPlatform: 'G1 Platforma',
      price: 120, 
      seats: 12,
      isVIP: true
    },
    { 
      id: 2, 
      operator: 'KOMFORT KLASS', 
      type: 'B1 Platforma', 
      departure: '10:30', 
      arrival: '19:00', 
      duration: '8 SOAT 30 DAQIQA', 
      fromStation: from.toUpperCase() + ' MARKAZIY',
      toStation: to.toUpperCase() + ' ASOSIY',
      toPlatform: 'G2 Platforma',
      price: 85, 
      seats: 24
    },
    { 
      id: 3, 
      operator: 'TEJAMKOR EKONOM', 
      type: 'C3 Platforma', 
      departure: '14:00', 
      arrival: '23:00', 
      duration: '9 SOAT 00 DAQIQA', 
      fromStation: from.toUpperCase() + ' MARKAZIY',
      toStation: to.toUpperCase() + ' ASOSIY',
      toPlatform: 'G4 Platforma',
      price: 50, 
      seats: 4,
      isCritical: true
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-bold tracking-widest uppercase text-xs animate-pulse">Eng yaxshi safarlarni qidirmoqdamiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface dark:bg-slate-900 dark:text-slate-100 font-body antialiased pb-24 transition-colors duration-300">
      {/* Header / Nav - Restored from legacy design */}
      <header className="sticky top-0 z-50 bg-surface/80 dark:bg-slate-950/80 backdrop-blur-[24px] border-b border-outline-variant/20">
        <div className="flex items-center px-4 py-4 max-w-2xl mx-auto w-full relative">
          <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center text-on-surface dark:text-slate-400 rounded-full hover:bg-surface-container-high transition-colors z-10">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          
          <div className="absolute inset-x-0 flex flex-col items-center pointer-events-none">
            <h1 className="text-[1.125rem] font-bold leading-tight tracking-[-0.015em] text-on-surface dark:text-slate-100">{from} - {to}</h1>
          </div>
          
          <div className="flex-1"></div>

          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container-high dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95 z-10">
              <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 pt-6 pb-8 flex flex-col gap-8">
        {/* Search Metadata */}
        <section className="flex flex-col gap-2">
          <h2 className="text-on-surface-variant dark:text-slate-500 text-sm font-semibold tracking-wider uppercase">MAVJUD YO'NALISHLAR</h2>
          <div className="flex items-center justify-between">
            <p className="text-on-surface dark:text-slate-300 text-base font-medium">3 ta variant topildi</p>
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-container-high dark:bg-slate-800 px-4">
              <p className="text-on-surface dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">ENG TEZKOR YO'NALISH</p>
            </div>
          </div>
        </section>

        {/* Journey Cards Container */}
        <div className="flex flex-col gap-6">
          {buses.map((bus, idx) => (
            <React.Fragment key={bus.id}>
              <article 
                onClick={() => router.push(`/seats/${bus.id}?from=${from}&to=${to}&price=${bus.price}`)}
                className={`bg-surface-container-lowest dark:bg-slate-800 rounded-xl p-6 flex flex-col gap-6 shadow-[0px_4px_12px_rgba(25,28,29,0.03),0px_12px_32px_rgba(25,28,29,0.05)] relative overflow-hidden border dark:border-slate-700/50 cursor-pointer active:scale-[0.99] transition-transform`}
              >
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 ${bus.isVIP ? 'bg-primary text-on-primary' : 'bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-slate-300'} text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-lg`}>
                  {bus.operator}
                </div>

                <div className="flex items-start gap-4 pt-2">
                  {/* Timeline */}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <span className="text-on-surface dark:text-slate-100 text-lg font-bold">{bus.departure}</span>
                    <div className={`w-1 h-16 ${bus.isVIP ? 'bg-tertiary-fixed-dim' : 'bg-surface-container-high dark:bg-slate-700'} rounded-full`}></div>
                    <span className="text-on-surface dark:text-slate-100 text-lg font-bold">{bus.arrival}</span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-1 gap-6 pt-1">
                    <div className="flex flex-col">
                      <span className="text-on-surface dark:text-slate-100 text-base font-bold">{bus.fromStation}</span>
                      <span className="text-on-surface-variant dark:text-slate-400 text-sm">{bus.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span className="text-sm font-medium uppercase">{bus.duration}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-on-surface dark:text-slate-100 text-base font-bold">{bus.toStation}</span>
                      <span className="text-on-surface-variant dark:text-slate-400 text-sm">{bus.toPlatform}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-col items-end gap-1 pt-1">
                    <span className={`${bus.isVIP ? 'text-primary dark:text-indigo-400' : 'text-on-surface dark:text-slate-100'} text-2xl font-bold tracking-tight`}>${bus.price}</span>
                    <span className={`${bus.isCritical ? 'text-error animate-pulse' : 'text-on-surface-variant dark:text-slate-400'} text-xs font-medium`}>
                      {bus.isCritical ? `Faqat ${bus.seats} ta joy qoldi` : `${bus.seats} ta joy qoldi`}
                    </span>
                  </div>
                </div>

                <button className={`w-full h-14 rounded-xl ${bus.isVIP ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary' : 'bg-surface-container-high dark:bg-slate-700 text-on-surface dark:text-slate-100 hover:bg-surface-dim'} text-sm font-bold uppercase tracking-[0.05em] transition-all`}>
                  JOY TANLASH
                </button>
              </article>

              {idx === 0 && (
                <div className="bg-surface-container-low dark:bg-slate-800/60 rounded-xl p-4 flex items-center justify-between border dark:border-slate-700/30">
                  <div className="flex flex-col">
                    <span className="text-on-surface dark:text-slate-200 font-bold text-sm">VIP lyuks darajasini his eting</span>
                    <span className="text-on-surface-variant dark:text-slate-400 text-xs">Keng o'rindiqlar va ovqatlanish</span>
                  </div>
                  <button className="text-primary dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">YANGILASH</button>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </main>
    </div>
  );
}
