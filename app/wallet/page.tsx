'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/components/LanguageProvider';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export default function WalletPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [cards, setCards] = useState([
    { type: 'Visa', last4: '4242', balance: '$850.00', color: 'bg-indigo-900', logo: 'payments' },
    { type: 'MasterCard', last4: '8812', balance: '$398.50', color: 'bg-slate-800', logo: 'account_balance_wallet' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCardData, setNewCardData] = useState({ type: 'Visa', last4: '' });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    async function fetchWalletData() {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setTransactions(data);
        const bal = data.reduce((acc, curr) => {
          return curr.type === 'deposit' ? acc + Number(curr.amount) : acc - Number(curr.amount);
        }, 0);
        setTotalBalance(bal);
      }
    }
    fetchWalletData();
  }, []);
  
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardData.last4) return;

    const newCard = {
      type: newCardData.type,
      last4: newCardData.last4,
      balance: '$0.00',
      color: newCardData.type === 'Visa' ? 'bg-blue-900' : (newCardData.type === 'MasterCard' ? 'bg-slate-800' : 'bg-emerald-950'),
      logo: 'credit_card'
    };

    setCards([...cards, newCard]);
    setIsModalOpen(false);
    setNewCardData({ type: 'Visa', last4: '' });
  };


  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100 font-bold">arrow_back</span>
          </button>
          <h1 className="font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight text-lg">{t('my_wallet')}</h1>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
            <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
        </button>
      </header>

      <main className="px-6 pt-6 max-w-2xl mx-auto space-y-8">
        {/* Total Balance */}
        <section className="text-center py-6">
           <span className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block text-center">{t('total_balance')}</span>
           <h2 className="text-5xl font-black text-indigo-900 dark:text-white tracking-tighter tabular-nums mb-1">${totalBalance.toLocaleString()}</h2>
           <span className="text-[10px] font-bold text-tertiary dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">+12.5% {t('last_month_compare')}</span>
           
           {/* Bonus Section Link */}
           <button 
               onClick={() => router.push('/wallet/cashback')}
               className="w-full mt-6 bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-emerald-900/20 dark:to-indigo-900/20 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all"
           >
               <div className="flex items-center gap-4 text-left">
                   <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                       <span className="material-symbols-outlined text-3xl">token</span>
                   </div>
                   <div className="flex flex-col">
                       <span className="text-[10px] font-black text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-[0.2em]">{t('bonuses')}</span>
                       <span className="text-xl font-black text-indigo-900 dark:text-white tracking-tight">1,250 Pts</span>
                   </div>
               </div>
               <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-tighter">{t('silver_level')}</span>
                   <span className="material-symbols-outlined text-outline-variant dark:text-slate-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
               </div>
           </button>
        </section>

        {/* Cards Carousel (Simplified) */}
        <section className="space-y-4">
           <h3 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2">{t('my_cards')}</h3>
           <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x hide-scrollbar">
              {cards.map((card, i) => (
                <div key={i} className={`min-w-[280px] h-[180px] ${card.color} rounded-[2.5rem] p-6 shadow-xl snap-center relative overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-95 transition-all`}>
                   <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                   <div className="flex justify-between items-start">
                      <span className="material-symbols-outlined text-white/90 text-4xl">{card.logo}</span>
                      <span className="text-white font-black text-lg italic">{card.type}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest">{t('balance')}</span>
                      <span className="text-white text-2xl font-black tracking-tight">{card.balance}</span>
                      <span className="text-white/60 font-medium text-sm mt-2">**** **** **** {card.last4}</span>
                   </div>
                </div>
              ))}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="min-w-[140px] h-[180px] rounded-[2.5rem] border-2 border-dashed border-outline-variant dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors"
              >
                 <span className="material-symbols-outlined text-outline-variant dark:text-slate-600 text-3xl">add</span>
                 <span className="text-[10px] font-black text-outline-variant/80 dark:text-slate-500 uppercase tracking-widest text-center">{t('add_card')}</span>
              </button>
           </div>
        </section>

        {/* Transactions list */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2">{t('recent_transactions')}</h2>
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-outline-variant/20 dark:border-slate-700/50 overflow-hidden shadow-sm">
              {transactions.map((tx, idx) => (
                 <div key={idx} className={`p-5 flex items-center justify-between group active:bg-surface-container-high dark:active:bg-slate-700 transition-colors ${idx !== transactions.length - 1 ? 'border-b border-outline-variant/10 dark:border-slate-700/50' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-2xl ${tx.type === 'deposit' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-red-50 dark:bg-red-900/30'} flex items-center justify-center`}>
                          <span className={`material-symbols-outlined ${tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                            {tx.type === 'deposit' ? 'south_west' : 'north_east'}
                          </span>
                       </div>
                       <div className="flex flex-col">
                          <span className="font-bold text-on-surface dark:text-slate-100 text-sm tracking-tight">{tx.description}</span>
                          <span className="text-[10px] font-medium text-on-surface-variant/60 dark:text-slate-500">{new Date(tx.created_at).toLocaleDateString()} • {tx.type}</span>
                       </div>
                    </div>
                    <span className={`font-black text-sm tracking-tight ${tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface dark:text-slate-100'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                    </span>
                 </div>
              ))}
           </div>
        </section>
      </main>

      <BottomNav />

      {/* Add Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm transition-all">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-outline-variant/20 dark:border-white/5 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-indigo-900 dark:text-white uppercase tracking-tight">{t('enter_card')}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddCard} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-500 ml-1">{t('card_type')}</label>
                <select 
                  value={newCardData.type}
                  onChange={(e) => setNewCardData({...newCardData, type: e.target.value})}
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-on-surface dark:text-slate-100 focus:ring-2 ring-indigo-500/20"
                >
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="Uzcard">Uzcard</option>
                  <option value="Humo">Humo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-500 ml-1">{t('card_number_last4')}</label>
                <input 
                  type="text"
                  maxLength={4}
                  placeholder="8888"
                  value={newCardData.last4}
                  onChange={(e) => setNewCardData({...newCardData, last4: e.target.value.replace(/\D/g, '')})}
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-on-surface dark:text-slate-100 focus:ring-2 ring-indigo-500/20 tabular-nums"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
              >
                {t('confirm')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
