'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabase';

interface Trip {
  id: number;
  from_city: string;
  to_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  bus_type: string;
  available_seats: number;
  features: string[];
}

function SearchResultsContent() {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(true);
  const [buses, setBuses] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`
        );
        if (!res.ok) throw new Error('API xatolik qaytardi');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setBuses(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Noma\'lum xatolik');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrips();
  }, [from, to, date]);

  const getDuration = (dep: string, arr: string) => {
    const diff = new Date(arr).getTime() - new Date(dep).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours} soat${mins > 0 ? ` ${mins} daqiqa` : ''}`;
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  const isVIP = (type: string) => type?.toLowerCase().includes('vip');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-slate-400 font-semibold tracking-widest uppercase text-xs">
          Eng yaxshi reyslar izlanmoqda...
        </p>
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
              {from || 'Kelib chiqish'} → {to || 'Borish joyi'}
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

        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-red-400 text-4xl">error</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-200">Xatolik yuz berdi</h3>
              <p className="text-slate-500 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wide"
            >
              Orqaga qaytish
            </button>
          </div>
        ) : buses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-600 text-4xl">directions_bus</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-200">Reyslar topilmadi</h3>
              <p className="text-slate-500 text-sm mt-1">
                {from} → {to} yo'nalishi uchun {date} kuni reys mavjud emas
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wide"
            >
              Boshqa kun tanlash
            </button>
          </div>
        ) : (
          buses.map((bus) => {
            const vip = isVIP(bus.bus_type);
            return (
              <div
                key={bus.id}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg"
              >
                {/* ── BADGE ROW ── */}
                {vip && (
                  <div className="flex items-center gap-2 px-4 pt-3 pb-0">
                    <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                      <span className="material-symbols-outlined text-[12px]">diamond</span>
                      VIP Luxe
                    </span>
                    {bus.available_seats < 10 && (
                      <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                        Talab yuqori
                      </span>
                    )}
                  </div>
                )}

                {/* ── ROUTE ROW ── */}
                <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                  {/* Departure */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-2xl font-black text-white tracking-tight leading-none">
                      {formatTime(bus.departure_time)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-1 truncate">
                      {bus.from_city.toUpperCase()} TERMINALI
                    </span>
                  </div>

                  {/* Middle */}
                  <div className="flex flex-col items-center flex-shrink-0 gap-1 px-2">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">
                      {getDuration(bus.departure_time, bus.arrival_time)}
                    </span>
                    <div className="flex items-center gap-1 w-full">
                      <div className="h-px w-8 bg-slate-600 rounded-full" />
                      <span className="material-symbols-outlined text-indigo-400 text-base">directions_bus</span>
                      <div className="h-px w-8 bg-slate-600 rounded-full" />
                    </div>
                    <span className="text-[9px] text-slate-600 font-semibold">{bus.bus_type}</span>
                  </div>

                  {/* Arrival */}
                  <div className="flex flex-col items-end min-w-0">
                    <span className="text-2xl font-black text-white tracking-tight leading-none">
                      {formatTime(bus.arrival_time)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-1 truncate text-right">
                      {bus.to_city.toUpperCase()} TERMINALI
                    </span>
                  </div>
                </div>

                {/* ── AMENITIES ── */}
                {bus.features && bus.features.length > 0 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {bus.features.map((f, i) => (
                      <span key={i} className="text-[9px] bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* ── DIVIDER ── */}
                <div className="mx-4 border-t border-slate-700/60" />

                {/* ── PRICE + ACTION ROW ── */}
                <div className="px-4 py-4 flex items-end justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Narx</span>
                    <span className="text-xl font-black text-white">
                      {Number(bus.price).toLocaleString('uz-UZ')} so'm
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${bus.available_seats < 10 ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`}>
                      {bus.available_seats < 10
                        ? `⚡ Faqat ${bus.available_seats} ta joy`
                        : `${bus.available_seats} ta joy mavjud`}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/seats-3d?from=${encodeURIComponent(bus.from_city)}&to=${encodeURIComponent(bus.to_city)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(formatTime(bus.departure_time))}&price=${bus.price}&tripId=${bus.id}`
                      )
                    }
                    className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-700/30"
                  >
                    Joy tanlash
                  </button>
                </div>
              </div>
            );
          })
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
          onClick={() => router.push('/trips')}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">confirmation_number</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Reyslar</span>
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
