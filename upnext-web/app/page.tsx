'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function UpNextConcierge() {
  const [activeCharacter, setActiveCharacter] = useState<'Lucas' | 'Roxy'>('Lucas');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mapping characters to the Voice IDs you saved in Vercel
  const voiceMap = {
    Lucas: '4tRn1lSkEn13EVTuqb0g', // Adam (Dark & Tough)
    Roxy: 'sJGSzrOOtoYSYJarCtSZ',  // Sharvari (Noir Specialist)
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          voiceId: voiceMap[activeCharacter],
        }),
      });

      if (!response.ok) throw new Error('Speech synthesis failed');

      // Process and play the audio immediately
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      setInput(''); // Clear input after successful transmission
    } catch (error) {
      console.error('Tactical Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans text-slate-800">
      <div className="max-w-2xl text-center mb-8">
        <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">Project Val Infrastructure</p>
        <h1 className="text-4xl font-bold tracking-tighter mb-4">UPNEXT CONCIERGE</h1>
        <p className="text-slate-600">Your high-end noir tactical strategist and protector. Choose your contact below.</p>
      </div>

      <div className="w-full max-w-xl bg-black rounded-xl shadow-2xl overflow-hidden border border-slate-800">
        {/* Header / Character Selector */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-white font-black tracking-widest text-xl">CONCIERGE</h2>
          <div className="flex gap-2 bg-slate-900 p-1 rounded-lg">
            <button
              onClick={() => setActiveCharacter('Lucas')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeCharacter === 'Lucas' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lucas
            </button>
            <button
              onClick={() => setActiveCharacter('Roxy')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeCharacter === 'Roxy' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Roxy
            </button>
          </div>
        </div>

        {/* Terminal / Chat Display Area */}
        <div className="h-96 p-6 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
          <div className="border-l-2 border-slate-700 pl-4 py-2">
            <p className="text-slate-500 text-xs mb-1 uppercase tracking-widest">System Status: Secure</p>
            <p className="text-white text-sm opacity-80">
              {activeCharacter} is standing by. Send a transmission to begin.
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Talk to ${activeCharacter}...`}
            className="flex-1 bg-black border border-slate-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-white text-black font-bold px-6 py-3 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
}