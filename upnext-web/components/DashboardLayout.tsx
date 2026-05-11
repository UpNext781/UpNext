'use client'; // Crucial for interactive elements like useState

import React, { useState } from 'react';
import { LayoutDashboard, Calendar, ShieldCheck, Users, Settings, MessageSquare, Menu, X, Send } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Lucas here. Standing by for operations. How can I help?' }
  ]);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '#' },
    { name: 'Smart Schedule', icon: <Calendar size={20} />, href: '#' },
    { name: 'Vouch System', icon: <ShieldCheck size={20} />, href: '#' },
    { name: 'Staff Management', icon: <Users size={20} />, href: '#' },
    { name: 'Settings', icon: <Settings size={20} />, href: '#' },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to UI
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      // Add Lucas/Roxy's response to UI
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content || data.message }]);
    } catch (error) {
      console.error('Comms Error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* --- Sidebar Navigation --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent italic">UPNEXT</h1>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-600/10 hover:text-blue-400 transition-colors group">
              <span className="text-slate-400 group-hover:text-blue-400">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isSidebarOpen && <span className="text-[10px] uppercase tracking-wider text-slate-400">Lucas & Roxy Online</span>}
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Live Operations</h2>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg">AM</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>

      {/* --- Comms Hub (Right Sidebar) --- */}
      <aside className="w-80 bg-slate-900 border-l border-slate-800 hidden lg:flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-400" />
            <span className="font-semibold text-xs uppercase tracking-wider">Comms Hub</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message specialists..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-white transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
