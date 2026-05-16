'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Briefcase, 
  Clock, 
  MapPin, 
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronRight,
  Star,
  Send,
  Loader2,
  Wine,
  Car,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  Zap,
  ArrowRight,
  Search,
  Utensils,
  CircleDot,
  Flame,
  Sofa
} from 'lucide-react';

type PortalMode = 'public' | 'operator';

const YANTRA_API = 'https://yantra-zero-core.vercel.app/api/upnext-sync';
const AUTH_TOKEN = 'Bearer orcha_live_v1_8f7b6c5d4a3e2f1g0h9';

export default function UpNextWorkspace() {
  const [portalMode, setPortalMode] = useState<PortalMode>('public');
  const [isLoading, setIsLoading] = useState(false);

  const syncWithYantra = useCallback(async (action: string, payload: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      // In production:
      // const response = await fetch(YANTRA_API, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': AUTH_TOKEN
      //   },
      //   body: JSON.stringify({ action, payload })
      // });
      return { success: true };
    } catch {
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePortalChange = async (mode: PortalMode) => {
    await syncWithYantra('portal_switch', { from: portalMode, to: mode });
    setPortalMode(mode);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-card-glow p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-accent-gold animate-spin" />
            <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
              Syncing with Yantra Core...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header with Brand Logo */}
        <header className="py-6 md:py-10">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src="/images/upnext-logo.jpg"
                alt="UpNext - Phoenix's Premier Dancers"
                width={600}
                height={200}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
        </header>

        {/* Dual Gateway Toggle */}
        <div className="flex justify-center">
          <div className="glass-card p-1.5 inline-flex gap-1">
            <button
              onClick={() => handlePortalChange('public')}
              disabled={isLoading}
              className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                portalMode === 'public'
                  ? 'btn-gold neon-gold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Public Portal</span>
              <span className="sm:hidden">Public</span>
              <span className="hidden md:inline text-xs opacity-70">(Client Experience)</span>
            </button>
            <button
              onClick={() => handlePortalChange('operator')}
              disabled={isLoading}
              className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                portalMode === 'operator'
                  ? 'btn-gold neon-gold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Operator App</span>
              <span className="sm:hidden">Operator</span>
              <span className="hidden md:inline text-xs opacity-70">(Secure Briefcase)</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        {portalMode === 'public' ? (
          <PublicPortal syncWithYantra={syncWithYantra} isLoading={isLoading} />
        ) : (
          <OperatorApp syncWithYantra={syncWithYantra} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENT A: PUBLIC MARKETING WEB FUNNEL
// "The Theater" - Premium, alluring B2C experience
// ============================================

interface PublicPortalProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  isLoading: boolean;
}

function PublicPortal({ syncWithYantra, isLoading }: PublicPortalProps) {
  const [conciergeForm, setConciergeForm] = useState({
    date: '',
    tableType: '',
    bottleService: '',
    transport: false,
    guestCount: ''
  });

  const handleConciergeSubmit = async () => {
    await syncWithYantra('vip_request', conciergeForm);
    setConciergeForm({ date: '', tableType: '', bottleService: '', transport: false, guestCount: '' });
  };

  const tonightsLineup = [
    { id: 1, alias: 'Diamond Elite', specialty: 'VIP Hosting', rating: 5.0, status: 'Live Now', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face' },
    { id: 2, alias: 'Velvet Stage', specialty: 'Performance', rating: 4.9, status: 'Available 10PM', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face' },
    { id: 3, alias: 'Crimson Lounge', specialty: 'Bottle Service', rating: 4.8, status: 'Live Now', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face' },
    { id: 4, alias: 'Gold Reserve', specialty: 'Private Events', rating: 5.0, status: 'Available 11PM', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face' },
    { id: 5, alias: 'Platinum Floor', specialty: 'Main Stage', rating: 4.9, status: 'Live Now', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face' },
  ];

  return (
    <div className="space-y-10">
      {/* Main Stage Marquee - Cinematic Hero */}
      <section className="relative overflow-hidden rounded-xl marquee-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&h=800&fit=crop"
            alt="Luxury nightclub atmosphere"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-accent-crimson/40 via-background/80 to-accent-gold/20"></div>
        <div className="relative glass-card-glow p-8 md:p-14 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-gold mb-4">
              Phoenix&apos;s Premier Entertainment Network
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold italic text-foreground mb-6 leading-tight">
              <span className="text-gold-gradient">Elevate</span> Your Evening
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Exclusive access to Arizona&apos;s most distinguished hospitality specialists. 
              Reserve premium table placements and bespoke entertainment experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-gold px-8 py-4 rounded-lg text-sm flex items-center gap-2 neon-gold">
                <Wine className="w-4 h-4" />
                Reserve VIP Experience
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground border border-border hover:border-accent-gold/30 transition-all">
                View Tonight&apos;s Lineup
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Concierge Portal */}
      <section className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-gold/15 flex items-center justify-center">
            <Wine className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold italic text-foreground">VIP Concierge Portal</h2>
            <p className="text-xs text-muted-foreground">Reserve premium experiences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Reservation Date
            </label>
            <input
              type="date"
              value={conciergeForm.date}
              onChange={(e) => setConciergeForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent-gold/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Table Placement
            </label>
            <select
              value={conciergeForm.tableType}
              onChange={(e) => setConciergeForm(prev => ({ ...prev, tableType: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent-gold/50 transition-colors"
            >
              <option value="">Select Table</option>
              <option value="main-floor">Main Floor VIP</option>
              <option value="skybox">Skybox Suite</option>
              <option value="cabana">Private Cabana</option>
              <option value="owners">Owner&apos;s Table</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Bottle Service Package
            </label>
            <select
              value={conciergeForm.bottleService}
              onChange={(e) => setConciergeForm(prev => ({ ...prev, bottleService: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent-gold/50 transition-colors"
            >
              <option value="">Select Package</option>
              <option value="silver">Silver - 2 Premium Bottles</option>
              <option value="gold">Gold - 4 Premium + Champagne</option>
              <option value="platinum">Platinum - Full Service</option>
              <option value="custom">Custom Package</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Guest Count
            </label>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="# of Guests"
              value={conciergeForm.guestCount}
              onChange={(e) => setConciergeForm(prev => ({ ...prev, guestCount: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent-gold/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={conciergeForm.transport}
              onChange={(e) => setConciergeForm(prev => ({ ...prev, transport: e.target.checked }))}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors relative ${conciergeForm.transport ? 'bg-accent-gold' : 'bg-surface-elevated border border-border'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${conciergeForm.transport ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-muted-foreground group-hover:text-accent-gold transition-colors" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Add Luxury Transport</span>
            </div>
          </label>

          <button
            onClick={handleConciergeSubmit}
            disabled={isLoading}
            className="btn-crimson px-6 py-3 rounded-lg text-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit VIP Request
          </button>
        </div>
      </section>

      {/* Tonight's Lineup - Premium Horizontal Slider */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-crimson/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-crimson-light" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold italic text-foreground">Tonight&apos;s Lineup</h2>
              <p className="text-xs text-muted-foreground">Currently active in the Phoenix market</p>
            </div>
          </div>
          <button className="text-sm text-accent-gold hover:text-accent-gold-light transition-colors flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {tonightsLineup.map((talent) => (
            <div 
              key={talent.id}
              className="flex-none w-64 glass-card p-5 hover:border-accent-gold/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-accent-gold/30">
                  <Image
                    src={talent.image}
                    alt={talent.alias}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  talent.status === 'Live Now' 
                    ? 'bg-accent-gold/20 text-accent-gold' 
                    : 'bg-accent-crimson/20 text-accent-crimson-light'
                }`}>
                  {talent.status}
                </span>
              </div>
              
              <h3 className="text-base font-semibold text-foreground mb-1">{talent.alias}</h3>
              <p className="text-xs text-muted-foreground mb-3">{talent.specialty}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold" />
                  <span className="text-sm font-semibold text-foreground">{talent.rating}</span>
                </div>
                <button className="text-xs font-semibold text-accent-gold hover:text-accent-gold-light transition-colors group-hover:underline">
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The City Grid: Venue Directory */}
      <VenueDirectory />
    </div>
  );
}

// ============================================
// VENUE DIRECTORY COMPONENT
// "The City Grid" - Freemium venue aggregator
// ============================================

function VenueDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const filters = [
    { id: 'open-now', label: 'Open Now', icon: CircleDot },
    { id: 'after-hours', label: 'After Hours (4AM+)', icon: Clock },
    { id: 'zero-cover', label: 'Zero Cover', icon: DollarSign },
    { id: 'food-available', label: 'Food Available', icon: Utensils },
    { id: 'vip-transport', label: 'VIP Transport', icon: Car },
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    setActiveFilters(newFilters);
  };

  const venues = [
    {
      id: 1,
      name: "Christie's Cabaret",
      area: 'Tempe',
      isOpen: true,
      hours: '4:00 PM - 4:00 AM',
      coverCharge: '$20 Standard / Free before 9PM',
      tonightsSpecial: '$5 Domestics until Midnight',
      vibeTag: 'High-Energy',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Le Girls',
      area: 'West Valley',
      isOpen: true,
      hours: '6:00 PM - 2:00 AM',
      coverCharge: '$10 Flat / Free with VIP',
      tonightsSpecial: '2-for-1 Premium Cocktails',
      vibeTag: 'Lounge',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Bourbon Street',
      area: 'Central Phoenix',
      isOpen: false,
      hours: '8:00 PM - 4:00 AM',
      coverCharge: '$15 Standard / $25 VIP Express',
      tonightsSpecial: 'Live DJ + $8 Signature Shots',
      vibeTag: 'High-Energy',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop'
    },
  ];

  const filteredVenues = venues.filter(venue => {
    if (searchQuery && !venue.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeFilters.has('open-now') && !venue.isOpen) {
      return false;
    }
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-gold/15 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-accent-gold" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold italic text-foreground">The City Grid: Venue Directory</h2>
          <p className="text-xs text-muted-foreground">Insider intel on Phoenix&apos;s premier nightlife destinations</p>
        </div>
      </div>

      {/* Search & Filter Command */}
      <div className="glass-card p-5 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search venues by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent-gold/50 transition-colors placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilters.has(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/40'
                    : 'glass-card hover:border-accent-gold/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Venue Cards List */}
      <div className="space-y-4">
        {filteredVenues.map((venue) => (
          <div 
            key={venue.id}
            className="glass-card overflow-hidden hover:border-accent-gold/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row">
              {/* Venue Image */}
              <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/80 to-transparent"></div>
              </div>

              {/* Venue Info */}
              <div className="flex-1 p-5 md:p-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold italic text-foreground mb-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{venue.area}</span>
                    </div>
                  </div>
                  
                  {/* Live Status */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    venue.isOpen 
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : 'bg-accent-crimson/15 text-accent-crimson-light'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      venue.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-accent-crimson'
                    }`}></span>
                    <span className="text-xs font-semibold">
                      {venue.isOpen ? 'Open' : 'Closed'}
                    </span>
                    <span className="text-xs opacity-70">
                      {venue.hours}
                    </span>
                  </div>
                </div>

                {/* Intel Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cover Charge</p>
                    <p className="text-sm text-foreground font-medium">{venue.coverCharge}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tonight&apos;s Special</p>
                    <p className="text-sm text-accent-gold font-medium">{venue.tonightsSpecial}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vibe</p>
                    <div className="flex items-center gap-1.5">
                      {venue.vibeTag === 'High-Energy' ? (
                        <Flame className="w-3.5 h-3.5 text-accent-crimson-light" />
                      ) : (
                        <Sofa className="w-3.5 h-3.5 text-accent-gold" />
                      )}
                      <span className="text-sm text-foreground font-medium">{venue.vibeTag}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="btn-gold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 neon-gold group-hover:shadow-lg transition-all">
                  View Full Profile & Book VIP
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredVenues.length === 0 && (
          <div className="glass-card p-10 text-center">
            <p className="text-muted-foreground text-sm">No venues match your search criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// COMPONENT B: OPERATOR APP DASHBOARD
// "The Digital Briefcase" - Professional B2B tool
// ============================================

interface OperatorAppProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  isLoading: boolean;
}

function OperatorApp({ syncWithYantra, isLoading }: OperatorAppProps) {
  const [discretionMode, setDiscretionMode] = useState(false);
  const [availability, setAvailability] = useState<Set<string>>(new Set(['2024-01-15', '2024-01-17', '2024-01-19', '2024-01-20']));

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

  const toggleDiscretion = async () => {
    const newMode = !discretionMode;
    setDiscretionMode(newMode);
    await syncWithYantra('discretion_toggle', { enabled: newMode });
  };

  const shiftLedger = [
    { id: 1, venue: 'Hakkasan Phoenix', date: 'Tonight', time: '10:00 PM - 4:00 AM', rotation: 'Main Floor', status: 'Confirmed' },
    { id: 2, venue: 'Omnia Scottsdale', date: 'Tomorrow', time: '9:00 PM - 3:00 AM', rotation: 'VIP Section', status: 'Confirmed' },
    { id: 3, venue: 'Maya Day Club', date: 'Sat, Jan 20', time: '12:00 PM - 8:00 PM', rotation: 'Pool Deck', status: 'Pending' },
  ];

  const revenueData = {
    stageRotation: 3420,
    vipLounge: 5890,
    dispatchedPayouts: 2150,
    totalPending: 1245
  };

  const maskValue = (value: number) => {
    return discretionMode ? '••••••' : `$${value.toLocaleString()}`;
  };

  const maskText = (text: string) => {
    return discretionMode ? '••••••••' : text;
  };

  return (
    <div className="space-y-6">
      {/* Discretion Mode Toggle - Prominent */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {discretionMode ? (
            <EyeOff className="w-5 h-5 text-accent-crimson-light" />
          ) : (
            <Eye className="w-5 h-5 text-accent-gold" />
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">Discretion Mode</p>
            <p className="text-xs text-muted-foreground">
              {discretionMode ? 'Financial data and names are masked' : 'All data visible'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleDiscretion}
          disabled={isLoading}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            discretionMode ? 'bg-accent-crimson' : 'bg-surface-elevated border border-border'
          }`}
        >
          <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform shadow ${
            discretionMode ? 'translate-x-7' : 'translate-x-0.5'
          }`}></div>
        </button>
      </div>

      {/* Shift Ledger - Mobile-optimized roster */}
      <div className="glass-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-gold/15 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-accent-gold" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">Shift Ledger</h2>
          </div>
          <span className="text-xs text-muted-foreground">{shiftLedger.length} Bookings</span>
        </div>

        <div className="space-y-3">
          {shiftLedger.map((shift) => (
            <div 
              key={shift.id}
              className="p-4 rounded-lg bg-surface-elevated border border-border hover:border-accent-gold/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{maskText(shift.venue)}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{shift.rotation}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  shift.status === 'Confirmed' 
                    ? 'bg-accent-gold/20 text-accent-gold' 
                    : 'bg-warning/20 text-warning'
                }`}>
                  {shift.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{shift.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{shift.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Matrix - Glassmorphic tracking */}
      <div className="glass-card-glow p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-gold/15 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-accent-gold" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">Revenue Matrix</h2>
          </div>
          <div className="flex items-center gap-1.5 text-accent-gold text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22% MTD</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Stage Rotation</p>
            <p className={`text-2xl font-display font-bold ${discretionMode ? 'blur-sm select-none' : ''}`}>
              {maskValue(revenueData.stageRotation)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">VIP Lounge Hours</p>
            <p className={`text-2xl font-display font-bold ${discretionMode ? 'blur-sm select-none' : ''}`}>
              {maskValue(revenueData.vipLounge)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Dispatched Payouts</p>
            <p className={`text-2xl font-display font-bold text-accent-gold ${discretionMode ? 'blur-sm select-none' : ''}`}>
              {maskValue(revenueData.dispatchedPayouts)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Pending Clearance</p>
            <p className={`text-2xl font-display font-bold text-warning ${discretionMode ? 'blur-sm select-none' : ''}`}>
              {maskValue(revenueData.totalPending)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-accent-gold" />
            <span className="text-sm text-muted-foreground">All payouts verified</span>
          </div>
          <button className="text-xs font-semibold text-accent-gold hover:text-accent-gold-light transition-colors">
            View Full Statement
          </button>
        </div>
      </div>

      {/* Availability Matrix */}
      <div className="glass-card p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-accent-crimson/15 flex items-center justify-center">
            <Users className="w-4 h-4 text-accent-crimson-light" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">Availability Matrix</h2>
        </div>
        
        <AvailabilityCalendar 
          availability={availability} 
          onToggle={toggleAvailability}
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
  
  const generateDates = () => {
    const dates = [];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startPadding = firstDay.getDay();
    
    for (let i = 0; i < startPadding; i++) {
      dates.push(null);
    }
    
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
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      
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
                ? 'btn-gold neon-gold' 
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
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
          <div className="w-3 h-3 rounded bg-accent-gold"></div>
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
