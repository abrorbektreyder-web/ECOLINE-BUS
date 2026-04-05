'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useLanguage } from './LanguageProvider';
 
export default function BottomNav() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: t('search'), icon: 'search', path: '/' },
    { label: t('my_trips'), icon: 'confirmation_number', path: '/trips' },
    { label: t('wallet'), icon: 'account_balance_wallet', path: '/wallet' },
    { label: t('profile'), icon: 'person', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-2 sm:px-6 pb-6 pt-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)] border-t border-outline-variant/10 dark:border-white/5">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className={`flex flex-col flex-1 min-w-0 items-center justify-center gap-1 py-2 px-1 rounded-2xl active:scale-95 transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200' 
                : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] sm:text-[28px] ${isActive ? 'fill-icon' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider truncate w-full text-center">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
