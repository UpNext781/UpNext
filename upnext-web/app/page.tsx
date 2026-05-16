'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import TalentDiscoveryEngine from './components/TalentDiscoveryEngine';
import LucasConcierge from './components/LucasConcierge';
import RoxyCoPilot from './components/RoxyCoPilot';
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
  X,
  Utensils,
  CircleDot,
  Flame,
  Sofa,
  Radio,
  Crown,
  Target,
  Wand2,
  RefreshCw,
  Lock,
  ShieldCheck,
  ImageIcon,
  Activity,
  AlertTriangle,
  Gauge,
  ChevronUp,
  ChevronDown
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
        <header className="pt-8 pb-6 md:pt-14 md:pb-10">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
              <Image
                src="/images/upnext-logo.jpg"
                alt="UpNext - Phoenix's Premier Dancers"
                width={1200}
                height={400}
                className="w-full h-auto object-contain rounded-xl"
                priority
              />
            </div>
          </div>
        </header>

        {/* Dual Gateway Toggle */}
        <div className="flex justify-center">
          <div className="glass-card p-1 inline-flex gap-1">
            <button
              onClick={() => handlePortalChange('public')}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
                portalMode === 'public'
                  ? 'btn-gold neon-gold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              VIP Experience
            </button>
            <button
              onClick={() => handlePortalChange('operator')}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
                portalMode === 'operator'
                  ? 'btn-gold neon-gold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Talent Suite
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
  const [heroSearch, setHeroSearch] = useState('');
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

  return (
    <div className="space-y-10">
      {/* Main Stage Marquee - Cinematic Hero with Omni-Search */}
      <section className="relative overflow-hidden rounded-2xl marquee-border -mx-4 md:-mx-8">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1600&h=800&fit=crop"
            alt="Luxury nightclub atmosphere"
            fill
            className="object-cover opacity-25 scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-accent-crimson/30 via-background/85 to-accent-gold/15"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40"></div>
        <div className="relative glass-card-glow p-10 md:p-16 lg:p-24 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-accent-gold mb-6 md:mb-8">
              Phoenix&apos;s Premier Entertainment Network
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold italic text-foreground mb-6 md:mb-8 leading-none">
              <span className="text-gold-gradient">Elevate</span> Your Evening
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 md:mb-14 leading-relaxed">
              Exclusive access to Arizona&apos;s most distinguished hospitality specialists. 
              Search by name, look, vibe, or venue to find your perfect match instantly.
            </p>

            {/* Hero Omni-Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-gold/40 via-accent-crimson/25 to-accent-gold/40 blur-sm animate-pulse"></div>
                <div className="relative rounded-2xl bg-surface/80 backdrop-blur-xl border-2 border-accent-gold/30 p-1.5 shadow-[0_0_80px_rgba(201,162,39,0.2)]">
                  <div className="flex items-center gap-4 px-6 py-5">
                    <Search className="w-6 h-6 text-accent-gold flex-shrink-0" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder="Try 'petite redhead', 'VIP lounge host', 'exotic stage performer'..."
                      className="flex-1 bg-transparent text-lg md:text-xl text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                    />
                    {heroSearch && (
                      <button
                        onClick={() => setHeroSearch('')}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/50 mt-4 tracking-wide">
                Search across 100 specialists by name, hair color, build, vibe style, or venue
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligent Talent Discovery Engine (immediately after hero) */}
      <TalentDiscoveryEngine syncWithYantra={syncWithYantra} externalSearchQuery={heroSearch} onSearchChange={setHeroSearch} />

      {/* VIP Concierge Portal (pushed below the fold) */}
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

      {/* The Vibe Matcher - Interactive Quiz (below the fold) */}
      <VibeMatcher syncWithYantra={syncWithYantra} />

      {/* The City Grid: Venue Directory */}
      <VenueDirectory />

      {/* Lucas AI Concierge - Floating Chat Widget */}
      <LucasConcierge syncWithYantra={syncWithYantra} />
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
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop',
      surgeStatus: 'Peak' as const,
      floorSaturation: 92,
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
      image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&h=400&fit=crop',
      surgeStatus: 'Optimal' as const,
      floorSaturation: 67,
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
      image: 'https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=600&h=400&fit=crop',
      surgeStatus: 'Low' as const,
      floorSaturation: 23,
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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

                {/* A.S.S. Live Metrics */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                    venue.surgeStatus === 'Peak'
                      ? 'bg-accent-crimson/15 border-accent-crimson/30 text-accent-crimson-light'
                      : venue.surgeStatus === 'Optimal'
                        ? 'bg-accent-gold/10 border-accent-gold/25 text-accent-gold'
                        : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      venue.surgeStatus === 'Peak'
                        ? 'bg-accent-crimson-light animate-pulse'
                        : venue.surgeStatus === 'Optimal'
                          ? 'bg-accent-gold'
                          : 'bg-emerald-400'
                    }`}></span>
                    Surge: {venue.surgeStatus}
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                    venue.floorSaturation >= 85
                      ? 'bg-accent-crimson/15 border-accent-crimson/30 text-accent-crimson-light'
                      : venue.floorSaturation >= 55
                        ? 'bg-accent-gold/10 border-accent-gold/25 text-accent-gold'
                        : 'bg-surface-elevated border-border text-muted-foreground'
                  }`}>
                    Floor: {venue.floorSaturation}% Capacity
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
// VIBE MATCHER COMPONENT
// "The Elite Vibe Matcher" - Interactive quiz
// ============================================

interface VibeMatcherProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
}

type QuizAnswer = 'A' | 'B' | 'C' | null;

interface QuizState {
  step: number;
  answers: [QuizAnswer, QuizAnswer, QuizAnswer];
  isCalibrating: boolean;
  showResults: boolean;
}

function VibeMatcher({ syncWithYantra }: VibeMatcherProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    step: 0, // 0 = entryway, 1-3 = questions, 4 = results
    answers: [null, null, null],
    isCalibrating: false,
    showResults: false
  });

  const questions = [
    {
      id: 1,
      title: 'The Energy Baseline',
      question: 'What is the primary operational anchor for your night?',
      choices: [
        { id: 'A', text: 'High-octane, main-stage theater energy with a high-volume crowd.' },
        { id: 'B', text: 'Dimly lit, exclusive VIP lounge vibes with deep bass and high-stakes conversations.' },
        { id: 'C', text: 'Bespoke, private room attention completely tailored away from the noise.' }
      ]
    },
    {
      id: 2,
      title: 'The Social Blueprint',
      question: 'How do you prefer to interact with the floor?',
      choices: [
        { id: 'A', text: 'Direct engagement—center of the action, hosting the room.' },
        { id: 'B', text: 'Quiet observation—vantage point seating, reading the patterns before moving.' },
        { id: 'C', text: 'Fluid transition—moving effortlessly between the bar, the stage, and the suites.' }
      ]
    },
    {
      id: 3,
      title: 'The Velocity',
      question: 'What defines a successful closing play for you?',
      choices: [
        { id: 'A', text: 'Pushing the line until dawn at an exclusive after-hours spot.' },
        { id: 'B', text: 'A clean, high-end exit after locking down a premium bottle service reservation.' },
        { id: 'C', text: 'Completely unpredictable—letting the night dictate the target.' }
      ]
    }
  ];

  // Match results based on answers
  const matchedTalent = [
    { id: 1, alias: 'Diamond Elite', specialty: 'VIP Hosting', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face' },
    { id: 5, alias: 'Platinum Floor', specialty: 'Main Stage', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face' }
  ];

  const matchedVenue = {
    name: "Christie's Cabaret",
    area: 'Tempe',
    vibeTag: 'High-Energy',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop'
  };

  const getSignature = (): string => {
    const [a1, a2, a3] = quizState.answers;
    if (a1 === 'B' && a2 === 'B') return 'Elite Lounge Connoisseur';
    if (a1 === 'A' && a3 === 'A') return 'High-Velocity Nighthawk';
    if (a1 === 'C' || a2 === 'C') return 'Private Suite Architect';
    if (a3 === 'C') return 'Adaptive Night Navigator';
    return 'VIP Experience Curator';
  };

  const handleStartQuiz = () => {
    setQuizState(prev => ({ ...prev, step: 1 }));
  };

  const handleSelectAnswer = async (answer: QuizAnswer) => {
    const newAnswers = [...quizState.answers] as [QuizAnswer, QuizAnswer, QuizAnswer];
    newAnswers[quizState.step - 1] = answer;
    
    if (quizState.step === 3) {
      // Final question - trigger calibration
      setQuizState(prev => ({ ...prev, answers: newAnswers, isCalibrating: true }));
      
      // Sync to backend
      await syncWithYantra('vibe_matcher_complete', { 
        answers: newAnswers,
        signature: getSignature()
      });
      
      // Show calibration animation
      setTimeout(() => {
        setQuizState(prev => ({ ...prev, isCalibrating: false, showResults: true, step: 4 }));
      }, 2000);
    } else {
      // Move to next question
      setQuizState(prev => ({ ...prev, answers: newAnswers, step: prev.step + 1 }));
    }
  };

  const handleReset = () => {
    setQuizState({
      step: 0,
      answers: [null, null, null],
      isCalibrating: false,
      showResults: false
    });
  };

  // Entryway State
  if (quizState.step === 0) {
    return (
      <section className="glass-card-glow p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-crimson/10 via-transparent to-accent-gold/10"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-crimson/20 flex items-center justify-center">
              <Radio className="w-6 h-6 text-accent-gold" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold italic text-foreground">
                Find Your Frequency <span className="text-accent-gold">//</span> The Elite Vibe Matcher
              </h2>
              <p className="text-sm text-muted-foreground">Calibrate your evening experience</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Answer 3 quick micro-scenarios to calibrate your evening layout and instantly match with tonight&apos;s 
            premium talent and venue rotations.
          </p>

          <button
            onClick={handleStartQuiz}
            className="btn-gold px-8 py-4 rounded-lg text-sm flex items-center gap-3 neon-gold group"
          >
            <Target className="w-4 h-4" />
            Begin Calibration
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    );
  }

  // Calibrating State
  if (quizState.isCalibrating) {
    return (
      <section className="glass-card-glow p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 via-accent-crimson/10 to-accent-gold/5 animate-pulse"></div>
        </div>
        <div className="relative flex flex-col items-center justify-center text-center py-12">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-accent-gold/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-accent-crimson/50 border-t-accent-gold animate-spin flex items-center justify-center">
                <Radio className="w-6 h-6 text-accent-gold" />
              </div>
            </div>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent-gold mb-2">
            Calibrating Vibe Signatures...
          </p>
          <p className="text-xs text-muted-foreground">
            Matching your preferences with tonight&apos;s premium inventory
          </p>
        </div>
      </section>
    );
  }

  // Results State
  if (quizState.showResults) {
    return (
      <section className="glass-card-glow p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/10 via-transparent to-accent-crimson/10"></div>
        <div className="relative">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/15 text-accent-gold text-xs font-bold uppercase tracking-wider mb-4">
              <Crown className="w-3.5 h-3.5" />
              Calibration Complete
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold italic text-foreground mb-2">
              Your Tonight Blueprint
            </h2>
            <p className="text-lg text-accent-gold font-semibold">
              Signature: {getSignature()}
            </p>
          </div>

          {/* Matched Talent */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-crimson-light" />
              Your Matched Talent
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedTalent.map((talent) => (
                <div 
                  key={talent.id}
                  className="glass-card p-4 flex items-center gap-4 hover:border-accent-gold/30 transition-all group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-accent-gold/40">
                    <Image
                      src={talent.image}
                      alt={talent.alias}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-foreground">{talent.alias}</h4>
                    <p className="text-xs text-muted-foreground">{talent.specialty}</p>
                  </div>
                  <button className="text-xs font-semibold text-accent-gold hover:text-accent-gold-light transition-colors">
                    Request
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Matched Venue */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-gold" />
              Your Recommended Destination
            </h3>
            <div className="glass-card overflow-hidden hover:border-accent-gold/30 transition-all group">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0">
                  <Image
                    src={matchedVenue.image}
                    alt={matchedVenue.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-background/80 to-transparent"></div>
                </div>
                <div className="flex-1 p-5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-display font-bold italic text-foreground mb-1">
                      {matchedVenue.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{matchedVenue.area}</span>
                      <span className="flex items-center gap-1 text-accent-crimson-light">
                        <Flame className="w-3.5 h-3.5" />
                        {matchedVenue.vibeTag}
                      </span>
                    </div>
                  </div>
                  <button className="btn-gold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 neon-gold">
                    Book VIP
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Recalibrate Preferences
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Quiz Questions State
  const currentQuestion = questions[quizState.step - 1];

  return (
    <section className="glass-card p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-crimson/5 via-transparent to-accent-gold/5"></div>
      <div className="relative">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-accent-gold" />
            <span className="text-sm font-semibold text-foreground">Vibe Calibration</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-1.5 rounded-full transition-colors ${
                  step < quizState.step
                    ? 'bg-accent-gold'
                    : step === quizState.step
                    ? 'bg-accent-crimson'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold mb-3">
            {currentQuestion.title}
          </p>
          <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          {currentQuestion.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleSelectAnswer(choice.id as QuizAnswer)}
              className="w-full text-left p-5 rounded-xl bg-surface border border-border hover:border-accent-gold/40 hover:bg-surface-elevated transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold/20 transition-colors">
                  <span className="text-sm font-bold text-accent-gold">{choice.id}</span>
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed pt-1">
                  {choice.text}
                </p>
              </div>
            </button>
          ))}
        </div>
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

      {/* The Market Pulse - Predictive Intelligence Panel */}
      <MarketPulse syncWithYantra={syncWithYantra} discretionMode={discretionMode} isLoading={isLoading} />

      {/* Roxy AI - Strategic Shift Co-Pilot */}
      <RoxyCoPilot syncWithYantra={syncWithYantra} discretionMode={discretionMode} />

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

      {/* Shift Deployment & Broadcast Central */}
      <BroadcastCentral syncWithYantra={syncWithYantra} discretionMode={discretionMode} />

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
// MARKET PULSE COMPONENT
// "Deployment Intelligence" - Predictive A.S.S.
// (Aesthetic, Surge, and Saturation) matching
// ============================================

interface MarketPulseProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  discretionMode: boolean;
  isLoading: boolean;
}

interface VenueIntel {
  id: string;
  name: string;
  area: string;
  assScore: number;
  aesthetic: number;
  surge: number;
  saturation: number;
  estEarnings: string;
  peakWindow: string;
  image: string;
}

function MarketPulse({ syncWithYantra, discretionMode, isLoading }: MarketPulseProps) {
  const [isLocking, setIsLocking] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState(true);

  const topMatch: VenueIntel = {
    id: 'venue_christies_001',
    name: "Christie's Cabaret",
    area: 'Tempe',
    assScore: 96,
    aesthetic: 98,
    surge: 94,
    saturation: 31,
    estEarnings: '$1,200 - $1,800',
    peakWindow: '11:00 PM - 2:00 AM',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop'
  };

  const alternatives: VenueIntel[] = [
    {
      id: 'venue_legirls_002',
      name: 'Le Girls',
      area: 'West Valley',
      assScore: 82,
      aesthetic: 85,
      surge: 78,
      saturation: 54,
      estEarnings: '$800 - $1,100',
      peakWindow: '10:00 PM - 1:00 AM',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop'
    },
    {
      id: 'venue_bourbon_003',
      name: 'Bourbon Street',
      area: 'Central Phoenix',
      assScore: 74,
      aesthetic: 79,
      surge: 88,
      saturation: 67,
      estEarnings: '$650 - $950',
      peakWindow: '12:00 AM - 3:00 AM',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop'
    },
    {
      id: 'venue_dragonfly_004',
      name: 'Skin Scottsdale',
      area: 'Old Town',
      assScore: 69,
      aesthetic: 72,
      surge: 65,
      saturation: 78,
      estEarnings: '$500 - $800',
      peakWindow: '9:00 PM - 12:00 AM',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop'
    }
  ];

  const alerts = [
    {
      id: 'alert_1',
      type: 'vip' as const,
      title: 'High-Roller Inbound',
      message: "Recurring VIP client 'Blackcard-7' has reserved Table 3 at Christie's. Historical tip avg: $340/session.",
      time: '12 min ago'
    },
    {
      id: 'alert_2',
      type: 'roster' as const,
      title: 'Roster Gap Detected',
      message: "Le Girls main floor is 2 performers below Friday baseline. Surge multiplier is active \u2014 2.1x payout window.",
      time: '28 min ago'
    },
    {
      id: 'alert_3',
      type: 'vip' as const,
      title: 'Corporate Block Booking',
      message: "Enterprise group of 8 confirmed at Bourbon Street VIP. Pre-paid bottle service + $200 talent gratuity pool.",
      time: '45 min ago'
    }
  ];

  const handleLockShift = async () => {
    setIsLocking(true);
    await syncWithYantra('ass_match_lock', {
      venue_id: topMatch.id,
      ass_score: topMatch.assScore,
      aesthetic: topMatch.aesthetic,
      surge: topMatch.surge,
      saturation: topMatch.saturation,
      peak_window: topMatch.peakWindow,
      timestamp: new Date().toISOString()
    });
    setIsLocking(false);
    setIsLocked(true);
    setTimeout(() => setIsLocked(false), 5000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent-gold';
    if (score >= 75) return 'text-foreground';
    if (score >= 60) return 'text-warning';
    return 'text-accent-crimson-light';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return 'bg-accent-gold';
    if (score >= 75) return 'bg-foreground/60';
    if (score >= 60) return 'bg-warning';
    return 'bg-accent-crimson';
  };

  const getSaturationLabel = (sat: number) => {
    if (sat <= 35) return { label: 'Low', color: 'text-emerald-400' };
    if (sat <= 60) return { label: 'Moderate', color: 'text-warning' };
    return { label: 'Crowded', color: 'text-accent-crimson-light' };
  };

  return (
    <div className="space-y-4">
      {/* Oracle Header */}
      <div className="glass-card-glow p-5 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 via-transparent to-accent-crimson/5"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-gold/25 to-accent-crimson/15 flex items-center justify-center">
                <Activity className="w-4 h-4 text-accent-gold" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Deployment Intelligence <span className="text-accent-gold">//</span> Live A.S.S. Matching
                </h2>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50">
                  Aesthetic, Surge & Saturation Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Match Card */}
      <div className="glass-card-glow p-5 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent"></div>
        
        {/* Match Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-accent-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">#1 Optimal Destination</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge className="w-3.5 h-3.5 text-accent-gold" />
            <span>Model v3.2</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Venue Image + Name */}
          <div className="relative w-full md:w-56 h-40 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={topMatch.image}
              alt={topMatch.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-lg font-display font-bold italic text-foreground">
                {discretionMode ? '••••••••••' : topMatch.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{topMatch.area}</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="flex-1 space-y-5">
            {/* Big A.S.S. Score */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className={`text-5xl font-display font-bold italic ${getScoreColor(topMatch.assScore)} ${discretionMode ? 'blur-md select-none' : ''}`}>
                  {topMatch.assScore}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">A.S.S. Score</p>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">Peak earning potential tonight</p>
                <p className={`text-lg font-bold text-accent-gold ${discretionMode ? 'blur-sm select-none' : ''}`}>
                  {discretionMode ? '••••••' : topMatch.estEarnings}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Peak: {topMatch.peakWindow}</span>
                </div>
              </div>
            </div>

            {/* A.S.S. Breakdown Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Aesthetic */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Aesthetic</p>
                  <span className={`text-sm font-bold ${getScoreColor(topMatch.aesthetic)} ${discretionMode ? 'blur-sm select-none' : ''}`}>
                    {topMatch.aesthetic}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getScoreBarColor(topMatch.aesthetic)} transition-all`}
                    style={{ width: `${topMatch.aesthetic}%` }}
                  ></div>
                </div>
                <p className="text-[9px] text-muted-foreground/50">Brand alignment match</p>
              </div>

              {/* Surge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Surge</p>
                  <span className={`text-sm font-bold ${getScoreColor(topMatch.surge)} ${discretionMode ? 'blur-sm select-none' : ''}`}>
                    {topMatch.surge}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getScoreBarColor(topMatch.surge)} transition-all`}
                    style={{ width: `${topMatch.surge}%` }}
                  ></div>
                </div>
                <p className="text-[9px] text-muted-foreground/50">VIP capacity demand</p>
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Saturation</p>
                  <span className={`text-sm font-bold ${getSaturationLabel(topMatch.saturation).color} ${discretionMode ? 'blur-sm select-none' : ''}`}>
                    {topMatch.saturation}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${topMatch.saturation}%` }}
                  ></div>
                </div>
                <p className={`text-[9px] ${getSaturationLabel(topMatch.saturation).color}`}>
                  {getSaturationLabel(topMatch.saturation).label} &mdash; room to earn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Alerts */}
      <div className="glass-card p-5 md:p-6">
        <button 
          onClick={() => setExpandedAlerts(!expandedAlerts)}
          className="w-full flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-crimson/15 flex items-center justify-center relative">
              <AlertTriangle className="w-4 h-4 text-accent-crimson-light" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-crimson text-[9px] font-bold text-foreground flex items-center justify-center">
                {alerts.length}
              </span>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Real-Time Intel Alerts
            </h3>
          </div>
          {expandedAlerts ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {expandedAlerts && (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border transition-colors ${
                  alert.type === 'vip'
                    ? 'bg-accent-gold/5 border-accent-gold/15 hover:border-accent-gold/30'
                    : 'bg-accent-crimson/5 border-accent-crimson/15 hover:border-accent-crimson/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    {alert.type === 'vip' ? (
                      <Crown className="w-3.5 h-3.5 text-accent-gold flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-accent-crimson-light flex-shrink-0" />
                    )}
                    <span className={`text-xs font-bold ${
                      alert.type === 'vip' ? 'text-accent-gold' : 'text-accent-crimson-light'
                    }`}>
                      {alert.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap">{alert.time}</span>
                </div>
                <p className={`text-xs leading-relaxed pl-5.5 ${discretionMode ? 'blur-sm select-none' : 'text-muted-foreground'}`}>
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alternative Venue Matrix */}
      <div className="glass-card p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-accent-gold/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-accent-gold" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">Alternative Venue Matrix</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {alternatives.map((venue) => {
            const satLabel = getSaturationLabel(venue.saturation);
            return (
              <div 
                key={venue.id}
                className="rounded-xl bg-surface border border-border hover:border-accent-gold/20 transition-all overflow-hidden group"
              >
                {/* Mini Image */}
                <div className="relative h-24 w-full">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
                  {/* Score Badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border">
                    <span className={`text-sm font-bold font-display ${getScoreColor(venue.assScore)}`}>
                      {venue.assScore}
                    </span>
                  </div>
                </div>

                <div className="p-3 space-y-2.5">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {discretionMode ? '••••••••' : venue.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">{venue.area}</p>
                  </div>

                  {/* Mini A.S.S. bars */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wide text-muted-foreground/60 w-8">AES</span>
                      <div className="flex-1 h-1 rounded-full bg-surface-elevated overflow-hidden">
                        <div className={`h-full rounded-full ${getScoreBarColor(venue.aesthetic)}`} style={{ width: `${venue.aesthetic}%` }}></div>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground w-5 text-right">{venue.aesthetic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wide text-muted-foreground/60 w-8">SRG</span>
                      <div className="flex-1 h-1 rounded-full bg-surface-elevated overflow-hidden">
                        <div className={`h-full rounded-full ${getScoreBarColor(venue.surge)}`} style={{ width: `${venue.surge}%` }}></div>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground w-5 text-right">{venue.surge}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wide text-muted-foreground/60 w-8">SAT</span>
                      <div className="flex-1 h-1 rounded-full bg-surface-elevated overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${venue.saturation}%` }}></div>
                      </div>
                      <span className={`text-[9px] font-bold ${satLabel.color} w-5 text-right`}>{venue.saturation}%</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-border/50">
                    <p className={`text-xs font-semibold ${discretionMode ? 'blur-sm select-none' : 'text-foreground/80'}`}>
                      {discretionMode ? '••••••' : venue.estEarnings}
                    </p>
                    <p className="text-[9px] text-muted-foreground/50 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      Peak: {venue.peakWindow}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Execution */}
      <div className="glass-card p-5 md:p-6">
        {!isLocked ? (
          <button
            onClick={handleLockShift}
            disabled={isLoading || isLocking}
            className="w-full py-4 rounded-xl btn-gold neon-gold font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {isLocking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Locking Deployment...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Accept Matching & Lock Shift
              </>
            )}
          </button>
        ) : (
          <div className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div className="text-center">
              <p className="text-sm font-bold text-emerald-400">Shift Locked Successfully</p>
              <p className="text-[10px] text-muted-foreground">
                {discretionMode ? '••••••••••' : topMatch.name} &mdash; {topMatch.peakWindow}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground/40">
          <span>Model: A.S.S. v3.2</span>
          <span>&middot;</span>
          <span>Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>&middot;</span>
          <span>Confidence: 94%</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BROADCAST CENTRAL COMPONENT
// "Shift Deployment & Broadcast Central"
// AI content generation + OPSEC asset management
// ============================================

type VibeMood = 'sophisticated' | 'playful' | 'mystic' | null;
type BroadcastPhase = 'idle' | 'tokenizing' | 'deployed';

interface BroadcastCentralProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  discretionMode: boolean;
}

const VIBE_PRESETS: Record<Exclude<VibeMood, null>, { label: string; description: string; preview: string }> = {
  sophisticated: {
    label: 'Sophisticated',
    description: 'Refined, exclusive, corporate-safe tone',
    preview: 'Your priority allocation window for tonight is now open. Review your private reservation itinerary: upnext.dev/t/x9k3'
  },
  playful: {
    label: 'Playful',
    description: 'Energetic, casual, weekend-ready tone',
    preview: 'The weekend layout just dropped early. Your entry credential and seating are waiting inside: upnext.dev/t/x9k3'
  },
  mystic: {
    label: 'Mystic',
    description: 'Mysterious, exclusive, FOMO-driven tone',
    preview: "Tonight\u2019s line is locked. The deck clears at midnight\u2014unlock your special invitation details: upnext.dev/t/x9k3"
  }
};

const ASSET_PORTFOLIO = [
  { id: 'a1', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', label: 'Studio A', lastUsed: null, isActive: false },
  { id: 'a2', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face', label: 'Glam Set', lastUsed: 'Shift -1', isActive: false },
  { id: 'a3', src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=face', label: 'VIP Shoot', lastUsed: null, isActive: true },
  { id: 'a4', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', label: 'Lounge', lastUsed: 'Shift -2', isActive: false },
  { id: 'a5', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face', label: 'Stage Look', lastUsed: 'Shift -3', isActive: false },
  { id: 'a6', src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=face', label: 'Editorial', lastUsed: null, isActive: false },
];

function BroadcastCentral({ syncWithYantra, discretionMode }: BroadcastCentralProps) {
  const [selectedMood, setSelectedMood] = useState<VibeMood>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>('a3');
  const [broadcastPhase, setBroadcastPhase] = useState<BroadcastPhase>('idle');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSelectAsset = (assetId: string) => {
    setSelectedAsset(assetId);
  };

  const handleSyncCatalog = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
  };

  const handleBroadcast = async () => {
    if (!selectedMood || !selectedAsset) return;
    
    setBroadcastPhase('tokenizing');
    
    // Assemble the payload
    const payload = {
      text_preset: selectedMood,
      text_content: VIBE_PRESETS[selectedMood].preview,
      venue_id: 'venue_phoenix_001',
      asset_id: selectedAsset,
      timestamp: new Date().toISOString(),
      discretion_flag: discretionMode
    };

    await syncWithYantra('broadcast_deploy', payload);

    // Show deployed confirmation
    setBroadcastPhase('deployed');
    setTimeout(() => setBroadcastPhase('idle'), 4000);
  };

  return (
    <div className="glass-card-glow p-5 md:p-6 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-crimson/20 to-accent-gold/20 flex items-center justify-center">
            <Send className="w-4 h-4 text-accent-gold" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">Broadcast Central</h2>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Shift Deployment & OPSEC Content</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-gold" />
          <span>E2E Cloaked</span>
        </div>
      </div>

      {/* 1. AI Vibe Content Generator */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-accent-gold" />
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">AI Vibe Content Generator</p>
        </div>

        {/* Mood Selector */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(VIBE_PRESETS) as [Exclude<VibeMood, null>, typeof VIBE_PRESETS[keyof typeof VIBE_PRESETS]][]).map(([mood, preset]) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedMood === mood
                  ? 'bg-accent-gold/15 border-2 border-accent-gold/50 shadow-[0_0_20px_rgba(201,162,39,0.1)]'
                  : 'bg-surface border border-border hover:border-accent-gold/20'
              }`}
            >
              <p className={`text-sm font-semibold mb-1 ${
                selectedMood === mood ? 'text-accent-gold' : 'text-foreground'
              }`}>
                {preset.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-snug">{preset.description}</p>
            </button>
          ))}
        </div>

        {/* AI Text Preview Card */}
        {selectedMood && (
          <div className="relative rounded-xl bg-surface border border-accent-gold/20 p-5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent"></div>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5 text-accent-gold" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-bold">Lock-Screen Safe Preview</p>
            </div>
            <p className={`text-sm leading-relaxed ${discretionMode ? 'blur-sm select-none' : 'text-foreground/90'}`}>
              {VIBE_PRESETS[selectedMood].preview}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground/50">
              <ShieldCheck className="w-3 h-3" />
              <span>No explicit content. No media attachments. Plain text only.</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Smart Asset Revolver Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-accent-crimson-light" />
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Approved Media Portfolio</p>
          </div>
          <button 
            onClick={handleSyncCatalog}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs text-accent-gold hover:text-accent-gold-light transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Catalog'}</span>
          </button>
        </div>

        {/* Thumbnail Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {ASSET_PORTFOLIO.map((asset) => {
            const isSelected = selectedAsset === asset.id;
            const isRecentlyUsed = asset.lastUsed !== null;
            
            return (
              <button
                key={asset.id}
                onClick={() => handleSelectAsset(asset.id)}
                className={`relative flex-none w-24 group transition-all ${
                  isSelected ? 'scale-105' : 'hover:scale-[1.02]'
                }`}
              >
                {/* Thumbnail */}
                <div className={`relative w-24 h-24 rounded-xl overflow-hidden ${
                  isSelected 
                    ? 'ring-2 ring-accent-gold ring-offset-2 ring-offset-background shadow-[0_0_16px_rgba(201,162,39,0.3)]' 
                    : 'ring-1 ring-border'
                }`}>
                  <Image
                    src={asset.src}
                    alt={asset.label}
                    width={96}
                    height={96}
                    className={`w-full h-full object-cover transition-all ${
                      isRecentlyUsed && !isSelected ? 'opacity-40' : ''
                    }`}
                  />
                  
                  {/* Recently Used Overlay */}
                  {isRecentlyUsed && !isSelected && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-background/80 px-2 py-1 rounded">
                        {asset.lastUsed}
                      </span>
                    </div>
                  )}

                  {/* Active Choice Badge */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-accent-gold flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-background" />
                    </div>
                  )}
                </div>

                {/* Label */}
                <p className={`text-[10px] text-center mt-1.5 ${
                  isSelected ? 'text-accent-gold font-semibold' : 'text-muted-foreground'
                }`}>
                  {asset.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Secure Launch Command */}
      <div className="pt-2 border-t border-border space-y-4">
        {broadcastPhase === 'idle' && (
          <button
            onClick={handleBroadcast}
            disabled={!selectedMood || !selectedAsset}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all ${
              selectedMood && selectedAsset
                ? 'btn-crimson shadow-[0_0_30px_rgba(165,42,42,0.3)] hover:shadow-[0_0_40px_rgba(165,42,42,0.4)]'
                : 'bg-surface-elevated text-muted-foreground border border-border cursor-not-allowed'
            }`}
          >
            <Lock className="w-4 h-4" />
            Secure Link & Broadcast Blast
          </button>
        )}

        {broadcastPhase === 'tokenizing' && (
          <div className="w-full py-6 rounded-xl bg-surface border border-accent-crimson/30 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-accent-crimson/40 flex items-center justify-center">
                <div className="w-9 h-9 rounded-full border-2 border-accent-gold/50 border-t-accent-crimson animate-spin"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-crimson-light mb-1">
                Tokenizing Secure Gateway Link...
              </p>
              <p className="text-[10px] text-muted-foreground">Encrypting payload & generating cloaked redirect</p>
            </div>
            {/* Progress bar animation */}
            <div className="w-48 h-1 rounded-full bg-surface-elevated overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-crimson to-accent-gold rounded-full animate-[broadcast-progress_2s_ease-in-out]" 
                   style={{ animation: 'broadcast-progress 1.5s ease-in-out forwards' }}></div>
            </div>
          </div>
        )}

        {broadcastPhase === 'deployed' && (
          <div className="w-full py-5 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center gap-3">
            <CheckCircle className="w-5 h-5 text-accent-gold" />
            <div>
              <p className="text-sm font-bold text-accent-gold">Discreet Campaign Deployed Successfully</p>
              <p className="text-[10px] text-muted-foreground">Outbound Notification Cloaked</p>
            </div>
          </div>
        )}

        {/* Status Summary */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground/50">
          <span>Mood: {selectedMood ? VIBE_PRESETS[selectedMood].label : 'Not Set'}</span>
          <span>Asset: {selectedAsset || 'None'}</span>
          <span>Pipeline: E2E Encrypted</span>
        </div>
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
