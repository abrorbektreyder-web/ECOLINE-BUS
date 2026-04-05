'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import BottomNav from '@/components/BottomNav';

export default function WalletPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const balance = "$1,248.50";
  
  const cards = [
    { type: 'Visa', last4: '4242', balance: '$850.00', color: 'bg-indigo-900', logo: 'payments' },
    { type: 'MasterCard', last4: '8812', balance: '$398.50', color: 'bg-slate-800', logo: 'account_balance_wallet' },
  ];

  const transactions = [
    { label: 'Tashkent - Guangzhou Ticket', date: 'Bugun, 14:20', amount: '-$89.00', status: 'Debet' },
    { label: 'Hamyon to\'ldirish (Stripe)', date: 'Kecha, 09:12', amount: '+$500.00', status: 'Kredit' },
    { label: 'Paris - London Ticket', date: '2 Mart, 11:30', amount: '-$45.00', status: 'Debet' },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100 font-bold">arrow_back</span>
          </button>
          <h1 className="font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight text-lg">Mening Hamyonim</h1>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
            <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
        </button>
      </header>

      <main className="px-6 pt-6 max-w-2xl mx-auto space-y-8">
        {/* Total Balance */}
        <section className="text-center py-6">
           <span className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block text-center">JAMI BALANSIM</span>
           <h2 className="text-5xl font-black text-indigo-900 dark:text-white tracking-tighter tabular-nums mb-1">{balance}</h2>
           <span className="text-[10px] font-bold text-tertiary dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">+12.5% o'tgan oydan</span>
        </section>

        {/* Cards Carousel (Simplified) */}
        <section className="space-y-4">
           <h3 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2">MENING KARTALARIM</h3>
           <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x hide-scrollbar">
              {cards.map((card, i) => (
                <div key={i} className={`min-w-[280px] h-[180px] ${card.color} rounded-[2.5rem] p-6 shadow-xl snap-center relative overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-95 transition-all`}>
                   <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                   <div className="flex justify-between items-start">
                      <span className="material-symbols-outlined text-white/90 text-4xl">{card.logo}</span>
                      <span className="text-white font-black text-lg italic">{card.type}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">Balans</span>
                      <span className="text-white text-2xl font-black tracking-tight">{card.balance}</span>
                      <span className="text-white/60 font-medium text-sm mt-2">**** **** **** {card.last4}</span>
                   </div>
                </div>
              ))}
              <button className="min-w-[140px] h-[180px] rounded-[2.5rem] border-2 border-dashed border-outline-variant dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors">
                 <span className="material-symbols-outlined text-outline-variant dark:text-slate-600 text-3xl">add</span>
                 <span className="text-[10px] font-black text-outline-variant/80 dark:text-slate-500 uppercase tracking-widest">KARTA QO'SHISH</span>
              </button>
           </div>
        </section>

        {/* Transactions list */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2">OXIRGI AMALLAR</h2>
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-outline-variant/20 dark:border-slate-700/50 overflow-hidden shadow-sm">
             {transactions.map((t, idx) => (
                <div key={idx} className={`p-5 flex items-center justify-between group active:bg-surface-container-high dark:active:bg-slate-700 transition-colors ${idx !== transactions.length - 1 ? 'border-b border-outline-variant/10 dark:border-slate-700/50' : ''}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl ${t.amount.startsWith('+') ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'} flex items-center justify-center`}>
                         <span className={`material-symbols-outlined ${t.amount.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                           {t.amount.startsWith('+') ? 'south_west' : 'north_east'}
                         </span>
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-on-surface dark:text-slate-100 text-sm tracking-tight">{t.label}</span>
                         <span className="text-[10px] font-medium text-on-surface-variant/60 dark:text-slate-500">{t.date} • {t.status}</span>
                      </div>
                   </div>
                   <span className={`font-black text-sm tracking-tight ${t.amount.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface dark:text-slate-100'}`}>
                     {t.amount}
                   </span>
                </div>
             ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
