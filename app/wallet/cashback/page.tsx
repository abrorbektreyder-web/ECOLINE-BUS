'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import BottomNav from '@/components/BottomNav';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// ---- Loyalty tiers ----
const TIERS = [
  { key: 'bronze', label: 'Bronza', color: 'from-amber-700 to-orange-600', textColor: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20', icon: 'workspace_premium', trips: 0, cashbackRate: 2 },
  { key: 'silver', label: 'Kumush', color: 'from-slate-400 to-slate-600', textColor: 'text-slate-500 dark:text-slate-300', bgColor: 'bg-slate-50 dark:bg-slate-800', icon: 'star_rate', trips: 5, cashbackRate: 3 },
  { key: 'gold', label: 'Oltin', color: 'from-yellow-400 to-amber-500', textColor: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'trophy', trips: 15, cashbackRate: 5 },
  { key: 'platinum', label: 'Platina', color: 'from-indigo-400 to-violet-600', textColor: 'text-indigo-600 dark:text-indigo-300', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'diamond', trips: 30, cashbackRate: 8 },
];

// ---- Mock cashback history ----
const CASHBACK_HISTORY = [
  { id: 'TRS-001', route: 'Toshkent → Buxoro', date: '2026-04-05', type: 'earned', amount: 450, ticketPrice: 150000 },
  { id: 'TRS-000', route: 'Samarqand → Toshkent', date: '2026-03-28', type: 'earned', amount: 255, ticketPrice: 85000 },
  { id: 'BONUS-12', route: 'Welcome bonus', date: '2026-03-20', type: 'earned', amount: 500, ticketPrice: 0 },
  { id: 'TRS-REQ', route: 'Toshkent → Namangan', date: '2026-03-14', type: 'used', amount: -200, ticketPrice: 70000 },
  { id: 'TRS-PRE', route: 'Andijon → Toshkent', date: '2026-03-01', type: 'earned', amount: 300, ticketPrice: 100000 },
];

const TOTAL_POINTS = 1305;

export default function CashbackPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [calcAmount, setCalcAmount] = useState('150000');
  
  // Need a ref wrapper to scope gsap
  const container = React.useRef<HTMLDivElement>(null);
  const heroCardRef = React.useRef<HTMLSelectElement>(null);
  const pointCounterRef = React.useRef<HTMLSpanElement>(null);
  const tiersRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);

  // Gamification (V3 Vision Killer Feature)
  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Animate Hero Card appearance with bouncy feel
    tl.from(heroCardRef.current, {
      y: 50,
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.5)"
    })
    
    // Animate points counter dynamically from 0 to TOTAL_POINTS
    .to(pointCounterRef.current, {
      innerHTML: TOTAL_POINTS,
      duration: 1.5,
      ease: "power2.out",
      snap: { innerHTML: 1 },
      onUpdate: function() {
        if(pointCounterRef.current) {
           pointCounterRef.current.innerHTML = Number(this.targets()[0].innerHTML).toLocaleString();
        }
      }
    }, "-=0.3")

    // Animate the progression bar growing
    .fromTo(barRef.current, 
      { width: "0%" },
      { width: `${tierProgress}%`, duration: 1.5, ease: "power4.out" }, 
      "-=1.5"
    )

    // Stagger in the Loyalty Tier Cards, and bounce the active one!
    .from(".tier-card", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=1.0")
    
    // Add glowing pulse to the active tier!
    .to(".tier-active-glow", {
      scale: 1.05,
      boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: "sine.inOut"
    }, "-=0.2");
  }, { scope: container });

  // Current tier — user has 12 trips → Gold (15 needed)
  const userTrips = 12;
  const currentTierIdx = TIERS.reduce((acc, tier, i) => (userTrips >= tier.trips ? i : acc), 0);
  const currentTier = TIERS[currentTierIdx];
  const nextTier = TIERS[Math.min(currentTierIdx + 1, TIERS.length - 1)];
  const tripsToNext = nextTier.trips - userTrips;
  const tierProgress = currentTierIdx === TIERS.length - 1 ? 100 :
    Math.round(((userTrips - currentTier.trips) / (nextTier.trips - currentTier.trips)) * 100);

  // Cashback calculator
  const calcPoints = Math.round((Number(calcAmount.replace(/\D/g, '')) || 0) * (currentTier.cashbackRate / 100) / 1000);

  return (
    <div ref={container} className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 pb-32 transition-colors duration-300">

      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100 font-bold">arrow_back</span>
          </button>
          <div>
            <h1 className="font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight text-lg leading-tight">{t('my_bonuses')}</h1>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{currentTier.label} Member</p>
          </div>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
          <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
        </button>
      </header>

      <main className="px-4 pt-6 max-w-2xl mx-auto space-y-4">

        {/* === HERO POINTS CARD === */}
        <section ref={heroCardRef} className={`bg-gradient-to-br ${currentTier.color} rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden`}>
          {/* Decorative blobs */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-5">
            {/* Tier badge */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">{t('bonus_points')}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span ref={pointCounterRef} className="text-7xl font-black tabular-nums tracking-tighter">0</span>
                  <span className="text-lg font-bold text-white/60 uppercase tracking-widest pb-1">Pts</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">{currentTier.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{currentTier.label}</span>
              </div>
            </div>

            {/* Cashback value */}
            <div className="bg-black/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">{t('cashback_balance')}</p>
                <p className="text-2xl font-black tabular-nums mt-0.5">{(TOTAL_POINTS * 10).toLocaleString()} so'm</p>
              </div>
              <button className="bg-white text-indigo-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Sarflash
              </button>
            </div>

            {/* Progress to next tier */}
            {currentTierIdx < TIERS.length - 1 && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/80">
                  <span>{t('your_level')}: {currentTier.label}</span>
                  <span>{nextTier.label} → {tripsToNext} {t('trips_to_next')}</span>
                </div>
                <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
                  <div
                    ref={barRef}
                    className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  />
                </div>
                <p className="text-[9px] font-bold text-white/60 text-right uppercase tracking-widest">{tierProgress}% complete</p>
              </div>
            )}
            {currentTierIdx === TIERS.length - 1 && (
              <p className="text-[10px] font-black text-white/80 uppercase tracking-widest text-center">🎉 Maksimal daraja — Platina!</p>
            )}
          </div>
        </section>

        {/* === TIER PROGRESSION === */}
        <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-outline-variant/20 dark:border-slate-700/50 shadow-sm">
          <h2 className="text-[10px] font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Loyallik darajalari</h2>
          <div className="grid grid-cols-4 gap-2">
            {TIERS.map((tier, i) => {
              const isActive = i === currentTierIdx;
              const isDone = i < currentTierIdx;
              return (
                <div key={tier.key} className={`tier-card flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${isActive ? tier.bgColor + ' ring-2 ring-indigo-500/20 tier-active-glow' : isDone ? 'opacity-60' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-sm`}>
                    <span className="material-symbols-outlined text-white text-xl">{tier.icon}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? tier.textColor : 'text-on-surface-variant dark:text-slate-500'}`}>{tier.label}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant/50 dark:text-slate-600">{tier.trips}+ safar</span>
                  <span className={`text-[9px] font-black ${isActive ? tier.textColor : 'text-on-surface-variant/40 dark:text-slate-600'}`}>{tier.cashbackRate}%</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2">{t('how_it_works')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-outline-variant/10 dark:border-slate-700/50 space-y-3 hover:scale-[1.02] transition-all">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined">confirmation_number</span>
              </div>
              <h3 className="text-xs font-black text-indigo-900 dark:text-white uppercase tracking-tight leading-tight">Chipta sotib oling</h3>
              <p className="text-[10px] text-on-surface-variant/60 dark:text-slate-500 leading-relaxed">Har bir chipta narxidan {currentTier.cashbackRate}% keshbek.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-outline-variant/10 dark:border-slate-700/50 space-y-3 hover:scale-[1.02] transition-all">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined">token</span>
              </div>
              <h3 className="text-xs font-black text-indigo-900 dark:text-white uppercase tracking-tight leading-tight">Ball to'plang</h3>
              <p className="text-[10px] text-on-surface-variant/60 dark:text-slate-500 leading-relaxed">Har 1000 so'm = 1 ball. Ballar amal qilish muddati yo'q.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-outline-variant/10 dark:border-slate-700/50 space-y-3 hover:scale-[1.02] transition-all">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400">
                <span className="material-symbols-outlined">redeem</span>
              </div>
              <h3 className="text-xs font-black text-indigo-900 dark:text-white uppercase tracking-tight leading-tight">Ballni sarflang</h3>
              <p className="text-[10px] text-on-surface-variant/60 dark:text-slate-500 leading-relaxed">Keyingi chipta narxini ballar bilan to'lang.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-outline-variant/10 dark:border-slate-700/50 space-y-3 hover:scale-[1.02] transition-all">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <h3 className="text-xs font-black text-indigo-900 dark:text-white uppercase tracking-tight leading-tight">Darajangiz oshsin</h3>
              <p className="text-[10px] text-on-surface-variant/60 dark:text-slate-500 leading-relaxed">Ko'proq safar = yuqori daraja = ko'proq keshbek.</p>
            </div>
          </div>
        </section>

        {/* === CASHBACK CALCULATOR === */}
        <section className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 rounded-[2.5rem] p-6 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
          <h2 className="text-[10px] font-black text-indigo-900/60 dark:text-indigo-300/60 uppercase tracking-[0.2em]">Keshbek Kalkulyatori</h2>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-widest">Chipta narxi (so'm)</label>
            <input
              type="text"
              value={calcAmount}
              onChange={e => setCalcAmount(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-2xl px-5 py-4 font-black text-xl text-indigo-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 ring-indigo-400/30"
              placeholder="150000"
            />
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-widest">Oladigan ballaringiz</p>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{calcPoints} Pts</p>
              </div>
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${currentTier.color} text-white text-[10px] font-black uppercase tracking-widest text-center`}>
                {currentTier.cashbackRate}%<br/>keshbek
              </div>
            </div>
          </div>
        </section>

        {/* === CASHBACK HISTORY === */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2">{t('cashback_history')}</h2>
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-outline-variant/20 dark:border-slate-700/50 overflow-hidden shadow-sm">
            {CASHBACK_HISTORY.map((item, idx) => {
              const isEarned = item.type === 'earned';
              return (
                <div
                  key={item.id}
                  className={`p-5 flex items-center justify-between group active:bg-surface-container-high dark:active:bg-slate-700 transition-colors ${idx !== CASHBACK_HISTORY.length - 1 ? 'border-b border-outline-variant/10 dark:border-slate-700/50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isEarned ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
                      <span className={`material-symbols-outlined ${isEarned ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-500 dark:text-orange-400'}`}>
                        {isEarned ? 'add_task' : 'shopping_cart_checkout'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface dark:text-slate-100 text-sm tracking-tight">{item.route}</p>
                      <p className="text-[10px] font-medium text-on-surface-variant/60 dark:text-slate-500">{item.id} • {item.date}</p>
                    </div>
                  </div>
                  <span className={`font-black text-sm tracking-tight ${isEarned ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-500 dark:text-orange-400'}`}>
                    {isEarned ? '+' : ''}{item.amount} Pts
                  </span>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
