'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

function BookingDetail() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const seats = searchParams.get('seats') || '12A';
  const price = searchParams.get('price') || '120';
  const from = searchParams.get('from') || 'Toshkent';
  const to = searchParams.get('to') || 'Guanchjou';
  const tripDate = searchParams.get('date') || '';
  const tripTime = searchParams.get('time') || '';
  const tripId = searchParams.get('tripId') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    passport: '',
    nationality: 'O\'zbekiston',
    email: '',
    phone: ''
  });

  const [hasInsurance, setHasInsurance] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!formData.fullName || !formData.passport || !formData.email) {
      setError('Iltimos, barcha ma\'lumotlarni kiriting');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate Payment Processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      let finalTripId = tripId;
      
      // Fallback: If no tripId in URL, fetch a random trip from the database to prevent foreign key constraint violations
      if (!finalTripId || finalTripId === 'eeac130b-7791-423b-987a-82f72068326f') {
          const { data: randomTrip } = await supabase
            .from('trips')
            .select('id')
            .limit(1)
            .single();
            
          if (randomTrip) {
            finalTripId = randomTrip.id;
          } else {
            throw new Error("Bazadan birorta ham reys topilmadi, iltimos oldin baza migratsiyasini bajaring.");
          }
      }
      
      const { data, error: dbError } = await supabase
        .from('bookings')
        .insert([{
          trip_id: finalTripId,
          seat_number: parseInt(seats) || 12,
          passenger_name: formData.fullName,
          passport_id: formData.passport,
          total_price: parseFloat(price) + (hasInsurance ? 15000 : 0),
          status: 'paid'
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      const finalPrice = parseFloat(price) + (hasInsurance ? 15000 : 0);
      
      // Show success modal instead of immediate redirect
      setShowSuccessModal(true);
      
      // Redirect after a 2-second celebration delay
      setTimeout(() => {
         router.push(`/ticket?from=${from}&to=${to}&seats=${seats}&price=${finalPrice}&name=${formData.fullName}&orderId=${data?.id || 'TEST-ORDER'}&date=${encodeURIComponent(tripDate)}&time=${encodeURIComponent(tripTime)}`);
      }, 2500);

    } catch (err: any) {
      setError('To\'lovda xatolik yuz berdi: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* TopAppBar - Restored from original design */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200 text-indigo-900 dark:text-indigo-100">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-inter tracking-tight font-bold text-xl text-indigo-900 dark:text-indigo-100">To'lov qilish</h1>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container-high dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
                <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-indigo-900 dark:text-indigo-100">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}
        {/* Trip Summary Mini-Card - Restored from legacy design */}
        <section className="bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-2xl shadow-[0px_4px_12px_rgba(25,28,29,0.03)] border-l-4 border-tertiary-fixed-dim dark:border-indigo-400">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant dark:text-slate-500 font-bold">TANLANGAN YO'NALISH</p>
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold text-primary dark:text-indigo-300 tracking-tight">{from}</span>
                <span className="material-symbols-outlined text-tertiary-fixed-dim">trending_flat</span>
                <span className="text-xl font-extrabold text-primary dark:text-indigo-300 tracking-tight">{to}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-surface-container-high dark:border-slate-700 pt-4 md:pt-0 md:pl-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant dark:text-slate-500 font-bold">SANA</p>
                <p className="text-sm font-semibold dark:text-slate-200">{tripDate || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant dark:text-slate-500 font-bold">VAQT</p>
                <p className="text-sm font-semibold dark:text-slate-200">{tripTime || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant dark:text-slate-500 font-bold">JOY</p>
                <p className="text-sm font-bold text-tertiary-container dark:text-indigo-200 bg-tertiary-fixed/30 dark:bg-indigo-500/20 px-2 py-0.5 rounded-lg inline-block">{seats}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Passenger Details Form */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-indigo-300 px-1">Yo'lovchi ma'lumotlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant dark:text-slate-500 px-1 uppercase tracking-wider">To'liq ism-sharif</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">person</span>
                <input 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high dark:bg-slate-800 border-none rounded-2xl focus:bg-surface-container-lowest dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline text-on-surface dark:text-slate-100" 
                  placeholder="Pasportdagidek yozing" 
                  type="text" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant dark:text-slate-500 px-1 uppercase tracking-wider">Pasport seriyasi va raqami</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">badge</span>
                <input 
                  value={formData.passport}
                  onChange={(e) => setFormData({...formData, passport: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high dark:bg-slate-800 border-none rounded-2xl focus:bg-surface-container-lowest dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline text-on-surface dark:text-slate-100" 
                  placeholder="AA1234567" 
                  type="text" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant dark:text-slate-500 px-1 uppercase tracking-wider">Fuqaroligi</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">public</span>
                <select 
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high dark:bg-slate-800 border-none rounded-2xl focus:bg-surface-container-lowest dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary/20 transition-all appearance-none text-on-surface dark:text-slate-100"
                >
                  <option>O'zbekiston</option>
                  <option>China</option>
                  <option>International</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant dark:text-slate-500 px-1 uppercase tracking-wider">Elektron pochta</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">mail</span>
                <input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high dark:bg-slate-800 border-none rounded-2xl focus:bg-surface-container-lowest dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline text-on-surface dark:text-slate-100" 
                  placeholder="traveller@voyage.com" 
                  type="email" 
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-on-surface-variant dark:text-slate-500 px-1 uppercase tracking-wider">Telefon raqami</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">call</span>
                <input 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-high dark:bg-slate-800 border-none rounded-2xl focus:bg-surface-container-lowest dark:focus:bg-slate-700 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline text-on-surface dark:text-slate-100" 
                  placeholder="+998 90 123 45 67" 
                  type="tel" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-indigo-300 px-1">To'lov usuli</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-tertiary-container dark:bg-indigo-900/40 rounded-2xl border border-on-tertiary-container/30 dark:border-indigo-500/30 flex items-center gap-4 relative overflow-hidden group cursor-pointer transition-all active:scale-95 shadow-sm">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-on-tertiary-container/10 rounded-full blur-2xl"></div>
                <div className="w-12 h-12 flex items-center justify-center bg-on-tertiary-container dark:bg-indigo-500 text-white rounded-xl">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">Visa/Mastercard</p>
                  <p className="text-on-tertiary-container dark:text-indigo-300 text-xs">Asosiy to'lov</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-on-tertiary-container dark:bg-indigo-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container dark:text-indigo-900 font-black fill-icon">check</span>
                </div>
            </div>
            <div className="p-6 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl flex items-center gap-4 border border-transparent hover:border-outline-variant/30 dark:hover:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-slate-300 rounded-xl text-indigo-900 dark:text-indigo-400">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div className="flex-1">
                <p className="text-primary dark:text-indigo-200 font-bold">Apple Pay</p>
                <p className="text-on-surface-variant dark:text-slate-500 text-xs">Tezkor to'lov</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upsell Banner (Bento Style) - Restored */}
        <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl p-8 relative overflow-hidden text-white shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Sayohat sug&apos;urtasi</h3>
              <p className="text-indigo-200 text-sm max-w-xs">Sayohatingizni bor-yo&apos;g&apos;i 15 000 so&apos;m evaziga sug&apos;urtalang.</p>
            </div>
            <button 
              onClick={() => setHasInsurance(!hasInsurance)}
              className={`${hasInsurance ? 'bg-emerald-500 text-white' : 'bg-tertiary-fixed-dim dark:bg-indigo-400 text-tertiary-container dark:text-indigo-900'} px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex items-center gap-2`}
            >
              {hasInsurance ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  QO'SHILDI
                </>
              ) : (
                "HIMOYA QO'SHISH"
              )}
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Summary Bar - restored from original design */}
      <nav className="fixed bottom-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-t-3xl shadow-[0px_-4px_12px_rgba(25,28,29,0.03)] flex justify-around items-center px-8 py-4">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">UMUMIY NARX</span>
          <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100 tracking-tighter">{(parseFloat(price) + (hasInsurance ? 15000 : 0)).toLocaleString('uz-UZ')} so&apos;m</span>
        </div>
        <div className="flex gap-4">
          <button className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 py-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined mb-1">receipt_long</span>
            <span className="font-inter text-[10px] uppercase tracking-widest font-bold">XULOSA</span>
          </button>
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={`flex items-center justify-center ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-br from-indigo-900 to-indigo-700 dark:from-indigo-800 dark:to-indigo-600'} text-white rounded-2xl px-8 py-3 hover:opacity-90 transition-opacity active:scale-98 duration-150 gap-3 shadow-lg shadow-indigo-200/50`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="font-inter text-[10px] uppercase tracking-[0.15em] font-black">TO&apos;LOV KETMOQDA...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined fill-icon text-sm">account_balance_wallet</span>
                <span className="font-inter text-[10px] uppercase tracking-[0.15em] font-black underline-offset-4">HOZIROQ TO&apos;LASH</span>
              </>
            )}
          </button>
        </div>
      </nav>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-sm w-full mx-auto text-center space-y-6 shadow-2xl scale-in-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[48px] text-emerald-500">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">To'lov muvaffaqiyatli!</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Chiptangiz shakllantirilmoqda, iltimos kuting...</p>
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mt-6"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Yuklanmoqda...</div>}>
      <BookingDetail />
    </Suspense>
  );
}
