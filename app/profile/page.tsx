'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function ProfilePage() {
  const { toggleTheme } = useTheme();
  const router = useRouter();

  const travelStats = [
    { label: 'Jami safarlar', value: '12', icon: 'directions_bus' },
    { label: 'Saqlangan joylar', value: '4', icon: 'bookmark' },
    { label: 'Hamyon', value: '$124', icon: 'account_balance_wallet' },
  ];

  const menuItems = [
    { label: 'Shaxsiy ma\'lumotlar', icon: 'person', desc: 'Ism, telefon va pasport' },
    { label: 'Mening chiptalarim', icon: 'confirmation_number', desc: 'Faol va o\'tgan safarlar' },
    { label: 'Bildirishnomalar', icon: 'notifications', desc: 'Sayohat haqida eslatmalar' },
    { label: 'Xavfsizlik', icon: 'shield_lock', desc: 'Parol va auth' },
    { label: 'Yordam markazi', icon: 'help', desc: '24/7 qo\'llab-quvvatlash' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-6 sticky top-0 z-50 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 flex items-center justify-between">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-primary font-bold">arrow_back</span>
        </button>
        <h1 className="font-extrabold text-on-surface tracking-tight text-lg">Mening Profilim</h1>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container transition-colors">
           <span className="material-symbols-outlined text-primary dark:text-yellow-400 select-none">light_mode</span>
        </button>
      </header>

      <main className="px-6 pt-6 max-w-2xl mx-auto space-y-8">
        {/* User Card */}
        <section className="flex flex-col items-center text-center p-8 bg-surface rounded-[2.5rem] shadow-sm border border-outline-variant/30 relative overflow-hidden">
           <div className="relative mb-4">
              <img src="https://ui-avatars.com/api/?name=User&background=4338ca&color=fff&size=128" alt="Profile" className="w-24 h-24 rounded-full border-4 border-surface shadow-xl object-cover" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-surface shadow-lg">
                 <span className="material-symbols-outlined text-xs">edit</span>
              </button>
           </div>
           <h2 className="text-2xl font-black text-on-surface tracking-tight">Abduvohid Sultonov</h2>
           <p className="text-on-surface-variant font-medium text-sm mb-6">+998 90 123 45 67</p>
           
           <div className="w-full grid grid-cols-3 gap-2 px-2 py-4 bg-surface-container rounded-3xl border border-outline-variant/20">
              {travelStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                   <span className="text-xl font-black text-primary leading-none mb-1">{stat.value}</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60 leading-tight">{stat.label}</span>
                </div>
              ))}
           </div>
        </section>

        {/* Menu Section */}
        <section className="space-y-3">
           <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] px-2 mb-4">ASOSIY SOZLAMALAR</h3>
           <div className="bg-surface rounded-[2.5rem] border border-outline-variant/30 overflow-hidden shadow-sm">
              {menuItems.map((item, idx) => (
                <div key={idx} className={`p-5 flex items-center justify-between group cursor-pointer active:bg-surface-container-high transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                         <span className="material-symbols-outlined text-primary">{item.icon}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-on-surface text-sm">{item.label}</span>
                         <span className="text-[10px] font-medium text-on-surface-variant/60">{item.desc}</span>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-outline/30 text-lg group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              ))}
           </div>
        </section>

        {/* Logout */}
        <button className="w-full py-5 rounded-[2rem] border-2 border-primary/20 text-primary font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-primary/5">
           <span className="material-symbols-outlined text-sm">logout</span>
           CHIQISH
        </button>
      </main>

      {/* Bottom Nav Re-use logic */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)] border-t border-outline-variant/30">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1 text-on-surface-variant px-5 py-2 hover:text-primary active:scale-90 transition-all duration-200">
          <span className="material-symbols-outlined">search</span>
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
        <button className="flex flex-col items-center gap-1 bg-surface-container text-primary rounded-2xl px-5 py-2 active:scale-90 transition-all duration-200">
          <span className="material-symbols-outlined fill-icon">person</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider">Profil</span>
        </button>
      </nav>
    </div>
  );
}
