import React, { useState } from 'react';
import { LayoutDashboard, Calendar, ShieldCheck, Users, Settings, MessageSquare, Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '#' },
    { name: 'Smart Schedule', icon: <Calendar size={20} />, href: '#' },
    { name: 'Vouch System', icon: <ShieldCheck size={20} />, href: '#' },
    { name: 'Staff Management', icon: <Users size={20} />, href: '#' },
    { name: 'Settings', icon: <Settings size={20} />, href: '#' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* --- Sidebar Navigation --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">UPNEXT</h1>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-600/10 hover:text-blue-400 transition-colors group">
              <span className="text-slate-400 group-hover:text-blue-400">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isSidebarOpen && <span className="text-xs text-slate-400">Lucas & Roxy Online</span>}
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Live Operations</h2>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">AM</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>

      {/* --- Comms Hub (Right Sidebar) --- */}
      <aside className="w-80 bg-slate-900 border-l border-slate-800 hidden lg:flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-400" />
          <span className="font-semibold text-sm uppercase tracking-wider">Comms Hub</span>
        </div>
        <div className="flex-1 p-4 text-sm text-slate-500 italic">
          Lucas and Roxy are ready to assist. Send a message to start...
        </div>
        <div className="p-4 border-t border-slate-800">
           <input 
             type="text" 
             placeholder="Message specialists..." 
             className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
           />
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
