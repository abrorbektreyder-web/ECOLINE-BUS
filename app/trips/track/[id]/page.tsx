'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';

// --- Static route data ---
const ROUTE_STOPS = [
  { name: 'Toshkent', lat: 41.2995, lng: 69.2401, km: 0 },
  { name: 'Jizzax', lat: 40.1158, lng: 67.8422, km: 185 },
  { name: 'Samarqand', lat: 39.6542, lng: 66.9597, km: 285 },
  { name: 'Kattaqo\'rg\'on', lat: 39.9, lng: 65.98, km: 342 },
  { name: 'Buxoro', lat: 39.7747, lng: 64.4286, km: 576 },
];

const TOTAL_KM = 576;

// Lerp between two values
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function TrackPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const tripId = params?.id as string ?? 'TRS-001';

  // Simulate bus at ~40% of route (between Jizzax and Samarqand)
  const [progress, setProgress] = useState(42); // 0–100%
  const [speed, setSpeed] = useState(87); // km/h
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const animFrameRef = useRef<NodeJS.Timeout | null>(null);

  // Derived: current km
  const currentKm = Math.round((progress / 100) * TOTAL_KM);

  // ETA: remaining km / avg speed
  const remainingKm = TOTAL_KM - currentKm;
  const etaMinutes = Math.round((remainingKm / (speed || 80)) * 60);
  const etaHours = Math.floor(etaMinutes / 60);
  const etaMins = etaMinutes % 60;

  // Current bus position on the "map" (SVG viewport 0–100)
  // Map: Toshkent is top-right, Buxoro is bottom-left
  const busX = lerp(85, 10, progress / 100);
  const busY = lerp(15, 75, progress / 100);

  // Find current & next stop
  const passedKm = currentKm;
  const currentStopIdx = ROUTE_STOPS.reduce((acc, stop, i) => {
    return stop.km <= passedKm ? i : acc;
  }, 0);
  const nextStop = ROUTE_STOPS[Math.min(currentStopIdx + 1, ROUTE_STOPS.length - 1)];

  // Simulate live update every 3s
  useEffect(() => {
    if (!isLive) return;
    animFrameRef.current = setInterval(() => {
      setProgress(p => {
        const newP = Math.min(p + 0.15, 100);
        return newP;
      });
      setSpeed(Math.round(75 + Math.random() * 25));
      setLastUpdate(new Date());
    }, 3000);
    return () => { if (animFrameRef.current) clearInterval(animFrameRef.current); };
  }, [isLive]);

  // Stop percentage for map dots
  const stopX = (stopIdx: number) => lerp(85, 10, ROUTE_STOPS[stopIdx].km / TOTAL_KM);
  const stopY = (stopIdx: number) => lerp(15, 75, ROUTE_STOPS[stopIdx].km / TOTAL_KM);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900 text-on-surface dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-indigo-900 dark:text-indigo-100 font-bold">arrow_back</span>
          </button>
          <div>
            <h1 className="font-extrabold text-indigo-900 dark:text-indigo-100 tracking-tight text-lg leading-tight">{t('track_bus')}</h1>
            <p className="text-[10px] font-bold text-on-surface-variant/60 dark:text-slate-500 uppercase tracking-widest">{tripId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* LIVE badge */}
          <button
            onClick={() => setIsLive(l => !l)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isLive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            {isLive ? t('live_tracking') : 'PAUSED'}
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-indigo-900/30 transition-all duration-300 active:scale-95">
            <span className={`material-symbols-outlined transition-all duration-500 transform ${theme === 'dark' ? 'text-yellow-400 rotate-0 scale-110' : 'text-indigo-900 -rotate-45 scale-100'}`}>light_mode</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pb-10 space-y-0">

        {/* === MAP SECTION === */}
        <section className="relative mx-4 mt-6 rounded-[2.5rem] overflow-hidden shadow-2xl bg-indigo-950 dark:bg-slate-950 border border-indigo-900/50 dark:border-slate-800" style={{ height: '320px' }}>
          {/* Map Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950" />

          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[10,20,30,40,50,60,70,80,90].map(x => (
              <line key={`vx-${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#818cf8" strokeWidth="0.3" />
            ))}
            {[10,20,30,40,50,60,70,80,90].map(y => (
              <line key={`hy-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#818cf8" strokeWidth="0.3" />
            ))}
          </svg>

          {/* Route SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Route path - full */}
            <polyline
              points={ROUTE_STOPS.map((_, i) => `${stopX(i)},${stopY(i)}`).join(' ')}
              fill="none"
              stroke="rgba(129,140,248,0.25)"
              strokeWidth="1.2"
              strokeDasharray="2 1"
              strokeLinecap="round"
            />
            {/* Completed path */}
            <polyline
              points={[
                ...ROUTE_STOPS.filter(s => s.km <= currentKm).map((_, i) => `${stopX(i)},${stopY(i)}`),
                `${busX},${busY}`
              ].join(' ')}
              fill="none"
              stroke="#818cf8"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Stop dots */}
            {ROUTE_STOPS.map((stop, i) => {
              const isPassed = stop.km <= currentKm;
              const isNext = i === currentStopIdx + 1;
              return (
                <g key={i}>
                  <circle
                    cx={stopX(i)}
                    cy={stopY(i)}
                    r={isNext ? 2.2 : 1.6}
                    fill={isPassed ? '#818cf8' : isNext ? '#34d399' : 'rgba(129,140,248,0.3)'}
                    stroke={isNext ? '#34d399' : '#818cf8'}
                    strokeWidth={isNext ? '0.8' : '0.5'}
                    opacity={0.9}
                  />
                  {/* Pulse for next stop */}
                  {isNext && (
                    <circle
                      cx={stopX(i)}
                      cy={stopY(i)}
                      r="4"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="0.5"
                      opacity="0.4"
                    >
                      <animate attributeName="r" values="2.5;5;2.5" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Stop label */}
                  <text
                    x={stopX(i) + (i === 0 ? 2 : i === ROUTE_STOPS.length - 1 ? -2 : 2)}
                    y={stopY(i) - 2.5}
                    fill={isPassed ? '#c7d2fe' : isNext ? '#6ee7b7' : 'rgba(148,163,184,0.6)'}
                    fontSize="3.2"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="700"
                    textAnchor={i === ROUTE_STOPS.length - 1 ? 'end' : 'start'}
                  >
                    {stop.name}
                  </text>
                </g>
              );
            })}

            {/* Bus icon (circle with glow) */}
            <g>
              {/* Glow */}
              <circle cx={busX} cy={busY} r="5" fill="rgba(99,102,241,0.15)">
                <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
              </circle>
              {/* Shadow */}
              <circle cx={busX} cy={busY} r="3.8" fill="rgba(0,0,0,0.3)" />
              {/* Bus dot */}
              <circle cx={busX} cy={busY} r="3" fill="#6366f1" stroke="white" strokeWidth="1" />
              {/* Center pin */}
              <circle cx={busX} cy={busY} r="1.2" fill="white" />
            </g>
          </svg>

          {/* Map overlays */}
          {/* Speed badge top-left */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-lg">speed</span>
            <div>
              <p className="text-xl font-black tabular-nums leading-none">{speed}</p>
              <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest">km/h</p>
            </div>
          </div>

          {/* ETA badge top-right */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-lg">schedule</span>
            <div className="text-right">
              <p className="text-xl font-black tabular-nums leading-none">{etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`}</p>
              <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest">{t('estimated_arrival')}</p>
            </div>
          </div>

          {/* Last update badge - bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white/70 rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            Updated: {formatTime(lastUpdate)}
          </div>
        </section>

        {/* === ROUTE PROGRESS === */}
        <section className="mx-4 mt-4 bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-outline-variant/20 dark:border-slate-700/50 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-on-surface-variant/60 dark:text-slate-500 uppercase tracking-[0.2em]">{t('route_progress')}</span>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{currentKm} / {TOTAL_KM} km</span>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-surface-container dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              style={{ width: `${progress}%` }}
            />
            {/* Animated shimmer */}
            <div
              className="absolute top-0 h-full w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-[shimmer_2s_infinite]"
              style={{ left: `calc(${progress}% - 4rem)` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/50 dark:text-slate-600 uppercase tracking-widest">
            <span>Toshkent</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-black">{Math.round(progress)}%</span>
            <span>Buxoro</span>
          </div>
        </section>

        {/* === STATS GRID === */}
        <section className="mx-4 mt-4 grid grid-cols-2 gap-3">
          {/* Next Stop */}
          <div className="col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-5 flex items-center gap-4 shadow-lg shadow-emerald-500/20">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">location_on</span>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em]">{t('next_stop')}</p>
              <p className="text-2xl font-black text-white tracking-tight">{nextStop.name}</p>
              <p className="text-[10px] font-bold text-white/70">{Math.max(0, nextStop.km - currentKm)} km remaining</p>
            </div>
          </div>

          {/* Speed */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 border border-outline-variant/20 dark:border-slate-700/50 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">speed</span>
            </div>
            <p className="text-[9px] font-black text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-[0.2em]">{t('speed')}</p>
            <p className="text-3xl font-black text-indigo-900 dark:text-white tabular-nums leading-none">{speed} <span className="text-sm font-bold text-on-surface-variant/50 dark:text-slate-500">km/h</span></p>
          </div>

          {/* Bus Location */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-5 border border-outline-variant/20 dark:border-slate-700/50 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-violet-600 dark:text-violet-400">map</span>
            </div>
            <p className="text-[9px] font-black text-on-surface-variant/50 dark:text-slate-500 uppercase tracking-[0.2em]">{t('bus_location')}</p>
            <p className="text-sm font-black text-indigo-900 dark:text-white leading-snug">{ROUTE_STOPS[currentStopIdx].name} → {nextStop.name}</p>
          </div>
        </section>

        {/* === STOPS TIMELINE === */}
        <section className="mx-4 mt-4 bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-outline-variant/20 dark:border-slate-700/50 shadow-sm">
          <h2 className="text-[10px] font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] mb-5">Marshrut bekatlari</h2>
          <div className="space-y-0">
            {ROUTE_STOPS.map((stop, i) => {
              const isPassed = stop.km < currentKm;
              const isCurrent = stop.km <= currentKm && (i === ROUTE_STOPS.length - 1 || ROUTE_STOPS[i + 1].km > currentKm);
              const isUpcoming = stop.km > currentKm;
              const isLast = i === ROUTE_STOPS.length - 1;
              return (
                <div key={i} className="flex items-start gap-4">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center flex-shrink-0 w-6">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${isPassed ? 'bg-indigo-600' : isCurrent ? 'bg-emerald-500 ring-4 ring-emerald-500/30' : 'bg-surface-container dark:bg-slate-700 border-2 border-outline-variant/30 dark:border-slate-600'}`}>
                      {isPassed && <span className="material-symbols-outlined text-white" style={{ fontSize: '11px' }}>check</span>}
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-8 mt-1 ${isPassed ? 'bg-indigo-400' : 'bg-outline-variant/30 dark:bg-slate-700'}`} />
                    )}
                  </div>
                  {/* Stop info */}
                  <div className={`pb-6 flex-1 flex justify-between items-center ${isLast ? 'pb-0' : ''}`}>
                    <div>
                      <p className={`font-bold text-sm tracking-tight ${isPassed ? 'text-indigo-600 dark:text-indigo-400 line-through opacity-60' : isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface dark:text-slate-100'}`}>
                        {stop.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/50 dark:text-slate-600 font-medium">{stop.km} km</p>
                    </div>
                    {isCurrent && (
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full uppercase tracking-widest">Hozir shu yerda</span>
                    )}
                    {isPassed && (
                      <span className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest">O'tdi</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
