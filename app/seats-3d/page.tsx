'use client';

import React, { useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// --- MOCK SEATS CONFIG ---
const rows = 12;
const SEATS = Array.from({ length: rows * 4 }).map((_, i) => {
  const row = Math.floor(i / 4);
  const col = i % 4; // 0, 1 = left, 2, 3 = right
  return {
    id: `S${i+1}`,
    name: `${row + 1}${['A', 'B', 'C', 'D'][col]}`,
    position: [
      (col < 2 ? -0.8 : 0.8) + (col % 2 === 0 ? -0.4 : 0.4), 
      0, 
      (row - rows/2) * 1.2
    ] as [number, number, number],
    status: Math.random() > 0.7 ? 'booked' : 'free',
  };
});

// A Single 3D Seat Component
function Seat({ data, selected, onClick }: any) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Offline Text Generation (No CDN Fetching to prevent crashes!)
  const labelTexture = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 128, 64);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; // subtle background for contrast
      ctx.roundRect ? ctx.roundRect(0, 0, 128, 64, 16) : ctx.fillRect(0,0,128,64);
      ctx.fill();
      ctx.font = 'bold 36px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillStyle = data.status === 'booked' ? '#fca5a5' : '#ffffff'; // light red for booked, white others
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.name, 64, 34);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, [data.name, data.status]);

  // Subtle lazy animation
  useFrame((state) => {
    if (selected && meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.2, 0.1);
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    } else if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
    }
  });

  // Professional colors: Booked (Red), Selected (Blue), Free (Gray)
  const baseColor = data.status === 'booked' ? '#991b1b' : selected ? '#2563eb' : '#64748b';
  const cushionColor = data.status === 'booked' ? '#ef4444' : selected ? '#3b82f6' : '#94a3b8';

  return (
    <group 
      ref={meshRef} 
      position={data.position} 
      onClick={(e) => { e.stopPropagation(); data.status === 'free' && onClick(data.name); }}
      onPointerOver={() => document.body.style.cursor = data.status === 'free' ? 'pointer' : 'not-allowed'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Base/Legs */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color={data.status === 'booked' ? '#7f1d1d' : '#1e293b'} metalness={0.8} />
      </mesh>
      
      {/* Bottom Cushion */}
      <RoundedBox args={[0.6, 0.2, 0.6]} position={[0, 0.1, 0]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color={cushionColor} roughness={0.7} />
      </RoundedBox>

      {/* Backrest */}
      <RoundedBox args={[0.6, 0.7, 0.15]} position={[0, 0.55, -0.25]} rotation={[-0.1, 0, 0]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color={baseColor} roughness={0.7} />
      </RoundedBox>
      
      {/* Headrest */}
      <RoundedBox args={[0.4, 0.2, 0.1]} position={[0, 0.95, -0.3]} rotation={[-0.1, 0, 0]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </RoundedBox>

      {/* 3D Seat Label Text (Offline CanvasTexture) */}
      {labelTexture && (
        <mesh position={[0, 0.6, -0.17]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial map={labelTexture} transparent opacity={0.95} alphaTest={0.1} />
        </mesh>
      )}
    </group>
  );
}

function WebGLSeatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const handleSeatClick = (name: string) => {
    setSelectedSeats(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  return (
    <div className="h-screen w-full bg-slate-900 relative font-sans overflow-hidden">
      
      {/* Overlay UI */}
      <header className="absolute top-0 left-0 w-full p-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition">
            <span className="material-symbols-outlined text-white">arrow_back</span>
          </button>
          <div className="text-white">
            <h1 className="font-black text-xl tracking-tight">O'rindiqni tanlang</h1>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">3D VIZUALIZATSIYA (WebGL)</p>
          </div>
        </div>
      </header>

      {/* THREE.JS CANVAS */}
      {mounted && (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 45 }}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
          <spotLight position={[-5, 10, -5]} intensity={0.5} angle={0.5} penumbra={1} castShadow />

          {/* Bus Environment */}
          <group position={[0, -0.5, 0]}>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[4, 20]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.6} far={10} color="#000" />
          </group>

          {/* Seats Mapping */}
          {SEATS.map(seat => (
            <Seat 
              key={seat.id} 
              data={seat} 
              selected={selectedSeats.includes(seat.name)} 
              onClick={handleSeatClick} 
            />
          ))}

          <OrbitControls 
            enablePan={false}
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2 - 0.1}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        </Canvas>
      )}

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex items-center justify-between pointer-events-auto shadow-2xl max-w-2xl mx-auto">
            <div>
              <p className="text-[10px] text-white/50 font-black tracking-widest uppercase mb-1">Tanlangan</p>
              <h2 className="text-2xl font-black text-white">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Hech nima'}
              </h2>
            </div>
            
            <button 
              disabled={selectedSeats.length === 0}
              onClick={() => {
                const query = new URLSearchParams(searchParams.toString());
                query.set('seats', selectedSeats.join(','));
                router.push(`/booking?${query.toString()}`);
              }}
              className={`px-8 py-4 rounded-2xl font-black tracking-widest transition-all ${selectedSeats.length > 0 ? 'bg-indigo-600 text-white hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              DAVOM ETISH
            </button>
          </div>
      </div>
      
    </div>
  );
}

export default function WebGLSeatsRoute() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-slate-900 flex items-center justify-center">
         <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Yuklanmoqda 3D...</p>
       </div>
    }>
      <WebGLSeatsPage />
    </Suspense>
  );
}
