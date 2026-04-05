'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';

export default function DriverAppPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [tripStarted, setTripStarted] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [passengers, setPassengers] = useState([
    { id: 'TKT-991', name: 'Alisher O.', seat: '4A', boarded: true },
    { id: 'TKT-992', name: 'Jasur B.', seat: '4B', boarded: false },
    { id: 'TKT-993', name: 'Kamola T.', seat: '5A', boarded: false },
  ]);

  const [scanMode, setScanMode] = useState(false);

  // Toggle broadcasting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tripStarted && broadcasting) {
      interval = setInterval(() => {
        console.log('[GPS WebSockets] Simulyatsiya: Koordinatalar yuborilmoqda...');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [tripStarted, broadcasting]);

  const boardPassenger = (id: string) => {
    setPassengers(prev => prev.map(p => p.id === id ? { ...p, boarded: true } : p));
    // simulate successful scan sound
  };

  const boardedCount = passengers.filter(p => p.boarded).length;
  const totalCount = passengers.length;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="px-6 py-5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center gap-4 justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center p-0.5">
            <div className="w-full h-full border-2 border-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">directions_bus</span>
            </div>
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight">BusGo Driver</h1>
            <p className="text-[10px] text-indigo-300 font-bold tracking-widest uppercase">Haydovchi Portali</p>
          </div>
        </div>
        <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
          <span className="material-symbols-outlined">person</span>
        </button>
      </header>

      <main className="p-4 space-y-4 max-w-lg mx-auto">
        {/* TRIP STATUS CARD */}
        <section className={`rounded-[2rem] p-6 text-white border transition-all duration-500 overflow-hidden relative shadow-2xl ${tripStarted ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-800 border-slate-700'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
          
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <span className="bg-black/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase inline-block mb-3">
                Reys: #BG-8902
              </span>
              <h2 className="text-3xl font-black tracking-tighter">TOSH <span className="text-white/40 font-light">→</span> BUX</h2>
              <p className="text-white/70 text-sm font-medium mt-1">Bugun, 21:00 • 35 yo'lovchi</p>
            </div>
            {broadcasting && (
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping mt-2 mr-2" />
            )}
          </div>

          <div className="mt-8 flex gap-3">
            {!tripStarted ? (
              <button 
                onClick={() => { setTripStarted(true); setBroadcasting(true); }}
                className="flex-1 bg-emerald-500 text-slate-900 font-black py-4 rounded-2xl active:scale-95 transition-transform flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                <span className="material-symbols-outlined">play_arrow</span> REYSNI BOSHLASH
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setBroadcasting(!broadcasting)}
                  className={`flex-1 font-black py-4 rounded-2xl active:scale-95 transition-all outline outline-2 flex justify-center items-center gap-2 ${broadcasting ? 'bg-red-500 outline-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-transparent outline-white/30 text-white/80'}`}
                >
                  <span className="material-symbols-outlined">{broadcasting ? 'gps_fixed' : 'location_disabled'}</span> 
                  {broadcasting ? 'GPS JONLI UZATILMOQDA' : 'GPS TO\'XTATILGAN'}
                </button>
              </>
            )}
          </div>
        </section>

        {/* SCANNER MODAL FALLBACK */}
        {scanMode ? (
          <section className="bg-black rounded-[2rem] p-6 border border-slate-800 text-center space-y-4">
            <h3 className="font-black text-lg">Chiptani Skanerlash (QR)</h3>
            <div className="aspect-square bg-slate-900 rounded-2xl border-2 border-emerald-500 border-dashed flex items-center justify-center relative overflow-hidden">
               <div className="w-full h-1 bg-emerald-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
               <span className="material-symbols-outlined text-6xl text-emerald-500/50">qr_code_scanner</span>
            </div>
            <button 
              onClick={() => setScanMode(false)}
              className="bg-white/10 font-bold text-white py-3 px-6 rounded-xl w-full"
            >
              Bekor qilish
            </button>
            <style jsx>{`
              @keyframes scan {
                0% { top: 0; box-shadow: 0 0 20px #10b981; }
                50% { top: 100%; box-shadow: 0 0 20px #10b981; }
                100% { top: 0; box-shadow: 0 0 20px #10b981; }
              }
            `}</style>
          </section>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setScanMode(true)}
              className="flex-1 bg-indigo-500/20 text-indigo-300 font-bold py-4 rounded-2xl border border-indigo-500/30 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">qr_code_scanner</span>
              <span>QR Skanerlash</span>
            </button>
            <button className="flex-1 bg-slate-800 text-white/80 font-bold py-4 rounded-2xl border border-slate-700 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">checklist</span>
              <span>Jo'natmalar ({boardedCount}/{totalCount})</span>
            </button>
          </div>
        )}

        {/* PASSENGER MANIFEST */}
        <section className="bg-slate-800 rounded-[2rem] p-6 border border-slate-700 mt-4">
          <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
             <div>
               <h3 className="font-black text-lg">Yo'lovchilar</h3>
               <p className="text-[10px] text-white/50 tracking-widest uppercase">Bortga chiqqanlar: {boardedCount}/{totalCount}</p>
             </div>
             <div className="flex gap-1">
               <span className="material-symbols-outlined text-white/30 text-sm">filter_list</span>
             </div>
          </div>
          
          <div className="space-y-2">
            {passengers.map(p => (
              <div key={p.id} onClick={() => !p.boarded && boardPassenger(p.id)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${p.boarded ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' : 'bg-slate-900 border-slate-700 hover:border-indigo-500 cursor-pointer'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${p.boarded ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-white/50'}`}>
                    {p.seat}
                  </div>
                  <div>
                    <h4 className={`font-bold ${p.boarded ? 'text-emerald-50' : 'text-white'}`}>{p.name}</h4>
                    <p className="text-[10px] text-white/50 font-mono">{p.id}</p>
                  </div>
                </div>
                {p.boarded ? (
                  <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                ) : (
                  <button className="bg-white/5 rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-indigo-500 hover:text-white transition">Tekshirish</button>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
