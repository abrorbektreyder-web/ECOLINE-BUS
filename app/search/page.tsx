'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabase';

export default function SearchResults() {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const from = searchParams.get('from') || 'Toshkent';
  const to = searchParams.get('to') || 'Guanchjou';
  const date = searchParams.get('date') || '24-okt, 2023';

  const [isLoading, setIsLoading] = useState(true);
  const [buses, setBuses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTrips() {
      setIsLoading(true);
      try {
        // Find city IDs
        const { data: citiesData } = await supabase
          .from('cities')
          .select('id, name')
          .or(`name.ilike.%${from}%,name.ilike.%${to}%`);

        const origin = citiesData?.find(c => c.name.toLowerCase().includes(from.toLowerCase()));
        const destination = citiesData?.find(c => c.name.toLowerCase().includes(to.toLowerCase()));

        if (origin && destination) {
          const { data: tripsData, error } = await supabase
            .from('trips')
            .select(`
              *,
              buses (*),
              origin:cities!origin_id (name),
              destination:cities!destination_id (name)
            `)
            .eq('origin_id', origin.id)
            .eq('destination_id', destination.id);

          if (tripsData) {
            // Dynamic Pricing Logic (V3 Killer Feature)
            let tripDate = new Date(date);
            if (isNaN(tripDate.getTime())) tripDate = new Date(); // fallback
            const today = new Date();
            const daysDiff = Math.ceil((tripDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            const isWeekend = tripDate.getDay() === 0 || tripDate.getDay() === 6;
            
            let priceMultiplier = 1.0;
            if (daysDiff <= 3 && daysDiff >= 0) priceMultiplier += 0.15; // 15% last-minute surge
            if (isWeekend) priceMultiplier += 0.20; // 20% weekend surge

            setBuses(tripsData.map(t => {
              const finalPrice = Math.round(t.base_price * priceMultiplier);
              const isHighDemand = priceMultiplier > 1.0;
              
              return {
                id: t.id,
                operator: t.buses.plate_number,
                type: t.buses.bus_type,
                departure: new Date(t.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                arrival: new Date(t.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: '8 SOAT 15 DAQIQA', // Mock duration calculation
                fromStation: from.toUpperCase() + ' MARKAZIY',
                toStation: to.toUpperCase() + ' ASOSIY',
                price: finalPrice,
                originalPrice: isHighDemand ? t.base_price : null,
                isHighDemand,
                seats: t.buses.total_seats,
                isVIP: t.buses.bus_type.includes('VIP')
              };
            }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrips();
  }, [from, to]);

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

                  {/* Pricing (Dynamic Pricing V3) */}
                  <div className="flex flex-col items-end gap-1 pt-1">
                    {bus.isHighDemand && (
                      <div className="flex items-center gap-1 bg-error/10 dark:bg-error/20 px-2 py-0.5 rounded text-[10px] text-error font-extrabold uppercase animate-pulse">
                        <span className="material-symbols-outlined text-[12px]">trending_up</span>
                        Talab yuqori
                      </div>
                    )}
                    <span className={`${bus.isVIP ? 'text-primary dark:text-indigo-400' : 'text-on-surface dark:text-slate-100'} text-2xl font-bold tracking-tight`}>
                      {bus.originalPrice && <span className="text-sm line-through text-on-surface-variant/50 mr-1 opacity-70">${bus.originalPrice}</span>}
                      ${bus.price}
                    </span>
                    <span className={`${bus.seats < 10 ? 'text-error animate-pulse' : 'text-on-surface-variant dark:text-slate-400'} text-xs font-medium`}>
                      {bus.seats < 10 ? `Faqat ${bus.seats} ta joy qoldi` : `${bus.seats} ta joy qoldi`}
                    </span>
                  </div>
                </div>

                <button onClick={() => router.push('/seats-3d')} className={`w-full h-14 rounded-xl ${bus.isVIP ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary' : 'bg-surface-container-high dark:bg-slate-700 text-on-surface dark:text-slate-100 hover:bg-surface-dim'} text-sm font-bold uppercase tracking-[0.05em] transition-all`}>
                  JOY TANLASH (3D)
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
