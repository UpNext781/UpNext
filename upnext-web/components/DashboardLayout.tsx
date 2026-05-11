'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, ShieldCheck, Users, Settings, MessageSquare, Menu, X, Send } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Lucas here. Standing by for operations. How can I help?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
    { name: 'Smart Schedule', icon: <Calendar size={20} />, href: '#' },
    { name: 'Vouch System', icon: <ShieldCheck size={20} />, href: '#' },
    { name: 'Staff Management', icon: <Users size={20} />, href: '#' },
    { name: 'Settings', icon: <Settings size={20} />, href: '#' },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.content || data.message || "Connection intermittent. Try again." 
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Tactical Error: Could not reach operations server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* --- Sidebar Navigation --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col hidden md:flex`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-black tracking-tighter text-blue-500 italic">UPNEXT</h1>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded text-slate-500">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-600/10 hover:text-blue-400 transition-all group">
              <span className="text-slate-500 group-hover:text-blue-400">{item.icon}</span>
              {isSidebarOpen && <span className="font-semibold text-sm tracking-tight">{item.name}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Live</span>}
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 backdrop-blur-md">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Live Operations</h2>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-900/20">AM</div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 lg:p-12">
          {children}
        </section>
      </main>

      {/* --- Comms Hub (The Chat) --- */}
      <aside className="w-80 bg-slate-900/50 border-l border-slate-800 hidden xl:flex flex-col backdrop-blur-xl">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-500" />
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-300">Comms Hub</span>
          </div>
        </div>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-[10px] text-slate-500 animate-pulse font-mono uppercase tracking-widest">Encrypting transmission...</div>}
        </div>

        {/* Tactical Input */}
        <div className="p-6">
          <form onSubmit={handleSendMessage} className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message specialists..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-5 pr-12 py-4 text-xs focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 group-hover:text-blue-400 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
