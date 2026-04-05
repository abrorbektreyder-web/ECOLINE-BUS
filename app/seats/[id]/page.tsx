'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function SeatSelection() {
  const { toggleTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const from = searchParams.get('from') || 'London';
  const to = searchParams.get('to') || 'Paris';
  const basePrice = parseInt(searchParams.get('price') || '45');

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const occupiedSeats = [3, 4, 12, 13, 21, 22, 28];

  const handleSeatClick = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return;

    setSelectedSeats(prev => {
      const isSelected = prev.includes(seatNumber);
      if (isSelected) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  useEffect(() => {
    setTotalPrice(selectedSeats.length * basePrice);
  }, [selectedSeats, basePrice]);

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-surface/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-primary font-bold">arrow_back</span>
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container transition-colors">
               <span className="material-symbols-outlined text-primary dark:text-yellow-400 select-none">light_mode</span>
            </button>
            <h1 className="font-extrabold tracking-tight text-on-surface">Joy tanlash</h1>
          </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-8 mb-8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
           <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-secondary-container"></div>
              <span>Bo'sh</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-outline/20"></div>
              <span>Band</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-primary"></div>
              <span>Tanlangan</span>
           </div>
        </div>

        {/* Bus Layout */}
        <div className="bg-surface rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/30 relative overflow-hidden">
           {/* Driver side icon */}
           <div className="w-full flex justify-end mb-8 pr-4">
              <span className="material-symbols-outlined text-outline/30 text-3xl">steering</span>
           </div>

           <div className="grid grid-cols-4 gap-4 gap-y-6 relative">
              {Array.from({ length: 32 }, (_, i) => i + 1).map(num => {
                 const isOccupied = occupiedSeats.includes(num);
                 const isSelected = selectedSeats.includes(num);
                 const isAisle = (num % 4 === 2);

                 return (
                   <React.Fragment key={num}>
                     <div 
                       onClick={() => handleSeatClick(num)}
                       className={`
                         aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all duration-200 cursor-pointer relative group
                         ${isOccupied ? 'bg-outline/10 text-outline/20 cursor-not-allowed' : 
                          isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110 active:scale-100' : 
                          'bg-surface-container text-on-surface hover:bg-surface-container-high'}
                       `}
                     >
                       {num}
                       {!isOccupied && !isSelected && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-outline/20 rounded-full m-1"></div>}
                     </div>
                     {isAisle && <div className="w-4"></div>}
                   </React.Fragment>
                 );
              })}
           </div>
        </div>
      </main>

      {/* Floating Price Sheet */}
      <div className={`fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.08)] border-t border-outline-variant/30 p-6 transition-transform duration-500 ${selectedSeats.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-1">Jami qiymat</span>
               <div className="flex items-center gap-2">
                 <span className="text-2xl font-black text-on-surface leading-none">${totalPrice}</span>
                 <span className="text-[10px] font-bold text-on-surface-variant/40"> / {selectedSeats.length} o'rin</span>
               </div>
            </div>
            
            <button 
              onClick={() => router.push(`/booking?from=${from}&to=${to}&price=${totalPrice}&seats=${selectedSeats.join(',')}`)}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
            >
              DAVOM ETISH <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
         </div>
      </div>
    </div>
  );
}
