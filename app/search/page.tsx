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
          const { data: tripsData } = await supabase
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
            if (isWeekend) priceMultiplier += 0.10;

            setBuses(tripsData.map(t => {
              const finalPrice = Math.round((t.base_price || 120) * priceMultiplier);
              const isHighDemand = priceMultiplier > 1.0;
              return {
                id: t.id,
                operator: t.buses?.plate_number || 'BusGo Express',
                type: t.buses?.bus_type || 'Standard',
                departure: new Date(t.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                arrival: new Date(t.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: '8 soat 15 daqiqa',
                fromStation: from.toUpperCase() + ' MARKAZIY',
                toStation: to.toUpperCase() + ' ASOSIY',
                price: finalPrice,
                originalPrice: isHighDemand ? Math.round(t.base_price || 120) : null,
                isHighDemand,
                seats: t.buses?.total_seats || 18,
                isVIP: (t.buses?.bus_type || '').includes('VIP')
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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-slate-400 font-semibold tracking-widest uppercase text-xs">Eng yaxshi reyslar izlanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased pb-28">
      
      {/* ── HEADER ── */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-300">arrow_back</span>
          </button>

          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-sm text-white uppercase tracking-widest">
              {from} → {to}
            </h1>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
              {date} · {buses.length} ta reys topildi
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors"
          >
            <span className={`material-symbols-outlined text-lg ${theme === 'dark' ? 'text-yellow-400' : 'text-indigo-300'}`}>
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="pt-20 pb-6 px-4 max-w-2xl mx-auto space-y-4">

        {buses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-600 text-4xl">directions_bus</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-200">Reyslar topilmadi</h3>
              <p className="text-slate-500 text-sm mt-1">Tanlangan yo'nalish uchun hozircha reys mavjud emas</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wide"
            >
              Orqaga qaytish
            </button>
          </div>
        ) : (
          buses.map((bus, idx) => (
            <div
              key={idx}
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg"
            >
              {/* ── BADGE ROW ── */}
              {(bus.isHighDemand || bus.isVIP) && (
                <div className="flex items-center gap-2 px-4 pt-3 pb-0">
                  {bus.isHighDemand && (
                    <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                      Talab yuqori
                    </span>
                  )}
                  {bus.isVIP && (
                    <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[12px]">diamond</span>
                      VIP Luxe
                    </span>
                  )}
                </div>
              )}

              {/* ── ROUTE ROW ── */}
              <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                {/* Departure */}
                <div className="flex flex-col min-w-0">
                  <span className="text-2xl font-black text-white tracking-tight leading-none">{bus.departure}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-1 truncate">{bus.fromStation}</span>
                </div>

                {/* Middle */}
                <div className="flex flex-col items-center flex-shrink-0 gap-1 px-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">{bus.duration}</span>
                  <div className="flex items-center gap-1 w-full">
                    <div className="h-px w-8 bg-slate-600 rounded-full" />
                    <span className="material-symbols-outlined text-indigo-400 text-base">directions_bus</span>
                    <div className="h-px w-8 bg-slate-600 rounded-full" />
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex flex-col items-end min-w-0">
                  <span className="text-2xl font-black text-white tracking-tight leading-none">{bus.arrival}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-1 truncate text-right">{bus.toStation}</span>
                </div>
              </div>

              {/* ── DIVIDER ── */}
              <div className="mx-4 border-t border-slate-700/60" />

              {/* ── PRICE + ACTION ROW ── */}
              <div className="px-4 py-4 flex items-end justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Narx</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white">${bus.price}</span>
                    {bus.originalPrice && (
                      <span className="text-xs text-slate-600 line-through">${bus.originalPrice}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold mt-1 ${bus.seats < 10 ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`}>
                    {bus.seats < 10 ? `⚡ Faqat ${bus.seats} ta joy` : `${bus.seats} ta joy mavjud`}
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/seats-3d?from=${from}&to=${to}&date=${date}&price=${bus.price}&tripId=${bus.id}`)}
                  className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-700/30"
                >
                  Joy tanlash
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 w-full z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center h-20 px-6">
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Bosh</span>
        </button>

        <div className="flex flex-col items-center gap-1 text-indigo-400 transition-colors">
          <span className="material-symbols-outlined text-xl">search</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Qidirish</span>
        </div>

        <button
          onClick={() => router.push('/wallet/cashback')}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">loyalty</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Bonus</span>
        </button>
      </nav>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-slate-500 font-semibold tracking-widest uppercase text-xs">Yuklanmoqda...</p>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
