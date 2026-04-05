'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function SearchResults() {
  const { toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const from = searchParams.get('from') || 'London';
  const to = searchParams.get('to') || 'Paris';
  const date = searchParams.get('date') || '05-Apr, 2026';

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const buses = [
    { id: 1, operator: 'Ecolines Express', type: 'Ikki qavatli', departure: '08:00', arrival: '14:30', duration: '6s 30d', price: 45, isFastest: true, seats: 12 },
    { id: 2, operator: 'BusGo Premium', type: 'Biznes klass', departure: '10:15', arrival: '17:45', duration: '7s 30d', price: 65, isBest: true, seats: 4 },
    { id: 3, operator: 'EuroLink', type: 'Standart', departure: '13:45', arrival: '22:15', duration: '8s 30d', price: 35, seats: 28 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-outline-variant / 20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-bold tracking-widest uppercase text-xs animate-pulse">Eng yaxshi safarlarni qidirmoqdamiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8 transition-colors duration-300">
      {/* Search Result Header */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-on-surface">{from}</span>
              <span className="material-symbols-outlined text-xs text-outline">trending_flat</span>
              <span className="text-sm font-black text-on-surface">{to}</span>
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{date}</p>
          </div>
          
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-primary dark:text-yellow-400 select-none">light_mode</span>
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-on-surface-variant">3 ta reys topildi</p>
          <button className="flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">tune</span> Filter
          </button>
        </div>

        <div className="space-y-4">
          {buses.map(bus => (
            <div 
              key={bus.id} 
              onClick={() => router.push(`/seats/${bus.id}?from=${from}&to=${to}&price=${bus.price}`)}
              className="bg-surface rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-outline-variant/30 hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-extrabold text-on-surface text-lg leading-tight mb-1">{bus.operator}</h4>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">directions_bus</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider">{bus.type} • {bus.seats} ta bo'sh joy</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black text-primary">${bus.price}</p>
                   <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase">Bir kishi uchun</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-dashed border-outline-variant/30">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-on-surface leading-none mb-1">{bus.departure}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">{from}</span>
                </div>

                <div className="flex-1 flex flex-col items-center px-4">
                  <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase mb-2 tracking-tighter">{bus.duration}</span>
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/10 via-primary to-primary/10"></div>
                    <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-on-surface leading-none mb-1">{bus.arrival}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">{to}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {bus.isFastest && <span className="bg-tertiary-fixed-dim/20 text-on-tertiary-fixed text-[9px] font-black uppercase px-2 py-1 rounded-full">Eng tezkor</span>}
                  {bus.isBest && <span className="bg-secondary-container text-on-secondary-container text-[9px] font-black uppercase px-2 py-1 rounded-full">Eng yaxshi</span>}
                </div>
                <button className="text-xs font-black text-primary group-hover:underline flex items-center gap-1">
                   JOY TANLASH <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
           <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
              <div>
                <p className="text-on-surface font-bold text-sm">Xavfsiz sayohat kafolati</p>
                <p className="text-on-surface-variant text-[10px] font-medium leading-tight">Barcha tashuvchilarimiz xavfsizlik va xizmat ko'rsatish bo'yicha qattiq tekshiruvdan o'tgan.</p>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
