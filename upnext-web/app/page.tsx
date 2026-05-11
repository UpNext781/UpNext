'use client';

import React, { useState } from 'react';
import { Shield, Radio, ChevronRight } from 'lucide-react';

export default function Page() {
  const [activeSpecialist, setActiveSpecialist] = useState<'Lucas' | 'Roxy'>('Lucas');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="border-l-4 border-blue-600 pl-6 py-2">
        <h2 className="text-xs font-black tracking-[0.3em] text-blue-500 uppercase mb-2">Project Val Infrastructure</h2>
        <h1 className="text-5xl font-extrabold text-white tracking-tighter">
          UPNEXT <span className="text-slate-500">CONCIERGE</span>
        </h1>
        <p className="text-slate-400 mt-4 max-w-xl text-sm leading-relaxed">
          Your high-end noir tactical strategist and protector. Choose your contact below to manage current operations.
        </p>
      </div>

      {/* Specialist Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Lucas', 'Roxy'].map((name) => (
          <button
            key={name}
            onClick={() => setActiveSpecialist(name as 'Lucas' | 'Roxy')}
            className={`group relative p-8 rounded-2xl border transition-all duration-500 text-left ${
              activeSpecialist === name 
              ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_30px_-10px_rgba(37,99,235,0.3)]' 
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${activeSpecialist === name ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {name === 'Lucas' ? <Shield size={24} /> : <Radio size={24} />}
              </div>
              <ChevronRight className={`transition-transform ${activeSpecialist === name ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </div>
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{name}</h3>
            <p className="text-slate-500 text-sm mt-1">
              {name === 'Lucas' ? 'Tactical Operations & Security' : 'Hospitality & Specialist Relations'}
            </p>
          </button>
        ))}
      </div>

      {/* System Status Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">System Status</p>
            <p className="text-white font-mono text-sm">SECURE // ENCRYPTED_CHANNEL_ACTIVE</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Active Specialist</p>
          <p className="text-blue-400 font-mono text-sm">{activeSpecialist.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
