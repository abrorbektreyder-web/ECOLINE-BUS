'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import BottomNav from '@/components/BottomNav';
import { Language } from '@/lib/translations';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const travelStats = [
    { label: t('my_trips'), value: '12', icon: 'directions_bus' },
    { label: t('popular_destinations'), value: '4', icon: 'bookmark' }, // Reusing for demo
    { label: t('wallet'), value: '$124', icon: 'account_balance_wallet' },
  ];

  const menuItems = [
    { label: t('personal_info'), icon: 'person', desc: t('personal_info_desc') },
    { label: t('my_trips'), icon: 'confirmation_number', desc: t('my_trips_desc') },
    { label: t('notifications'), icon: 'notifications', desc: t('notifications_desc') },
    { label: t('security'), icon: 'shield_lock', desc: t('security_desc') },
    { label: t('help_center'), icon: 'help', desc: t('help_center_desc') },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100 font-bold">arrow_back</span>
          </button>
          <h1 className="font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight text-lg">{t('my_profile')}</h1>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
            <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
        </button>
      </header>

      <main className="px-6 pt-6 max-w-2xl mx-auto space-y-8">
        {/* User Card */}
        <section className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0px_4px_12px_rgba(25,28,29,0.03)] border border-outline-variant/20 dark:border-slate-700/50 relative overflow-hidden">
           <div className="relative mb-4">
              <img src="https://ui-avatars.com/api/?name=Abduvohid+Sultonov&background=4338ca&color=fff&size=128" alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 shadow-xl object-cover" />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-lg">
                 <span className="material-symbols-outlined text-xs">edit</span>
              </button>
           </div>
           <h2 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 tracking-tight">Abduvohid Sultonov</h2>
           <p className="text-on-surface-variant dark:text-slate-400 font-medium text-sm mb-6">+998 90 123 45 67</p>
           
           <div className="w-full grid grid-cols-3 gap-2 px-2 py-4 bg-surface-container-low dark:bg-slate-900/50 rounded-3xl border border-outline-variant/10 dark:border-white/5">
              {travelStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                   <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none mb-1">{stat.value}</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60 dark:text-slate-500 leading-tight">{stat.label}</span>
                </div>
              ))}
           </div>
        </section>

        {/* Language Section - New */}
        <section className="space-y-3">
           <h3 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2 mb-4">{t('app_language')}</h3>
           <div className="flex gap-2">
              {[
                { code: 'uz', name: 'O\'zbekcha' },
                { code: 'ru', name: 'Русский' },
                { code: 'en', name: 'English' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`flex-1 py-4 px-2 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${
                    language === lang.code 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-400' 
                      : 'border-transparent bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-slate-500 hover:border-outline-variant/30 dark:hover:border-slate-700'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
           </div>
        </section>

        {/* Menu Section */}
        <section className="space-y-3">
           <h3 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] px-2 mb-4">{t('main_settings')}</h3>
           <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-outline-variant/20 dark:border-slate-700/50 overflow-hidden shadow-sm">
              {menuItems.map((item, idx) => (
                <div key={idx} className={`p-5 flex items-center justify-between group cursor-pointer active:bg-surface-container-high dark:active:bg-slate-700 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-outline-variant/10 dark:border-slate-700/50' : ''}`}>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                         <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">{item.icon}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-on-surface dark:text-slate-100 text-sm">{item.label}</span>
                         <span className="text-[10px] font-medium text-on-surface-variant/60 dark:text-slate-500">{item.desc}</span>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-outline/30 dark:text-slate-600 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">chevron_right</span>
                </div>
              ))}
           </div>
        </section>

        {/* Logout */}
        <button className="w-full py-5 rounded-[2rem] border-2 border-indigo-600/20 dark:border-indigo-400/20 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
           <span className="material-symbols-outlined text-sm">logout</span>
           {t('logout')}
        </button>
      </main>

      {/* Shared Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
