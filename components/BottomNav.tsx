'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Qidirish', icon: 'search', path: '/' },
    { label: 'Safarlar', icon: 'directions_bus', path: '/trips' },
    { label: 'Hamyon', icon: 'account_balance_wallet', path: '/wallet' },
    { label: 'Profil', icon: 'person', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)] border-t border-outline-variant/10 dark:border-white/5">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl active:scale-90 transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200' 
                : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'fill-icon' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
