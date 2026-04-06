'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const router = useRouter();
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const [from, setFrom] = React.useState('Toshkent');
  const [to, setTo] = React.useState('Buxoro');
  const [isLoading, setIsLoading] = React.useState(false);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}.${d.getFullYear()}`;
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Directly navigate to the results page, the search page handles the actual fetching from Supabase
    router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // Destination Card data - with real images and navigation
  const destinations = [
    {
      title: "Tashkent to Guangzhou",
      from: "Toshkent",
      to: "Guangzhou",
      // Real Guangzhou Canton Tower skyline photo from Unsplash
      image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80",
      rating: "4.9",
      price: "89",
      badge: "Tezkor taklif"
    },
    {
      title: "Paris to London",
      from: "Paris",
      to: "London",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
      rating: "4.8",
      price: "45"
    },
    {
      title: "Berlin to Paris",
      from: "Berlin",
      to: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      rating: "4.7",
      price: "62"
    }
  ];

  // Handle destination card click — navigate to search with pre-filled fields
  const handleDestinationClick = (dest: { from: string; to: string; price: string }) => {
    const today = new Date().toISOString().split('T')[0];
    router.push(`/search?from=${encodeURIComponent(dest.from)}&to=${encodeURIComponent(dest.to)}&date=${today}`);
  };

  // Handle first-trip promo button — store promo in localStorage, navigate to search
  const handleFirstTripPromo = () => {
    try {
      localStorage.setItem('busgo_promo', JSON.stringify({ code: 'FIRST20', discount: 20, expires: Date.now() + 3600000 }));
    } catch (e) { /* localStorage may be blocked */ }
    const today = new Date().toISOString().split('T')[0];
    router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${today}&promo=FIRST20`);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface dark:bg-slate-900 dark:text-slate-100 pb-32 transition-colors duration-300">
      {/* TopAppBar - Restored from original design */}
      <header className="w-full sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <button className="active:scale-95 transition-transform text-indigo-900 dark:text-indigo-100">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-indigo-900 dark:text-indigo-50 tracking-tighter leading-tight">BusGo</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Premium {t('support')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container-high dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
              <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
            </button>
            <button onClick={() => router.push('/profile')} className="relative p-1 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary-fixed-dim rounded-full"></span>
            </button>
            <button onClick={() => router.push('/profile')} className="active:scale-95 transition-transform flex-shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-300 shadow-md overflow-hidden flex-shrink-0">
                <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR6ub_C4_5BcOTxXPYX1LcFUiS9T9nvKqBEwar2zisKp4-PnnNeMDFaCfSQGrklcacClexZ64TBTxLTfXYXxHB0a3LB4mfhV3hy5UmMqyySKYjZvKlYjkxlkmBddilyAfWRKz4hP2E_naJPTjPBKg_n_ehtyzfRI3kVhYQbTqwHdO9gps7L69GDMa-aq6cpqq59MDgi4sB6X4bt-VCP5duWVhF9BA7VoL26xluw-MIK9noJR8unjigeZKpL0M_Y1DfuWlPnso8t00e" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 pt-8 max-w-2xl mx-auto">
        {/* Hero Greeting */}
        <section className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-on-primary-fixed dark:text-indigo-200 mb-1">{t('hello_traveler')}</h2>
          <p className="text-on-surface-variant dark:text-slate-400 font-medium">{t('where_to')}</p>
        </section>

        {/* Central Search Widget - Original Design Restoration */}
        <section className="relative mb-12">
          <div className="glass-card dark:bg-slate-800/40 rounded-3xl p-6 shadow-[0_24px_64px_rgba(25,28,29,0.06)] border border-white/50 dark:border-slate-700/50">
            <div className="space-y-4">
              <div className="space-y-4 relative">
                {/* From Field */}
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 dark:text-slate-500 mb-1.5 ml-1">{t('from_label')}</label>
                  <div className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary/5">
                    <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-3">location_on</span>
                    <input
                      id="origin-input"
                      className="bg-transparent border-none p-0 focus:ring-0 w-full font-semibold text-on-surface dark:text-slate-100"
                      placeholder={t('from')}
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="absolute right-8 top-[50%] -translate-y-[50%] z-20">
                  <button
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all duration-300 z-30 relative"
                  >
                    <span className="material-symbols-outlined text-lg">swap_vert</span>
                  </button>
                </div>

                {/* To Field */}
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 dark:text-slate-500 mb-1.5 ml-1">{t('to_label')}</label>
                  <div className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary/5">
                    <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-3">map</span>
                    <input
                      id="destination-input"
                      className="bg-transparent border-none p-0 focus:ring-0 w-full font-semibold text-on-surface dark:text-slate-100"
                      placeholder={t('to')}
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Date & Travelers Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 dark:text-slate-500 mb-1.5 ml-1">{t('date_label')}</label>
                  <label
                    className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-indigo-50 dark:focus-within:bg-indigo-900/10 cursor-pointer border border-transparent focus-within:border-indigo-200 dark:focus-within:border-indigo-800"
                    onClick={() => {
                      try {
                        dateInputRef.current?.showPicker();
                      } catch (e) {
                        dateInputRef.current?.focus();
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-2 md:mr-3 shrink-0">calendar_today</span>
                    <span className="font-semibold text-on-surface dark:text-slate-100 text-sm truncate flex-1">{formatDate(date)}</span>
                    <input
                      ref={dateInputRef}
                      type="date"
                      className="absolute inset-0 opacity-0 pointer-events-none"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                </div>
                <div className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 dark:text-slate-500 mb-1.5 ml-1">{t('passengers_label')}</label>
                  <div className="flex items-center bg-surface-container-low dark:bg-slate-800 rounded-2xl p-4 group transition-all focus-within:bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-primary/60 dark:text-indigo-400 mr-2 md:mr-3 shrink-0">group</span>
                    <input className="bg-transparent border-none p-0 focus:ring-0 w-full font-semibold text-on-surface dark:text-slate-100 text-sm truncate flex-1" type="text" defaultValue="1 Kattalar" />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full py-5 rounded-3xl bg-gradient-to-br from-primary to-primary-container text-white font-black uppercase tracking-widest text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{t('find_trips')}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight text-indigo-900 dark:text-indigo-200">{t('popular_intl_destinations')}</h3>
            <button className="text-xs font-bold text-primary tracking-widest uppercase hover:underline">{t('view_all')}</button>
          </div>
          <div className="flex overflow-x-auto pb-8 -mx-6 px-6 gap-6 no-scrollbar snap-x snap-mandatory">
            {destinations.map((dest, i) => (
              <div
                key={i}
                onClick={() => handleDestinationClick(dest)}
                className="min-w-[75%] sm:min-w-[320px] snap-center group cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="relative h-72 rounded-[2.5rem] overflow-hidden shadow-sm border border-outline-variant/10 dark:border-white/5 mb-4 group-hover:shadow-xl transition-shadow">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <img
                    src={dest.image}
                    alt={dest.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${i + 1}/800/600`; }}
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    {dest.badge && (
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1 block">{dest.badge}</span>
                    )}
                    <h4 className="text-xl font-bold text-white tracking-tight">{dest.title}</h4>
                  </div>
                  {/* Tap hint overlay */}
                  <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-sm">search</span>
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Izlash</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-tertiary-fixed-dim fill-icon">star</span>
                    <span className="text-xs font-bold text-on-surface dark:text-slate-100">{dest.rating}</span>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant dark:text-slate-400">{t('price_label')} <span className="text-indigo-700 dark:text-indigo-300 font-extrabold text-base">${dest.price}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions / Promo */}
        <section className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-6 flex items-center justify-between relative overflow-hidden border border-indigo-100 dark:border-indigo-800/30">
          <div className="relative z-10">
            <h4 className="text-indigo-900 dark:text-indigo-100 font-bold text-lg leading-tight mb-1">{t('first_trip_promo')}</h4>
            <p className="text-indigo-700/70 dark:text-indigo-300/70 text-sm font-medium mb-3">{t('first_trip_desc')}</p>
            <button
              onClick={handleFirstTripPromo}
              className="px-4 py-2 bg-indigo-900 dark:bg-indigo-500 text-white rounded-full text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform hover:bg-indigo-700 dark:hover:bg-indigo-400"
            >
              {t('get_it_now')}
            </button>
          </div>
          <span className="material-symbols-outlined text-8xl absolute -right-4 -bottom-4 text-indigo-200/50 dark:text-indigo-500/20 rotate-12">confirmation_number</span>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
