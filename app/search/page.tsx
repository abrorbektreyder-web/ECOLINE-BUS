'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabase';

function SearchResultsContent() {
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
            let tripDate = new Date(date);
            if (isNaN(tripDate.getTime())) tripDate = new Date();
            const today = new Date();
            const daysDiff = Math.ceil((tripDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            const isWeekend = tripDate.getDay() === 0 || tripDate.getDay() === 6;
            
            let priceMultiplier = 1.0;
            if (daysDiff <= 3 && daysDiff >= 0) priceMultiplier += 0.15;
            if (isWeekend) priceMultiplier += 0.20;

            setBuses(tripsData.map(t => {
              const finalPrice = Math.round(t.base_price * priceMultiplier);
              const isHighDemand = priceMultiplier > 1.0;
              
              return {
                id: t.id,
                operator: t.buses.plate_number,
                type: t.buses.bus_type,
                departure: new Date(t.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                arrival: new Date(t.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: '8 SOAT 15 DAQIQA',
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
  }, [from, to, date]);

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
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm flex flex-col items-center pt-2 pb-2">
        <div className="w-full flex justify-between items-center px-6 h-12">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100">arrow_back</span>
            </button>
            <div className="flex flex-col items-center">
                <h1 className="font-inter tracking-tighter font-extrabold text-sm text-indigo-900 dark:text-indigo-100 uppercase">{from} → {to}</h1>
                <p className="text-[10px] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-widest mt-0.5">{date} · {buses.length} TA REYS TOPILDI</p>
            </div>
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className={`material-symbols-outlined transition-all transform ${theme === 'dark' ? 'text-yellow-400 rotate-0' : 'text-indigo-900 rotate-45'}`}>
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
            </button>
        </div>
      </header>

      <main className="pt-24 px-4 space-y-6 max-w-2xl mx-auto">
        {buses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 bg-surface-container-high dark:bg-slate-800 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-300 transform scale-150">directions_bus</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-xl tracking-tight text-primary dark:text-indigo-200">Reyslar topilmadi</h3>
              <p className="text-on-surface-variant dark:text-slate-500 text-sm max-w-xs font-medium">Uzr, tanlangan yo'nalish bo'yicha hozircha reyslar mavjud emas.</p>
            </div>
            <button onClick={() => router.back()} className="px-8 py-3 bg-primary dark:bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">QADAM ORQAGA</button>
          </div>
        ) : (
          buses.map((bus, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-[0px_4px_24px_rgba(25,28,29,0.04)] border border-surface-container-high dark:border-slate-700 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            >
              {bus.isVIP && (
                <div className="absolute top-0 right-10 bg-indigo-100 dark:bg-indigo-500 text-indigo-900 dark:text-white px-4 py-1 rounded-b-xl text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">VIP LUXE</div>
              )}
              
              {bus.isHighDemand && (
                <div className="absolute top-0 left-10 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-4 py-1 rounded-b-xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] animate-pulse">local_fire_department</span>
                  TALAB YUQORI
                </div>
              )}

              <div className="flex justify-between items-start mb-6 pt-4">
                <div className="space-y-1">
                  <p className="text-2xl font-black text-primary dark:text-indigo-200 tracking-tighter">{bus.departure}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-widest">{bus.fromStation}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4 self-center space-y-1 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[9px] font-black tracking-[0.1em]">{bus.duration}</span>
                    <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                        <span className="material-symbols-outlined absolute bg-white dark:bg-slate-800 px-2 text-primary dark:text-indigo-400 text-sm">directions_bus</span>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-2xl font-black text-primary dark:text-indigo-200 tracking-tighter">{bus.arrival}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-widest">{bus.toStation}</p>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-slate-100 dark:border-slate-700 pt-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em]">NARX</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-black text-primary dark:text-indigo-100 tracking-tighter">${bus.price}</p>
                    {bus.originalPrice && (
                      <span className="text-sm font-bold text-slate-400 dark:text-slate-600 line-through tracking-tighter">${bus.originalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <p className="text-[10px] font-extrabold px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-primary dark:text-indigo-200 tracking-widest">FAQAT {bus.seats} TA JOY QOLDI</p>
                    <button 
                        onClick={() => router.push(`/seats-3d?from=${from}&to=${to}&date=${date}&price=${bus.price}&tripId=${bus.id}`)}
                        className="bg-indigo-900 dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg active:scale-95 transition-all"
                    >
                        JOY TANLASH
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <nav className="fixed bottom-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-t-3xl shadow-[0px_-4px_12px_rgba(0,0,0,0.03)] flex justify-around items-center px-10 h-20">
        <button onClick={() => router.push('/')} className="flex flex-col items-center text-slate-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors">
            <span className="material-symbols-outlined mb-1">home</span>
            <span className="text-[10px] font-bold tracking-widest">BOSH</span>
        </button>
        <div className="w-16 h-16 bg-primary dark:bg-indigo-600 rounded-3xl -mt-10 flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-45 group">
            <span className="material-symbols-outlined -rotate-45 group-hover:scale-110 transition-transform">search</span>
        </div>
        <button onClick={() => router.push('/wallet/cashback')} className="flex flex-col items-center text-slate-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors">
            <span className="material-symbols-outlined mb-1">loyalty</span>
            <span className="text-[10px] font-bold tracking-widest">BONUS</span>
        </button>
      </nav>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-bold tracking-widest uppercase text-xs">Yuklanmoqda...</p>
      </div>
    }>
      <Suspense fallback={null}>
        <SearchResultsContent />
      </Suspense>
    </Suspense>
  );
}
