'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';

interface Booking {
  id: string;
  trip_id: string;
  passenger_name: string;
  seat_number: number;
  status: string;
  total_price: number;
  payment_method: string | null;
  created_at: string;
  trips?: {
    from_city: string;
    to_city: string;
    departure_time: string;
    arrival_time: string;
    bus_type: string;
  };
}

export default function TripsPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState<'active' | 'past'>('active');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        // Try joining with trips table
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            trips (
              from_city,
              to_city,
              departure_time,
              arrival_time,
              bus_type
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Bookings fetch error:', error.message);
          setBookings([]);
        } else {
          setBookings(data || []);
        }
      } catch (err) {
        console.error(err);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const now = new Date();

  const activeBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (!b.trips?.departure_time) return b.status === 'paid';
    return new Date(b.trips.departure_time) >= now;
  });

  const pastBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return true;
    if (!b.trips?.departure_time) return b.status !== 'paid';
    return new Date(b.trips.departure_time) < now;
  });

  const displayTrips = activeTab === 'active' ? activeBookings : pastBookings;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'To\'langan';
      case 'pending': return 'Kutilmoqda';
      case 'cancelled': return 'Bekor qilingan';
      default: return status;
    }
  };

  const getStatusColors = (status: string, isActive: boolean) => {
    if (status === 'cancelled') return { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' };
    if (isActive) return { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' };
    return { bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' };
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100 font-bold">arrow_back</span>
          </button>
          <h1 className="font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight text-lg">{t('my_trips')}</h1>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
          <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
        </button>
      </header>

      <main className="px-6 pt-6 max-w-2xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="bg-surface-container-low dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-on-surface-variant/60 dark:text-slate-500'}`}
          >
            Faol ({activeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'past' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-on-surface-variant/60 dark:text-slate-500'}`}
          >
            O'tgan ({pastBookings.length})
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Yuklanmoqda...</p>
          </div>
        ) : displayTrips.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-300 dark:text-indigo-700 text-4xl">confirmation_number</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-indigo-900 dark:text-white">
                {activeTab === 'active' ? 'Faol reyslar yo\'q' : 'O\'tgan reyslar yo\'q'}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {activeTab === 'active'
                  ? 'Chipta sotib olish uchun qidiruvdan boshlang'
                  : 'Siz hali birorta reys qilmagansiz'}
              </p>
            </div>
            {activeTab === 'active' && (
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wide"
              >
                Reys qidirish
              </button>
            )}
          </div>
        ) : (
          /* Trips List */
          <div className="space-y-4">
            {displayTrips.map((booking) => {
              const isActive = activeTab === 'active';
              const statusColors = getStatusColors(booking.status, isActive);
              const trip = booking.trips;

              return (
                <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-outline-variant/20 dark:border-slate-700/50 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        #{booking.id.slice(0, 8).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-indigo-900 dark:text-white">
                          {trip?.from_city || '—'}
                        </h3>
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-sm">arrow_forward</span>
                        <h3 className="text-xl font-black text-indigo-900 dark:text-white">
                          {trip?.to_city || '—'}
                        </h3>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${statusColors.bg}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColors.text}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 py-4 border-y border-dashed border-outline-variant/30 dark:border-slate-700/50">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-widest">Sana & Vaqt</span>
                      <p className="font-bold text-sm">
                        {trip?.departure_time ? formatDate(trip.departure_time) : formatDate(booking.created_at)}
                        {trip?.departure_time ? ` • ${formatTime(trip.departure_time)}` : ''}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-widest">Joy & Narx</span>
                      <p className="font-bold text-sm">
                        #{booking.seat_number} • {Number(booking.total_price).toLocaleString()} so'm
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isActive && (
                      <button
                        onClick={() => router.push(`/trips/track/${booking.trip_id}`)}
                        className="flex-1 py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {t('track_bus')}
                      </button>
                    )}
                    <button
                      onClick={() =>
                        router.push(
                          `/ticket?from=${trip?.from_city || ''}&to=${trip?.to_city || ''}&date=${encodeURIComponent(trip?.departure_time ? formatDate(trip.departure_time) : '')}&time=${encodeURIComponent(trip?.departure_time ? formatTime(trip.departure_time) : '')}&seats=${booking.seat_number}&name=${encodeURIComponent(booking.passenger_name)}&orderId=${booking.id.slice(0, 8).toUpperCase()}`
                        )
                      }
                      className="flex-1 py-4 rounded-2xl bg-surface-container dark:bg-slate-700 text-on-surface dark:text-white font-black uppercase tracking-widest text-[10px] hover:bg-surface-container-high dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">confirmation_number</span>
                      Chipta ko'rish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
