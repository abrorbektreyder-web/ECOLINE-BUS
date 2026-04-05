'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BusSearch from '@/components/features/BusSearch';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="min-h-screen pb-32 transition-colors duration-300 bg-background text-on-background">
      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <button className="active:scale-95 transition-transform text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-primary tracking-tighter leading-tight">BusGo</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Premium Sayohat</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container transition-colors">
               <span className="material-symbols-outlined text-primary dark:text-yellow-400 select-none">light_mode</span>
            </button>
            <button onClick={() => router.push('/profile')} className="relative p-1 active:scale-95 transition-transform">
               <span className="material-symbols-outlined text-primary">notifications</span>
               <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary-fixed-dim rounded-full"></span>
            </button>
            <button onClick={() => router.push('/profile')} className="active:scale-95 transition-transform">
              <img src="https://ui-avatars.com/api/?name=User&background=4338ca&color=fff" alt="User profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 pt-8 max-w-2xl mx-auto">
        {/* Hero Greeting */}
        <section className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-on-background mb-1">Salom, Sayyoh!</h2>
          <p className="text-on-surface-variant font-medium">Bugun qayerga sayohat qilishni xohlaysiz?</p>
        </section>

        {/* Central Search Widget */}
        <BusSearch />

        {/* Popular Destinations */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight text-primary">Mashhur xalqaro yo'nalishlar</h3>
            <button className="text-xs font-bold text-primary tracking-widest uppercase hover:underline">BARCHASINI KO'RISH</button>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 no-scrollbar snap-x">
            <DestinationCard 
              image="https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop" 
              title="Tashkent to Guangzhou" 
              rating="4.9" 
              price="$89" 
              badge="Tezkor taklif"
            />
            <DestinationCard 
              image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop" 
              title="Paris to London" 
              rating="4.8" 
              price="$45" 
            />
            <DestinationCard 
              image="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop" 
              title="Berlin to Paris" 
              rating="4.7" 
              price="$62" 
            />
          </div>
        </section>

        {/* Promo */}
        <section className="bg-surface-container rounded-3xl p-6 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-primary font-bold text-lg leading-tight mb-1">Birinchi sayohatmi?</h4>
            <p className="text-on-surface-variant text-sm font-medium mb-3">Birinchi bandlov uchun 20% chegirma oling.</p>
            <button className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform underline-offset-4">HOZIROQ OLISH</button>
          </div>
          <span className="material-symbols-outlined text-8xl absolute -right-4 -bottom-4 text-primary/10 rotate-12" style={{ fontSize: '110px' }}>confirmation_number</span>
        </section>
      </main>

      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}

function DestinationCard({ image, title, rating, price, badge }: any) {
  return (
    <div className="flex-shrink-0 w-60 snap-start group cursor-pointer">
      <div className="relative h-64 rounded-3xl overflow-hidden mb-4 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
        <img className="absolute inset-0 w-full h-full object-cover" src={image} alt={title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-5 left-5 right-5">
          {badge && (
            <div className="inline-flex px-3 py-1 bg-tertiary-fixed-dim/90 backdrop-blur-md rounded-full mb-2">
              <span className="text-[10px] font-black uppercase tracking-tighter text-tertiary">{badge}</span>
            </div>
          )}
          <p className="text-white font-bold text-base leading-tight">{title}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined fill-icon text-sm text-tertiary-fixed-dim">star</span>
          <span className="text-xs font-bold text-on-surface">{rating}</span>
        </div>
        <p className="text-sm font-medium text-on-surface-variant">Narxi <span className="text-primary font-extrabold text-base">{price}</span></p>
      </div>
    </div>
  );
}

function BottomNav() {
  const router = useRouter();
  
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)] border-t border-outline-variant/30">
      <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 bg-surface-container text-primary rounded-2xl px-5 py-2 active:scale-90 transition-all duration-200">
        <span className="material-symbols-outlined fill-icon">search</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider">Qidirish</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-all duration-200">
        <span className="material-symbols-outlined">directions_bus</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider">Safarlar</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-all duration-200">
        <span className="material-symbols-outlined">confirmation_number</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider">Hamyon</span>
      </button>
      <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-all duration-200">
        <span className="material-symbols-outlined">person</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider">Profil</span>
      </button>
    </nav>
  );
}
