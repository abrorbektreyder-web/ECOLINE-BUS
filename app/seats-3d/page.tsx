'use client';

import React, { useState, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, ContactShadows, RoundedBox } from '@react-three/drei';
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

  const baseColor = data.status === 'booked' ? '#334155' : selected ? '#10b981' : '#6366f1';
  const cushionColor = data.status === 'booked' ? '#475569' : selected ? '#34d399' : '#818cf8';

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
        <meshStandardMaterial color="#1f2937" metalness={0.8} />
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
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </RoundedBox>

      {/* Label */}
      <Text position={[0, 0.6, -0.15]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
        {data.name}
      </Text>
    </group>
  );
}

export default function WebGLSeatsPage() {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
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
        <Environment preset="city" />
      </Canvas>

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
              onClick={() => router.push('/booking')}
              className={`px-8 py-4 rounded-2xl font-black tracking-widest transition-all ${selectedSeats.length > 0 ? 'bg-indigo-600 text-white hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              DAVOM ETISH
            </button>
         </div>
      </div>
      
    </div>
  );
}
