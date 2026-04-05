'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';
import BottomNav from '@/components/BottomNav';
import { Language } from '@/lib/translations';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  // Profile State
  const [profileName, setProfileName] = useState('Abduvohid Sultonov');
  const [profilePhone, setProfilePhone] = useState('+998 90 123 45 67');
  
  // Modals & Interactivity State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Load profile from localStorage if exists
  useEffect(() => {
    const savedName = localStorage.getItem('busgo_profile_name');
    const savedPhone = localStorage.getItem('busgo_profile_phone');
    if (savedName) setProfileName(savedName);
    if (savedPhone) setProfilePhone(savedPhone);
  }, []);

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      setProfileName(editName);
      localStorage.setItem('busgo_profile_name', editName);
    }
    if (editPhone.trim()) {
      setProfilePhone(editPhone);
      localStorage.setItem('busgo_profile_phone', editPhone);
    }
    setIsEditModalOpen(false);
  };

  const openEditModal = () => {
    setEditName(profileName);
    setEditPhone(profilePhone);
    setIsEditModalOpen(true);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const travelStats = [
    { label: t('my_trips'), value: '12', icon: 'directions_bus' },
    { label: t('popular_destinations'), value: '4', icon: 'bookmark' },
    { label: t('wallet'), value: '$124', icon: 'account_balance_wallet' },
  ];

  const menuItems = [
    { label: t('personal_info'), icon: 'person', desc: t('personal_info_desc'), action: 'edit' },
    { label: t('my_trips'), icon: 'confirmation_number', desc: t('my_trips_desc'), action: 'trips' },
    { label: t('notifications'), icon: 'notifications', desc: t('notifications_desc'), action: 'toast' },
    { label: t('security'), icon: 'shield_lock', desc: t('security_desc'), action: 'toast' },
    { label: t('help_center'), icon: 'help', desc: t('help_center_desc'), action: 'toast' },
  ];

  const handleMenuAction = (action: string, label: string) => {
    if (action === 'edit') {
      openEditModal();
    } else if (action === 'trips') {
      router.push('/trips');
    } else if (action === 'toast') {
      showToast(`${label} - Tez kunda! (Coming Soon)`);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 pb-32 transition-colors duration-300 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-indigo-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-5 fade-in duration-300 font-bold text-xs tracking-wider">
          {toastMessage}
        </div>
      )}

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
        <section className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0px_4px_12px_rgba(25,28,29,0.03)] border border-outline-variant/20 dark:border-slate-700/50 relative overflow-hidden group">
           <div className="relative mb-4">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=4338ca&color=fff&size=128`} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-700 shadow-xl object-cover" 
              />
              <button 
                onClick={openEditModal}
                className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
              >
                 <span className="material-symbols-outlined text-xs">edit</span>
              </button>
           </div>
           
           <div className="flex items-center gap-2 group cursor-pointer" onClick={openEditModal}>
             <h2 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 tracking-tight">{profileName}</h2>
             <span className="material-symbols-outlined text-outline-variant text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
           </div>
           <p className="text-on-surface-variant dark:text-slate-400 font-medium text-sm mb-6">{profilePhone}</p>
           
           <div className="w-full grid grid-cols-3 gap-2 px-2 py-4 bg-surface-container-low dark:bg-slate-900/50 rounded-3xl border border-outline-variant/10 dark:border-white/5">
              {travelStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                   <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none mb-1">{stat.value}</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/60 dark:text-slate-500 leading-tight">{stat.label}</span>
                </div>
              ))}
           </div>
        </section>

        {/* Language Section */}
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
                <div 
                  key={idx} 
                  onClick={() => handleMenuAction(item.action, item.label)}
                  className={`p-5 flex items-center justify-between group cursor-pointer active:bg-surface-container-high dark:active:bg-slate-700 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-outline-variant/10 dark:border-slate-700/50' : ''}`}
                >
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
        <button 
          onClick={() => showToast('Tizimdan chiqish (Demo)')}
          className="w-full py-5 rounded-[2rem] border-2 border-indigo-600/20 dark:border-indigo-400/20 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
        >
           <span className="material-symbols-outlined text-sm">logout</span>
           {t('logout')}
        </button>
      </main>

      {/* Shared Bottom Navigation */}
      <BottomNav />

      {/* === EDIT PROFILE MODAL === */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm transition-all">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-outline-variant/20 dark:border-white/5 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-indigo-900 dark:text-white uppercase tracking-tight">{t('personal_info')}</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-on-surface">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-500 ml-1">{t('full_name')}</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-on-surface dark:text-slate-100 focus:ring-2 ring-indigo-500/20"
                  placeholder="Ismingizni kiriting"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant dark:text-slate-500 ml-1">{t('phone')}</label>
                <input 
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-on-surface dark:text-slate-100 focus:ring-2 ring-indigo-500/20 tabular-nums"
                  placeholder="+998 90 123 45 67"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] mt-2"
              >
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
