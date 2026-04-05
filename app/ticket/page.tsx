'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function TicketSuccess() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nameInput = searchParams.get('name') || 'Alexey Petrov';
  const seatsInput = searchParams.get('seats') || '12A';
  const fromInput = searchParams.get('from') || 'Toshkent';
  const toInput = searchParams.get('to') || 'Guanchjou';
  const orderId = searchParams.get('orderId');

  const [booking, setBooking] = React.useState<any>(null);
  const ticketRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (orderId) {
      const fetchBooking = async () => {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, trips(*, buses(*))')
          .eq('id', orderId)
          .single();
        if (data) setBooking(data);
      };
      fetchBooking();
    }
  }, [orderId]);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    
    // Set dark mode off temporarily for clean PDF or use current theme
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
      logging: false,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`BusGo_Ticket_${orderId || 'DEMO'}.pdf`);
  };

  const name = booking?.passenger_names?.[0] || nameInput;
  const seats = booking?.seat_numbers?.[0] || seatsInput;
  const from = booking?.trips?.origin?.name || fromInput;
  const to = booking?.trips?.destination?.name || toInput;
  const ticketId = booking?.id?.slice(0, 8).toUpperCase() || 'BG-99201-XT';

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* TopAppBar - Restored from original design */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 h-16 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200 text-indigo-900 dark:text-indigo-100">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-semibold tracking-tight text-indigo-900 dark:text-indigo-100 text-lg">E-Chipta</h1>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container-high dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
                <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-indigo-900 dark:text-indigo-100">
              <span className="material-symbols-outlined">share</span>
            </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-lg mx-auto">
        {/* Success State Header - Restored */}
        <section className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-tertiary-fixed-dim/20 dark:bg-indigo-400/20 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-tertiary-container dark:text-indigo-400 text-5xl fill-icon animate-bounce">check_circle</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface dark:text-slate-100 mb-2 leading-tight">To'lov muvaffaqiyatli amalga oshirildi!</h2>
          <p className="text-on-surface-variant dark:text-slate-400 max-w-[280px]">Sizning {from}dan {to}ga safaringiz tasdiqlandi.</p>
        </section>

        {/* Boarding Pass - restored from legacy design */}
        <div ref={ticketRef} className="relative group p-4 bg-transparent">
          {/* Top Section */}
          <div className="bg-white dark:bg-slate-800 rounded-t-2xl p-8 pb-10 shadow-[0px_4px_12px_rgba(25,28,29,0.03)] dark:shadow-none border-b border-dashed border-outline-variant/30 dark:border-slate-700">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <p className="text-on-surface-variant dark:text-slate-500 font-medium text-[11px] tracking-widest uppercase">YO'LOVCHI</p>
                <p className="text-xl font-bold tracking-tight text-primary dark:text-indigo-300">{name}</p>
              </div>
              <div className="bg-tertiary-container dark:bg-indigo-500/10 px-3 py-1 rounded-full">
                <span className="text-on-tertiary-container dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase">VIP Executive</span>
              </div>
            </div>
            
            {/* Route */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-10">
              <div className="space-y-1">
                <p className="text-3xl font-extrabold tracking-tighter text-on-surface dark:text-slate-100">TAS</p>
                <p className="text-on-surface-variant dark:text-slate-400 text-sm font-medium">{from}</p>
              </div>
              <div className="flex flex-col items-center px-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-[2px] w-8 bg-surface-container-high dark:bg-slate-700 rounded-full"></div>
                  <span className="material-symbols-outlined text-primary dark:text-indigo-400 text-xl">directions_bus</span>
                  <div className="h-[2px] w-8 bg-surface-container-high dark:bg-slate-700 rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant/40 dark:text-slate-600 tracking-widest uppercase">7,400 KM</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-3xl font-extrabold tracking-tighter text-on-surface dark:text-slate-100">CAN</p>
                <p className="text-on-surface-variant dark:text-slate-400 text-sm font-medium">{to}</p>
              </div>
            </div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-2 gap-y-8">
              <div className="space-y-1">
                <p className="text-on-surface-variant dark:text-slate-500 font-medium text-[11px] tracking-widest uppercase">SANA</p>
                <p className="font-bold text-on-surface dark:text-slate-200">24-okt, 2023</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-on-surface-variant dark:text-slate-500 font-medium text-[11px] tracking-widest uppercase">JO'NASH VAQTI</p>
                <p className="font-bold text-on-surface dark:text-slate-200">08:30 AM</p>
              </div>
              <div className="space-y-1">
                <p className="text-on-surface-variant dark:text-slate-500 font-medium text-[11px] tracking-widest uppercase">JOY</p>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-tertiary-fixed-dim dark:bg-indigo-400 rounded-full"></div>
                  <p className="font-bold text-on-surface dark:text-slate-200">{seats}</p>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-on-surface-variant dark:text-slate-500 font-medium text-[11px] tracking-widest uppercase">PERRON</p>
                <p className="font-bold text-on-surface dark:text-slate-200">Gate 04</p>
              </div>
            </div>
          </div>

          {/* Perforation Transition - CSS Mask effect */}
          <div className="relative h-6 bg-white dark:bg-slate-800 mask-perforation">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-outline-variant/40 dark:border-slate-700"></div>
            </div>
            {/* These rounded notches provide the perforated visual */}
            <div className="absolute left-[-12px] top-0 w-6 h-6 rounded-full bg-surface dark:bg-slate-900 border-r border-outline-variant/10 dark:border-none"></div>
            <div className="absolute right-[-12px] top-0 w-6 h-6 rounded-full bg-surface dark:bg-slate-900 border-l border-outline-variant/10 dark:border-none"></div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white dark:bg-slate-800 rounded-b-2xl p-8 pt-6 flex flex-col items-center shadow-[0px_12px_32px_rgba(25,28,29,0.05)] dark:shadow-none">
            <div className="bg-white p-4 rounded-xl border border-outline-variant/10 mb-6 group-hover:scale-105 transition-transform duration-500">
              {/* Using a placeholder for QR, same as legacy src if reachable */}
              <img 
                alt="Chipta QR" 
                className="w-40 h-40" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgIhEMO8f9qek18DC1hTzjBaXvaHlKOdQHd3VmngmPr6K6IrFPxo62td8NqtQK-zeXG3X7dhPGktPAfv4Dp2BcMfYbjkfRAuaAkwUWrdOO (truncated)"
                onError={(e) => { e.currentTarget.src = "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=BusGo-BG-99201-XT"; }} 
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-bold text-on-surface-variant dark:text-slate-500 tracking-[0.2em] uppercase">CHIPTA ID: BG-99201-XT</p>
              <p className="text-xs text-on-surface-variant/60 dark:text-slate-500/80">Chiptani tekshirish paytida ushbu QR kodni ko'rsating</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <section className="mt-12 space-y-4">
          <button 
            onClick={downloadPDF}
            className="w-full h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container dark:from-indigo-700 dark:to-indigo-500 flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-white">download</span>
            <span className="text-white font-bold text-sm tracking-wider uppercase">PDF YUKLAB OLISH</span>
          </button>
          <button className="w-full h-16 rounded-2xl bg-on-background dark:bg-slate-950 flex items-center justify-center gap-3 active:scale-95 transition-transform border border-white/5">
            <span className="material-symbols-outlined text-white">wallet</span>
            <span className="text-white font-bold text-sm tracking-wider uppercase">WALLET'GA QO'SHISH</span>
          </button>
        </section>
      </main>
    </div>
  );
}
