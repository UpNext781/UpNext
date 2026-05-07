"use client";
import { useState } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('Cosmo'); // Default to Cosmo
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          characterPreference: persona
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 border border-zinc-800 rounded-lg bg-black text-white shadow-2xl">
      {/* Header with Toggle */}
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold tracking-widest uppercase">Concierge</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setPersona('Cosmo')}
            className={`px-3 py-1 rounded ${persona === 'Cosmo' ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-500'}`}
          >
            Cosmo
          </button>
          <button 
            onClick={() => setPersona('Roxy')}
            className={`px-3 py-1 rounded ${persona === 'Roxy' ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-500'}`}
          >
            Roxy
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-zinc-800' : 'bg-zinc-200 text-black'}`}>
              <p className="text-sm">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-zinc-500 animate-pulse text-xs italic">The concierge is typing...</div>}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk to ${persona}...`}
          className="flex-1 bg-zinc-900 border border-zinc-700 p-2 rounded outline-none focus:border-white transition-colors"
        />
        <button type="submit" className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-zinc-300">
          Send
        </button>
      </form>
    </div>
  );
}
