'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import BottomNav from '@/components/BottomNav';

export default function TripsPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab ] = React.useState<'active' | 'past'>('active');

  const trips = {
    active: [
      {
        id: 'TRS-001',
        from: 'Toshkent',
        to: 'Buxoro',
        date: '2026-04-06',
        time: '08:30',
        bus: 'Premium Comfort',
        seat: '12A',
        status: 'On Time',
        price: '150,000'
      }
    ],
    past: [
      {
        id: 'TRS-000',
        from: 'Samarqand',
        to: 'Toshkent',
        date: '2026-03-28',
        time: '14:00',
        bus: 'Eco Standard',
        seat: '05C',
        status: 'Completed',
        price: '85,000'
      }
    ]
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
            Active
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'past' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-on-surface-variant/60 dark:text-slate-500'}`}
          >
            Past
          </button>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {trips[activeTab].map((trip) => (
            <div key={trip.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-outline-variant/20 dark:border-slate-700/50 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{trip.id}</span>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-indigo-900 dark:text-white">{trip.from}</h3>
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-sm">arrow_forward</span>
                    <h3 className="text-xl font-black text-indigo-900 dark:text-white">{trip.to}</h3>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full ${trip.status === 'Completed' ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-emerald-50 dark:bg-emerald-900/30'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${trip.status === 'Completed' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{trip.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-4 border-y border-dashed border-outline-variant/30 dark:border-slate-700/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-widest">Date & Time</span>
                  <p className="font-bold text-sm">{trip.date} • {trip.time}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-widest">Bus & Seat</span>
                  <p className="font-bold text-sm">{trip.bus} • {trip.seat}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {activeTab === 'active' && (
                  <button 
                    onClick={() => router.push(`/trips/track/${trip.id}`)}
                    className="flex-1 py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {t('track_bus')}
                  </button>
                )}
                <button 
                  onClick={() => router.push(`/ticket?from=${trip.from}&to=${trip.to}&date=${encodeURIComponent(trip.date)}&time=${encodeURIComponent(trip.time)}&seats=${trip.seat}&name=&orderId=`)}
                  className="flex-1 py-4 rounded-2xl bg-surface-container dark:bg-slate-700 text-on-surface dark:text-white font-black uppercase tracking-widest text-[10px] hover:bg-surface-container-high dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">confirmation_number</span>
                  View Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
