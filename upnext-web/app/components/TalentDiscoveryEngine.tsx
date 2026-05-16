'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  Star,
  MapPin,
  Clock,
  ChevronRight,
  X,
  Zap,
  Crown,
  ArrowRight,
  Loader2,
  Calendar,
  CheckCircle,
  Sparkles
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface TalentProfile {
  id: number;
  stageName: string;
  age: number;
  height: string;
  build: string;
  hairColor: string;
  vibeStyle: string;
  bio: string;
  tags: string[];
  rating: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
  status: 'live' | 'scheduled';
  venueAnchor: string;
  scheduleBlock: string;
  availability: string;
  images: string[];
}

interface TalentDiscoveryProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
}

// ============================================
// PORTRAIT IMAGE POOL (Unsplash)
// ============================================

const PORTRAIT_POOL = [
  'photo-1534528741775-53994a69daeb',
  'photo-1524504388940-b1c1722653e1',
  'photo-1517841905240-472988babdf9',
  'photo-1488426862026-3ee34a7d66df',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1494790108377-be9c29b29330',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1502823403499-6ccfcf4fb453',
  'photo-1514315384763-ba401779410f',
  'photo-1544005313-94ddf0286df2',
  'photo-1438761681033-6461ffad8d80',
  'photo-1489424731084-a5d8b219a5bb',
  'photo-1496440737103-cd596325d314',
  'photo-1515886657613-9f3515b0c78f',
  'photo-1521146764736-56c929d59c83',
  'photo-1519125323398-675f0ddb6308',
  'photo-1503185912284-5271ff81b9a8',
  'photo-1509967419530-da38b4704bc6',
  'photo-1506277886164-e25aa3f4ef7f',
];

const getPortraitUrl = (id: number, size = 400) => {
  const photo = PORTRAIT_POOL[id % PORTRAIT_POOL.length];
  return `https://images.unsplash.com/${photo}?w=${size}&h=${size}&fit=crop&crop=face`;
};

const getGalleryUrls = (id: number): string[] => {
  const base = id % PORTRAIT_POOL.length;
  return [0, 1, 2, 3].map(offset => {
    const photo = PORTRAIT_POOL[(base + offset) % PORTRAIT_POOL.length];
    return `https://images.unsplash.com/${photo}?w=800&h=1000&fit=crop&crop=face`;
  });
};

// ============================================
// PROGRAMMATIC PROFILE DATABASE (100 profiles)
// ============================================

const STAGE_NAMES = [
  'Aria Luxe', 'Nova Sterling', 'Jade Velvet', 'Sable Reign', 'Ruby Onyx',
  'Luna Frost', 'Ember Blaze', 'Ivy Noir', 'Diamond Dior', 'Scarlett Vice',
  'Aurora Gold', 'Cleo Jewel', 'Venus Storm', 'Raven Silk', 'Pearl Elise',
  'Zara Phoenix', 'Mila Rouge', 'Giselle Noir', 'Carmen Elite', 'Dahlia Moon',
  'Sadie Lux', 'Romy Vale', 'Harlow James', 'Eden Monroe', 'Freya Cole',
  'Nyx Shadow', 'Layla Sterling', 'Willow Hart', 'Sage Devereaux', 'Blair Reign',
  'Celeste Cruz', 'Valentina Rose', 'Maren Stone', 'Thalia Bloom', 'Kira Vex',
  'Anya Slate', 'Brynn Adler', 'Delphine Lux', 'Esme Graves', 'Fable Quinn',
  'Gemma Haze', 'Haven Leigh', 'Isadora Cain', 'Juno Sable', 'Katya Wren',
  'Lilith Rayne', 'Maris Thorne', 'Naia Frost', 'Opal Byrne', 'Piper Knox',
  'Quinn Soleil', 'Rhea Vance', 'Sienna Wolfe', 'Tatum Reign', 'Uma Steele',
  'Vera Lune', 'Wynn Hale', 'Xena Vale', 'Yara Silk', 'Zola Ember',
  'Alina Dusk', 'Bianca Storm', 'Coralie Ash', 'Demi Luxe', 'Elara Noir',
  'Fiona Blaze', 'Greta Haze', 'Helena Crest', 'Iris Jade', 'Jules Reign',
  'Kenna Gold', 'Lena Frost', 'Mona Raven', 'Nina Steele', 'Olivia Dawn',
  'Paloma Cruz', 'Quorra Slade', 'Reina Lux', 'Sonia Vale', 'Terra Moon',
  'Ursa Quinn', 'Veda Blaze', 'Winter Cole', 'Xyla Storm', 'Yuki Onyx',
  'Ziva Reign', 'Astrid Noir', 'Bexley Luxe', 'Calla Vex', 'Daria Frost',
  'Elowen Silk', 'Farrah Gold', 'Gaia Haze', 'Hadley Stone', 'Indigo Cruz',
  'Jessamine Lux', 'Kaia Sterling', 'Lyric Ash', 'Meadow Reign', 'Neve Storm'
];

const HAIR_COLORS = ['Platinum Blonde', 'Brunette', 'Raven Black', 'Auburn Red', 'Honey Blonde', 'Copper', 'Jet Black', 'Strawberry Blonde', 'Chestnut', 'Silver'];
const BUILDS = ['Petite', 'Athletic', 'Curvy', 'Slim', 'Toned', 'Statuesque'];
const VIBE_STYLES = ['High-Energy Showstopper', 'Classy Lounge VIP', 'Exotic Stage Performer', 'Sultry Conversationalist', 'Alternative Edge', 'Girl-Next-Door Charm'];
const VENUES = ["Christie's Cabaret Tempe", "Le Girls West Valley", "Bourbon Street Central PHX", "Skin Scottsdale", "Babe's Cabaret", "Hi-Liter"];
const TIERS: TalentProfile['tier'][] = ['Diamond', 'Platinum', 'Gold', 'Silver'];
const HEIGHTS = ["5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\""];

const BIOS = [
  'Captivating stage presence with elite VIP hosting credentials. Specializes in high-end bottle service environments.',
  'A magnetic performer who commands every room. Known for sophisticated conversation and premium client retention.',
  'High-fashion trained with runway experience. Brings editorial elegance to the nightlife floor.',
  'Versatile entertainer with a loyal following. Excels in both main stage rotations and private lounge settings.',
  'Bilingual specialist with international appeal. Preferred choice for corporate entertainment bookings.',
  'Award-winning performer with an unmatched stage routine. Consistently ranks in top-tier earnings brackets.',
  'Former fitness model bringing athletic grace to every performance. A client favorite for VIP sections.',
  'Classically trained dancer with contemporary flair. Known for immersive, high-energy sets.',
  'Exclusive private event specialist. Curates bespoke entertainment experiences for discerning clientele.',
  'The quintessential lounge presence. Sophisticated, articulate, and effortlessly commanding.'
];

const TAG_POOL = [
  'petite', 'tall', 'athletic', 'curvy', 'redhead', 'blonde', 'brunette',
  'exotic', 'alternative', 'classy', 'high-energy', 'bilingual', 'lounge',
  'vip', 'main-stage', 'private-events', 'conversationalist', 'showstopper',
  'girl-next-door', 'editorial', 'fitness', 'runway', 'sultry', 'elegant'
];

function generateProfiles(): TalentProfile[] {
  return STAGE_NAMES.map((name, i) => {
    const tagCount = 3 + (i % 4);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      tags.push(TAG_POOL[(i + t * 7) % TAG_POOL.length]);
    }

    const hairColor = HAIR_COLORS[i % HAIR_COLORS.length];
    tags.push(hairColor.toLowerCase().split(' ')[0]);

    const build = BUILDS[i % BUILDS.length];
    tags.push(build.toLowerCase());

    return {
      id: i + 1,
      stageName: name,
      age: 21 + (i % 12),
      height: HEIGHTS[i % HEIGHTS.length],
      build,
      hairColor,
      vibeStyle: VIBE_STYLES[i % VIBE_STYLES.length],
      bio: BIOS[i % BIOS.length],
      tags: [...new Set(tags)],
      rating: parseFloat((4.5 + (i % 6) * 0.1).toFixed(1)),
      tier: TIERS[i % TIERS.length],
      status: i % 3 === 0 ? 'scheduled' : 'live',
      venueAnchor: VENUES[i % VENUES.length],
      scheduleBlock: i % 3 === 0
        ? `Scheduled: ${9 + (i % 4)}:00 PM`
        : `Live On-Floor Now`,
      availability: i % 4 === 0
        ? 'Booked for VIP until 1AM'
        : 'Available for Private Lounge Bookings',
      images: getGalleryUrls(i)
    };
  });
}

const ALL_PROFILES = generateProfiles();

// ============================================
// TIER BADGE STYLING
// ============================================

const TIER_COLORS: Record<TalentProfile['tier'], { bg: string; text: string; border: string }> = {
  Diamond: { bg: 'bg-accent-gold/20', text: 'text-accent-gold', border: 'border-accent-gold/40' },
  Platinum: { bg: 'bg-foreground/10', text: 'text-foreground', border: 'border-foreground/20' },
  Gold: { bg: 'bg-accent-gold/10', text: 'text-accent-gold-light', border: 'border-accent-gold/20' },
  Silver: { bg: 'bg-muted/40', text: 'text-muted-foreground', border: 'border-muted/60' }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function TalentDiscoveryEngine({ syncWithYantra }: TalentDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // First Contact overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [typingPlaceholder, setTypingPlaceholder] = useState('');
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const dockedInputRef = useRef<HTMLInputElement>(null);
  const sessionChecked = useRef(false);

  // Session state: only show overlay once per session
  useEffect(() => {
    if (sessionChecked.current) return;
    sessionChecked.current = true;
    const hasSeenOverlay = sessionStorage.getItem('upnext_first_contact_seen');
    if (!hasSeenOverlay) {
      setShowOverlay(true);
      sessionStorage.setItem('upnext_first_contact_seen', 'true');
    } else {
      setIsDocked(true);
    }
  }, []);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (!showOverlay || overlayExiting) return;

    const phrases = [
      "Try 'petite redhead'",
      "Try 'high-energy alternative'",
      "Try 'VIP lounge host'",
      "Try 'classy brunette'",
      "Try 'exotic stage performer'"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        setTypingPlaceholder(currentPhrase.slice(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 2000);
          return;
        }
        timeoutId = setTimeout(type, 60);
      } else {
        setTypingPlaceholder(currentPhrase.slice(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeoutId = setTimeout(type, 400);
          return;
        }
        timeoutId = setTimeout(type, 30);
      }
    };

    const startDelay = setTimeout(() => type(), 800);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, [showOverlay, overlayExiting]);

  // Dock the overlay
  const triggerDocking = useCallback(() => {
    setOverlayExiting(true);
    setTimeout(() => {
      setShowOverlay(false);
      setOverlayExiting(false);
      setIsDocked(true);
      // Focus the docked input after transition
      setTimeout(() => dockedInputRef.current?.focus(), 100);
    }, 700);
  }, []);

  // Handle overlay search input
  const handleOverlayInput = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.length >= 1) {
      triggerDocking();
    }
  }, [triggerDocking]);

  // Live client-side filtering
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return ALL_PROFILES;

    const terms = searchQuery.toLowerCase().split(/[\s,]+/).filter(Boolean);

    return ALL_PROFILES.filter(profile => {
      const searchableText = [
        profile.stageName,
        profile.bio,
        profile.hairColor,
        profile.build,
        profile.vibeStyle,
        profile.venueAnchor,
        ...profile.tags
      ].join(' ').toLowerCase();

      return terms.every(term => searchableText.includes(term));
    });
  }, [searchQuery]);

  // Intelligent fallback: find closest matches when zero results
  const fallbackProfiles = useMemo(() => {
    if (filteredProfiles.length > 0 || !searchQuery.trim()) return [];

    const terms = searchQuery.toLowerCase().split(/[\s,]+/).filter(Boolean);

    // Score each profile by how many terms partially match
    const scored = ALL_PROFILES
      .filter(p => p.status === 'live')
      .map(profile => {
        const searchableText = [
          profile.stageName,
          profile.bio,
          profile.hairColor,
          profile.build,
          profile.vibeStyle,
          profile.venueAnchor,
          ...profile.tags
        ].join(' ').toLowerCase();

        const matchCount = terms.filter(term =>
          searchableText.includes(term.slice(0, 3)) ||
          profile.tags.some(tag => tag.includes(term.slice(0, 3)))
        ).length;

        return { profile, matchCount };
      })
      .filter(s => s.matchCount > 0 || true)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3);

    return scored.map(s => s.profile);
  }, [filteredProfiles, searchQuery]);

  const displayedProfiles = filteredProfiles.slice(0, visibleCount);

  const handleCardClick = useCallback(async (profile: TalentProfile) => {
    setSelectedProfile(profile);
    setActiveGalleryTab(0);
    setBookingConfirmed(false);
    await syncWithYantra('profile_view', {
      profile_id: profile.id,
      stage_name: profile.stageName,
      timestamp: new Date().toISOString()
    });
  }, [syncWithYantra]);

  const handleBookVIP = useCallback(async (profile: TalentProfile) => {
    setIsBooking(true);
    await syncWithYantra('vip_session_lock', {
      profile_id: profile.id,
      stage_name: profile.stageName,
      venue: profile.venueAnchor,
      schedule: profile.scheduleBlock,
      timestamp: new Date().toISOString()
    });
    setIsBooking(false);
    setBookingConfirmed(true);
  }, [syncWithYantra]);

  const handleSearchInput = useCallback(async (value: string) => {
    setSearchQuery(value);
    setVisibleCount(12);
    if (value.length > 2) {
      syncWithYantra('search_query', { query: value, timestamp: new Date().toISOString() });
    }
  }, [syncWithYantra]);

  return (
    <>
      {/* ========================================== */}
      {/* FIRST CONTACT OVERLAY                      */}
      {/* ========================================== */}
      {showOverlay && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center p-6 transition-all duration-700 ${
            overlayExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ animation: !overlayExiting ? 'first-contact-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : undefined }}
        >
          {/* Dimmed backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl"></div>

          <div className={`relative w-full max-w-3xl space-y-8 transition-all duration-700 ${
            overlayExiting ? 'translate-y-8 opacity-0 scale-90' : ''
          }`}>
            {/* Decorative glow */}
            <div className="absolute -inset-20 bg-gradient-to-r from-accent-gold/5 via-accent-crimson/5 to-accent-gold/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Heading */}
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligent Matching Engine
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold italic text-foreground leading-tight text-balance">
                Who Clear-Cuts Your Night? <span className="text-accent-gold">//</span>{' '}
                <span className="text-gold-gradient">Find Your Perfect Match Instantly.</span>
              </h2>
            </div>

            {/* Oversized Search Bar */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-gold/30 via-accent-crimson/20 to-accent-gold/30 blur-sm animate-pulse"></div>
              <div className="relative rounded-2xl bg-surface/90 backdrop-blur-xl border border-accent-gold/30 p-2 shadow-[0_0_60px_rgba(201,162,39,0.15)]">
                <div className="flex items-center gap-4 px-5 py-4">
                  <Search className="w-6 h-6 text-accent-gold flex-shrink-0" />
                  <input
                    ref={overlayInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleOverlayInput(e.target.value)}
                    onClick={() => overlayInputRef.current?.focus()}
                    placeholder={typingPlaceholder || "Search by name, look, vibe, venue..."}
                    className="flex-1 bg-transparent text-lg md:text-xl text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Skip Link */}
            <div className="text-center">
              <button
                onClick={triggerDocking}
                className="text-sm text-muted-foreground/60 hover:text-accent-gold transition-colors underline underline-offset-4"
              >
                Skip to Full Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MAIN SECTION (docked state)                */}
      {/* ========================================== */}
      <section className={`space-y-6 transition-all duration-700 ${isDocked ? 'opacity-100 translate-y-0' : 'opacity-40'}`}>
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-crimson/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-crimson-light" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold italic text-foreground">
                Intelligent Talent Discovery
              </h2>
              <p className="text-xs text-muted-foreground">
                {ALL_PROFILES.length} specialists in the Phoenix network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{ALL_PROFILES.filter(p => p.status === 'live').length} Live Now</span>
          </div>
        </div>

        {/* Docked Omni-Search Bar */}
        <div className={`glass-card-glow p-5 md:p-6 space-y-4 transition-all duration-700 ${
          isDocked ? 'ring-1 ring-accent-gold/10' : ''
        }`}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent-gold">
            Find Your Ideal Specialist
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={dockedInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Try typing tags like 'petite redhead', 'high-energy alternative', 'classy lounge vip', or 'bilingual'..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-accent-gold/50 focus:shadow-[0_0_20px_rgba(201,162,39,0.1)] transition-all placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setVisibleCount(12); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              Showing <span className="text-accent-gold font-semibold">{filteredProfiles.length}</span> results
              for &ldquo;<span className="text-foreground">{searchQuery}</span>&rdquo;
            </p>
          )}
        </div>

        {/* Profile Roster Grid */}
        {filteredProfiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => handleCardClick(profile)}
              />
            ))}
          </div>
        )}

        {/* Intelligent Fallback State */}
        {filteredProfiles.length === 0 && searchQuery.trim() && (
          <div className="space-y-6">
            <div className="glass-card p-8 text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Recalibrating Parameters...
              </div>
              <p className="text-muted-foreground text-sm">
                No exact matches for &ldquo;<span className="text-foreground font-medium">{searchQuery}</span>&rdquo;.
              </p>
              <p className="text-accent-gold text-sm font-semibold">
                The closest matching profiles tonight are:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {fallbackProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onClick={() => handleCardClick(profile)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredProfiles.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-8 py-3 rounded-xl text-sm font-semibold text-accent-gold border border-accent-gold/20 hover:border-accent-gold/40 hover:bg-accent-gold/5 transition-all flex items-center gap-2 mx-auto"
            >
              Load More Specialists
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-muted-foreground/50 mt-2">
              Showing {visibleCount} of {filteredProfiles.length}
            </p>
          </div>
        )}

        {/* Profile Detail Drawer (Modal) */}
        {selectedProfile && (
          <ProfileDetailModal
            profile={selectedProfile}
            activeTab={activeGalleryTab}
            setActiveTab={setActiveGalleryTab}
            isBooking={isBooking}
            bookingConfirmed={bookingConfirmed}
            onBook={handleBookVIP}
            onClose={() => { setSelectedProfile(null); setBookingConfirmed(false); }}
          />
        )}
      </section>
    </>
  );
}

// ============================================
// PROFILE CARD COMPONENT
// ============================================

function ProfileCard({ profile, onClick }: { profile: TalentProfile; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const tierStyle = TIER_COLORS[profile.tier];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-left glass-card overflow-hidden hover:border-accent-gold/30 transition-all group relative"
    >
      {/* Portrait */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={getPortraitUrl(profile.id, 500)}
          alt={profile.stageName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

        {/* Live Status Indicator */}
        <div className="absolute top-2.5 left-2.5">
          {profile.status === 'live' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30">
              <Clock className="w-2.5 h-2.5 text-purple-400" />
              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Scheduled</span>
            </div>
          )}
        </div>

        {/* Tier Badge */}
        <div className="absolute top-2.5 right-2.5">
          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
            {profile.tier}
          </div>
        </div>

        {/* Hover Bio Overlay */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background via-background/95 to-background/60 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {profile.bio}
          </p>
        </div>

        {/* Bottom Content (always visible) */}
        <div className={`absolute inset-x-0 bottom-0 p-3 transition-all duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}>
          <h3 className="text-sm font-semibold text-foreground mb-0.5 truncate">{profile.stageName}</h3>
          <p className="text-[10px] text-muted-foreground truncate">
            {profile.status === 'live' ? profile.venueAnchor : profile.scheduleBlock}
          </p>
        </div>
      </div>

      {/* Attribute Chips */}
      <div className="p-3 pt-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[9px] px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground border border-border truncate">
            {profile.age}yo
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground border border-border truncate">
            {profile.height}
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground border border-border truncate">
            {profile.hairColor}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />
            <span className="text-[10px] font-semibold text-foreground">{profile.rating}</span>
          </div>
          <span className="text-[9px] text-accent-gold font-semibold uppercase tracking-wider">
            {profile.vibeStyle.split(' ')[0]}
          </span>
        </div>
      </div>
    </button>
  );
}

// ============================================
// PROFILE DETAIL MODAL COMPONENT
// ============================================

interface ProfileDetailModalProps {
  profile: TalentProfile;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  isBooking: boolean;
  bookingConfirmed: boolean;
  onBook: (profile: TalentProfile) => void;
  onClose: () => void;
}

const GALLERY_TABS = ['Portfolio', 'Glam', 'Stage', 'Editorial'];

function ProfileDetailModal({
  profile,
  activeTab,
  setActiveTab,
  isBooking,
  bookingConfirmed,
  onBook,
  onClose
}: ProfileDetailModalProps) {
  const tierStyle = TIER_COLORS[profile.tier];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md profile-modal-backdrop"></div>

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-accent-gold/15 shadow-[0_0_80px_rgba(201,162,39,0.08)] profile-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent-gold/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - Gallery */}
          <div className="lg:w-[45%] p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-border">
            {/* Main Image */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4">
              <Image
                src={profile.images[activeTab] || profile.images[0]}
                alt={`${profile.stageName} - ${GALLERY_TABS[activeTab]}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent"></div>

              {/* Status Badge on Image */}
              <div className="absolute top-3 left-3">
                {profile.status === 'live' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-400">
                      Live at {profile.venueAnchor.split(' ')[0]}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30">
                    <Clock className="w-3 h-3 text-purple-400" />
                    <span className="text-xs font-bold text-purple-400">{profile.scheduleBlock}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Tabs */}
            <div className="flex gap-2">
              {GALLERY_TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 relative rounded-lg overflow-hidden h-16 transition-all ${
                    activeTab === i
                      ? 'ring-2 ring-accent-gold ring-offset-2 ring-offset-surface'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={profile.images[i] || profile.images[0]}
                    alt={tab}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-background/30 flex items-end justify-center pb-1">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-foreground/80">{tab}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - The Live Briefcase Mirror */}
          <div className="lg:w-[55%] p-5 md:p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl md:text-3xl font-display font-bold italic text-foreground">
                  {profile.stageName}
                </h2>
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                  <Crown className="w-3 h-3 inline mr-1" />
                  {profile.tier} Tier
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-accent-gold" />
                <span>Tonight&apos;s Anchor: <span className="text-foreground font-medium">{profile.venueAnchor}</span></span>
              </div>
            </div>

            {/* Core Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Age', value: `${profile.age}` },
                { label: 'Height / Build', value: `${profile.height} / ${profile.build}` },
                { label: 'Hair', value: profile.hairColor },
                { label: 'Vibe Style', value: profile.vibeStyle },
                { label: 'Rating', value: `${profile.rating} / 5.0` },
                { label: 'Status', value: profile.status === 'live' ? 'On-Floor Live' : 'Scheduled' }
              ].map((attr) => (
                <div key={attr.label} className="space-y-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{attr.label}</p>
                  <p className="text-sm text-foreground font-medium">{attr.value}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="rounded-xl bg-surface-elevated/50 border border-border p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Professional Brief</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            </div>

            {/* Tags */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Keyword Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-accent-gold/8 text-accent-gold-light border border-accent-gold/15 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Ledger */}
            <div className="rounded-xl bg-accent-gold/5 border border-accent-gold/15 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent-gold" />
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent-gold">Live Ledger</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-foreground font-medium">
                    {profile.status === 'live'
                      ? `10:00 PM - 4:00 AM at ${profile.venueAnchor}`
                      : profile.scheduleBlock}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">{profile.availability}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
                  <span className="text-lg font-bold text-foreground">{profile.rating}</span>
                </div>
              </div>
            </div>

            {/* Direct VIP Dispatch CTA */}
            {!bookingConfirmed ? (
              <button
                onClick={() => onBook(profile)}
                disabled={isBooking}
                className="w-full py-4 rounded-xl btn-crimson text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(165,42,42,0.2)] hover:shadow-[0_0_40px_rgba(165,42,42,0.3)]"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Locking Session...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Lock VIP Session with {profile.stageName}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-400">VIP Session Locked</p>
                  <p className="text-[10px] text-muted-foreground">
                    Confirmation sent to your concierge line
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
