'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function BookingDetail() {
  const { toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const from = searchParams.get('from') || 'London';
  const to = searchParams.get('to') || 'Paris';
  const price = searchParams.get('price') || '45';
  const seats = searchParams.get('seats') || '1';

  return (
    <div className="min-h-screen bg-background pb-28 transition-colors duration-300">
      {/* AppBar */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 flex items-center justify-between font-bold">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-extrabold text-on-surface tracking-tight leading-tight">Yo'lovchi ma'lumotlari</h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">3/4 Qadam</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container transition-colors">
             <span className="material-symbols-outlined text-primary dark:text-yellow-400 select-none">light_mode</span>
          </button>
          <div className="w-10 h-10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">more_vert</span>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Trip Summary Card */}
        <section className="bg-primary rounded-[2.5rem] p-8 text-on-primary shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-6 flex justify-between items-start">
               <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-on-primary/60 font-bold">Tanlangan yo'nalish</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-on-primary tracking-tight">{from}</span>
                    <span className="material-symbols-outlined text-on-primary/40">trending_flat</span>
                    <span className="text-xl font-extrabold text-on-primary tracking-tight">{to}</span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-on-primary/60 font-bold">O'rindiqlar</p>
                  <p className="text-xl font-black text-on-primary">{seats}</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-on-primary/10">
               <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-on-primary/60 font-bold">Sana va vaqt</p>
                  <p className="font-bold text-on-primary">05 Aprel • 10:15</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-on-primary/60 font-bold">Avtobus turi</p>
                  <p className="font-bold text-on-primary">Biznes Klass</p>
               </div>
            </div>
          </div>
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </section>

        {/* Passenger Form */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            <h2 className="text-xl font-extrabold tracking-tight">Asosiy yo'lovchi</h2>
          </div>

          <div className="space-y-6 bg-surface p-8 rounded-[2rem] border border-outline-variant/30">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">To'liq ism</label>
              <div className="relative flex items-center text-on-surface">
                <span className="material-symbols-outlined absolute left-4 text-outline/40">person</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-2xl border-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/30" placeholder="Pasportdagidek yozing" type="text"/>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider">Telefon raqam</label>
              <div className="relative flex items-center text-on-surface">
                <span className="material-symbols-outlined absolute left-4 text-outline/40">call</span>
                <input className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-2xl border-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/30" placeholder="+998 90 123 45 67" type="tel"/>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-4">
           <h2 className="text-xl font-extrabold text-on-surface tracking-tight">To'lov usuli</h2>
           <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-primary bg-primary/5 p-5 rounded-2xl flex flex-col items-center gap-3 relative cursor-pointer">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">PayPal</span>
                 <span className="material-symbols-outlined absolute top-2 right-2 text-primary text-sm">check_circle</span>
              </div>
              <div className="border border-outline-variant/30 p-5 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition-all cursor-pointer hover:bg-surface-container">
                 <span className="material-symbols-outlined text-primary">credit_card</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Karta orqali</span>
              </div>
           </div>
        </section>
      </main>

      {/* Pay and Confirm Bottom Panel */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 p-6 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] rounded-t-[2.5rem]">
         <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">To'lov summasi</p>
               <p className="text-3xl font-black text-on-surface leading-tight">${price}</p>
            </div>
            <button 
              onClick={() => router.push(`/ticket?from=${from}&to=${to}&price=${price}&seats=${seats}`)}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
            >
              TO'LOV QILISH <span className="material-symbols-outlined text-sm">payments</span>
            </button>
         </div>
      </div>
    </div>
  );
}
