'use client';

import React, { useState, useCallback } from 'react';
import { 
  Zap, 
  Building2, 
  Clock, 
  MapPin, 
  Calendar as CalendarIcon,
  TrendingUp,
  DollarSign,
  Bell,
  Check,
  X,
  Users,
  ChevronRight,
  Star,
  Send,
  Loader2
} from 'lucide-react';

type ViewMode = 'specialist' | 'venue';

interface ShiftNotification {
  id: string;
  venueName: string;
  message: string;
  urgent: boolean;
}

const YANTRA_API = 'https://yantra-zero-core.vercel.app/api/upnext-sync';
const AUTH_TOKEN = 'Bearer orcha_live_v1_8f7b6c5d4a3e2f1g0h9';

export default function UpNextWorkspace() {
  const [viewMode, setViewMode] = useState<ViewMode>('specialist');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<ShiftNotification | null>({
    id: '1',
    venueName: 'Omnia Vegas',
    message: 'requests immediate booking. Confirm deployment?',
    urgent: true
  });
  
  // Specialist state
  const [availability, setAvailability] = useState<Set<string>>(new Set(['2024-01-15', '2024-01-17', '2024-01-19', '2024-01-20']));
  
  // Venue state
  const [shiftForm, setShiftForm] = useState({
    date: '',
    timeStart: '',
    timeEnd: '',
    role: '',
    rate: ''
  });

  const syncWithYantra = useCallback(async (action: string, payload: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      // Simulate async POST request
      console.log('[v0] Syncing with Yantra Core:', { action, payload });
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // In production, this would be:
      // const response = await fetch(YANTRA_API, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': AUTH_TOKEN
      //   },
      //   body: JSON.stringify({ action, payload })
      // });
      
      console.log('[v0] Yantra sync complete');
      return { success: true };
    } catch (error) {
      console.error('[v0] Yantra sync failed:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewChange = async (mode: ViewMode) => {
    await syncWithYantra('view_change', { from: viewMode, to: mode });
    setViewMode(mode);
  };

  const handleAcceptShift = async () => {
    if (!notification) return;
    await syncWithYantra('accept_shift', { shiftId: notification.id, venue: notification.venueName });
    setNotification(null);
  };

  const handleDeclineShift = () => {
    setNotification(null);
  };

  const toggleAvailability = async (date: string) => {
    const newAvailability = new Set(availability);
    if (newAvailability.has(date)) {
      newAvailability.delete(date);
    } else {
      newAvailability.add(date);
    }
    setAvailability(newAvailability);
    await syncWithYantra('availability_update', { dates: Array.from(newAvailability) });
  };

  const handleBroadcastShift = async () => {
    await syncWithYantra('broadcast_shift', shiftForm);
    setShiftForm({ date: '', timeStart: '', timeEnd: '', role: '', rate: '' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-card-glow p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-accent-emerald animate-spin" />
            <p className="text-sm text-muted-foreground font-medium tracking-wide">
              SYNCING WITH YANTRA CORE...
            </p>
          </div>
        </div>
      )}

      {/* Shift Alert Notification */}
      {notification && viewMode === 'specialist' && (
        <div className="fixed top-0 left-0 right-0 z-40 p-4 slide-down">
          <div className="max-w-2xl mx-auto glass-card neon-pink border-accent-pink/30 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-pink/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-pink" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  <span className="text-accent-pink">{notification.venueName}</span> {notification.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeclineShift}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleAcceptShift}
                className="px-4 py-2 rounded-lg bg-accent-pink text-white font-semibold text-sm hover:bg-accent-pink/80 transition-colors neon-pink"
              >
                Accept Shift
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Entry Gateway Header */}
        <header className="text-center py-8 md:py-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2">
            UPNEXT <span className="text-muted-foreground">//</span>{' '}
            <span className="italic text-accent-emerald text-glow-emerald">Complete Operational Control</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mt-4">
            Premium digital infrastructure for the nightlife and hospitality sector
          </p>
        </header>

        {/* Role Selector Toggle */}
        <div className="flex justify-center">
          <div className="glass-card p-1.5 inline-flex gap-1">
            <button
              onClick={() => handleViewChange('specialist')}
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                viewMode === 'specialist'
                  ? 'bg-accent-emerald text-background neon-emerald'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4" />
              Specialist (Talent)
            </button>
            <button
              onClick={() => handleViewChange('venue')}
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                viewMode === 'venue'
                  ? 'bg-accent-emerald text-background neon-emerald'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Venue (Operator)
            </button>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === 'specialist' ? (
          <SpecialistDashboard 
            availability={availability}
            onToggleAvailability={toggleAvailability}
            isLoading={isLoading}
          />
        ) : (
          <VenuePortal 
            shiftForm={shiftForm}
            setShiftForm={setShiftForm}
            onBroadcast={handleBroadcastShift}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// SPECIALIST DASHBOARD (Mobile-First Focus)
// ============================================

interface SpecialistDashboardProps {
  availability: Set<string>;
  onToggleAvailability: (date: string) => void;
  isLoading: boolean;
}

function SpecialistDashboard({ availability, onToggleAvailability, isLoading }: SpecialistDashboardProps) {
  const stats = {
    shiftsLocked: 24,
    hoursLogged: 186,
    earnings: 12450
  };

  return (
    <div className="space-y-6">
      {/* Next Up - Live Status Card */}
      <div className="glass-card-glow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Next Up</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="beacon-pulse absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-emerald"></span>
            </span>
            <span className="text-xs font-semibold text-accent-emerald">On-Site / Active</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Hakkasan Las Vegas</h3>
            <p className="text-muted-foreground text-sm mt-1">VIP Host • Main Floor</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">10:00 PM - 4:00 AM</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Las Vegas, NV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Shifts Locked</p>
              <p className="text-3xl font-black text-white">{stats.shiftsLocked}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-accent-emerald" />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Hours Logged</p>
              <p className="text-3xl font-black text-white">{stats.hoursLogged}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-pink/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent-pink" />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">Dispatched Earnings</p>
              <p className="text-3xl font-black text-white">${stats.earnings.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent-emerald" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-accent-emerald text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+18% this month</span>
          </div>
        </div>
      </div>

      {/* Availability Matrix */}
      <div className="glass-card p-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Availability Matrix
        </h2>
        <AvailabilityCalendar 
          availability={availability} 
          onToggle={onToggleAvailability}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

// ============================================
// AVAILABILITY CALENDAR COMPONENT
// ============================================

interface AvailabilityCalendarProps {
  availability: Set<string>;
  onToggle: (date: string) => void;
  disabled: boolean;
}

function AvailabilityCalendar({ availability, onToggle, disabled }: AvailabilityCalendarProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate dates for current month view
  const generateDates = () => {
    const dates = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const startPadding = firstDay.getDay();
    
    // Add padding for previous month
    for (let i = 0; i < startPadding; i++) {
      dates.push(null);
    }
    
    // Add days of current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dates.push({ day, dateStr });
    }
    
    return dates;
  };

  const dates = generateDates();

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Date grid */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, idx) => (
          <button
            key={idx}
            disabled={!date || disabled}
            onClick={() => date && onToggle(date.dateStr)}
            className={`
              aspect-square rounded-lg text-sm font-semibold transition-all duration-200
              ${!date ? 'invisible' : ''}
              ${date && availability.has(date.dateStr) 
                ? 'bg-accent-emerald text-background neon-emerald' 
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {date?.day}
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-accent-emerald"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-white/10"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// VENUE PORTAL (Desktop-First Focus)
// ============================================

interface VenuePortalProps {
  shiftForm: {
    date: string;
    timeStart: string;
    timeEnd: string;
    role: string;
    rate: string;
  };
  setShiftForm: React.Dispatch<React.SetStateAction<{
    date: string;
    timeStart: string;
    timeEnd: string;
    role: string;
    rate: string;
  }>>;
  onBroadcast: () => void;
  isLoading: boolean;
}

function VenuePortal({ shiftForm, setShiftForm, onBroadcast, isLoading }: VenuePortalProps) {
  const activeRoster = [
    { name: 'Maya Sterling', role: 'VIP Host', zone: 'Main Floor', status: 'Active' },
    { name: 'Jake Reyes', role: 'Security', zone: 'VIP Section', status: 'Active' },
    { name: 'Aisha Cole', role: 'Bartender', zone: 'Sky Bar', status: 'Break' },
    { name: 'Damon West', role: 'DJ', zone: 'Main Stage', status: 'Active' },
    { name: 'Priya Shah', role: 'Server', zone: 'Cabanas', status: 'Transitioning' },
  ];

  const availableSpecialists = [
    { name: 'Sienna Blaze', skills: ['VIP Host', 'Bottle Service'], rating: 4.9, available: true },
    { name: 'Marcus King', skills: ['Security', 'Event Coord'], rating: 4.8, available: true },
    { name: 'Luna Torres', skills: ['Bartender', 'Flair'], rating: 5.0, available: true },
    { name: 'Tyler Chase', skills: ['DJ', 'MC'], rating: 4.7, available: true },
    { name: 'Zara Knight', skills: ['Server', 'VIP Host'], rating: 4.9, available: true },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-accent-emerald text-background';
      case 'Break': return 'bg-warning/20 text-warning';
      case 'Transitioning': return 'bg-accent-pink/20 text-accent-pink';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Roster Grid */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Live Roster</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="beacon-pulse absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
            </span>
            <span className="text-xs text-muted-foreground">{activeRoster.length} Active</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialist</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Zone/Station</th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeRoster.map((member, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-emerald/30 to-accent-pink/30 flex items-center justify-center text-xs font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground text-sm">{member.role}</td>
                  <td className="py-4 px-4 text-muted-foreground text-sm">{member.zone}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Dispatcher */}
      <div className="glass-card p-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Smart Dispatcher</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Date</label>
            <input
              type="date"
              value={shiftForm.date}
              onChange={(e) => setShiftForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-emerald/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Start Time</label>
            <input
              type="time"
              value={shiftForm.timeStart}
              onChange={(e) => setShiftForm(prev => ({ ...prev, timeStart: e.target.value }))}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-emerald/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">End Time</label>
            <input
              type="time"
              value={shiftForm.timeEnd}
              onChange={(e) => setShiftForm(prev => ({ ...prev, timeEnd: e.target.value }))}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-emerald/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Role Type</label>
            <select
              value={shiftForm.role}
              onChange={(e) => setShiftForm(prev => ({ ...prev, role: e.target.value }))}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-emerald/50 transition-colors"
            >
              <option value="">Select Role</option>
              <option value="vip-host">VIP Host</option>
              <option value="security">Security</option>
              <option value="bartender">Bartender</option>
              <option value="server">Server</option>
              <option value="dj">DJ</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Hourly Rate</label>
            <input
              type="text"
              placeholder="$50/hr"
              value={shiftForm.rate}
              onChange={(e) => setShiftForm(prev => ({ ...prev, rate: e.target.value }))}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent-emerald/50 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={onBroadcast}
          disabled={isLoading}
          className="mt-6 w-full md:w-auto px-8 py-3 bg-accent-emerald text-background font-bold rounded-xl hover:bg-accent-emerald/90 transition-all neon-emerald disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Broadcast to Network
        </button>
      </div>

      {/* Roster Discovery */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Roster Discovery</h2>
          <button className="text-xs text-accent-emerald font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
          {availableSpecialists.map((specialist, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 w-64 glass-card p-5 hover:border-accent-emerald/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-pink/30 to-accent-emerald/30 flex items-center justify-center text-sm font-bold text-white">
                  {specialist.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold">{specialist.rating}</span>
                </div>
              </div>
              
              <h3 className="font-bold text-white mb-2">{specialist.name}</h3>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {specialist.skills.map((skill, skillIdx) => (
                  <span 
                    key={skillIdx}
                    className="px-2 py-1 bg-white/5 rounded text-xs text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full py-2 rounded-lg border border-accent-emerald/30 text-accent-emerald text-sm font-semibold hover:bg-accent-emerald/10 transition-all group-hover:border-accent-emerald/50">
                Direct Invite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
