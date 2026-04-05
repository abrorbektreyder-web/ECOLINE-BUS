'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useTheme } from '@/components/ThemeProvider';

export default function DigitalTicket() {
  const { toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get('from') || 'London';
  const to = searchParams.get('to') || 'Paris';
  const price = searchParams.get('price') || '45';
  const seats = searchParams.get('seats') || '1';

  return (
    <div className="min-h-screen bg-background pb-12 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-primary">close</span>
          </button>
          <h1 className="font-extrabold text-on-surface tracking-tight">Elektron Chipta</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container transition-colors">
             <span className="material-symbols-outlined text-primary dark:text-yellow-400 select-none">light_mode</span>
          </button>
          <button className="active:scale-95 duration-150 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-primary">share</span>
          </button>
          <button className="active:scale-95 duration-150 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-primary">download</span>
          </button>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Success Status */}
        <section className="flex flex-col items-center text-center space-y-3 mb-4">
           <div className="w-20 h-20 bg-tertiary-fixed-dim/10 rounded-full flex items-center justify-center mb-2">
              <div className="w-14 h-14 bg-tertiary-fixed-dim rounded-full flex items-center justify-center shadow-lg shadow-tertiary-fixed-dim/20">
                 <span className="material-symbols-outlined text-white text-3xl font-black">check</span>
              </div>
           </div>
           <h2 className="text-3xl font-black text-on-surface tracking-tight">Muvaffaqiyatli!</h2>
           <p className="text-on-surface-variant font-medium max-w-[200px] leading-tight">Yaxshi sayohat tilaymiz. Chiptangiz tayyor.</p>
        </section>

        {/* Boarding Pass */}
        <section className="relative filter drop-shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
           <div className="bg-surface rounded-[2.5rem] overflow-hidden relative border border-outline-variant/30">
              {/* Ticket Top Part */}
              <div className="p-8 border-b-2 border-dashed border-outline-variant/20 relative">
                 <div className="flex justify-between items-start mb-10">
                    <div className="flex flex-col">
                       <h3 className="text-2xl font-black text-primary leading-none mb-1">BusGo</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Premium Bus</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30 mb-1">Chipta No.</p>
                       <p className="text-lg font-black text-on-surface leading-none">BG-774219</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between mb-8 relative">
                    <div className="flex flex-col items-center">
                       <p className="text-3xl font-black text-on-surface leading-none mb-2">{from}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Ketish</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4">
                       <span className="material-symbols-outlined text-primary/10 text-6xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90">directions_bus</span>
                    </div>

                    <div className="flex flex-col items-center">
                       <p className="text-3xl font-black text-on-surface leading-none mb-2">{to}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40">Borish</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-y-6">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/40 mb-1">Sana</p>
                       <p className="font-extrabold text-on-surface">05 Aprel, 2026</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/40 mb-1">Vaqt</p>
                       <p className="font-extrabold text-on-surface">10:15</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/40 mb-1">O'rindiq</p>
                       <p className="font-extrabold text-on-surface">{seats}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/40 mb-1">Turi</p>
                       <p className="font-extrabold text-on-surface">Premium</p>
                    </div>
                 </div>

                 {/* Perforation holes decoration */}
                 <div className="absolute -left-4 -bottom-4 w-8 h-8 rounded-full bg-background border border-outline-variant/30"></div>
                 <div className="absolute -right-4 -bottom-4 w-8 h-8 rounded-full bg-background border border-outline-variant/30"></div>
              </div>

              {/* QR Code Part */}
              <div className="p-10 pt-12 flex flex-col items-center bg-surface-container/30">
                 <div className="p-6 bg-white rounded-3xl shadow-sm border border-outline-variant/10 mb-4">
                    <QRCodeSVG 
                      value={`TICKET:BG-774219:${from}:${to}:${price}`} 
                      size={180} 
                      fgColor="#000666"
                    />
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Tekshirish kodi</p>
              </div>
           </div>
        </section>

        <button 
           onClick={() => router.push('/')}
           className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/10 active:scale-[0.98] transition-all"
        >
           BOSH SAHIFAGA QAYTISH
        </button>
      </main>
    </div>
  );
}
