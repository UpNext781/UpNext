'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Link2,
  Loader2,
  Sparkles,
  User,
  MapPin,
  Palette,
  X,
} from 'lucide-react';

interface VelvetRopeProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  onVerificationComplete: () => void;
}

const ARCHETYPES = [
  'Petite Redhead Firecracker',
  'High-Energy Showstopper',
  'Classy Lounge VIP',
  'Exotic Stage Performer',
  'Sultry Conversationalist',
  'Girl-Next-Door Charm',
];

const VENUES = [
  "Christie's Cabaret Tempe",
  'Le Girls West Valley',
  'Bourbon Street Central PHX',
  'Skin Scottsdale',
  "Babe's Cabaret",
  'Hi-Liter',
];

type OnboardingStep = 0 | 1 | 2;

const STEP_LABELS = [
  'Profile Drafted',
  'Pending Peer Verification',
  'Live on City Grid',
] as const;

export default function VelvetRopeOnboarding({ syncWithYantra, onVerificationComplete }: VelvetRopeProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);

  // Identity Matrix fields
  const [stageName, setStageName] = useState('');
  const [archetype, setArchetype] = useState('');
  const [anchorVenue, setAnchorVenue] = useState('');

  // Vouch Gateway state
  const [vouchLinkGenerated, setVouchLinkGenerated] = useState(false);
  const [vouchLinkLoading, setVouchLinkLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [vouchCount, setVouchCount] = useState(0);

  // Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastExiting, setToastExiting] = useState(false);

  const profileComplete = stageName.trim().length > 0 && archetype.length > 0 && anchorVenue.length > 0;

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setToastExiting(false);
    setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => setToastVisible(false), 400);
    }, 4500);
  }, []);

  // Submit profile to advance to step 1
  const handleProfileSubmit = async () => {
    if (!profileComplete) return;
    await syncWithYantra('velvet_rope_profile', {
      stageName,
      archetype,
      anchorVenue,
      timestamp: new Date().toISOString(),
    });
    setCurrentStep(1);
  };

  // Generate vouch link
  const handleGenerateVouchLink = async () => {
    setVouchLinkLoading(true);
    await syncWithYantra('velvet_rope_vouch_link', {
      stageName,
      timestamp: new Date().toISOString(),
    });
    await new Promise((r) => setTimeout(r, 1600));
    const fakeHash = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`upnext.app/vouch/${stageName.toLowerCase().replace(/\s/g, '-')}-${fakeHash}`);
    setVouchLinkGenerated(true);
    setVouchLinkLoading(false);
  };

  // Simulate incoming vouches after link is generated
  useEffect(() => {
    if (!vouchLinkGenerated || vouchCount >= 2) return;

    const timer1 = setTimeout(() => {
      setVouchCount(1);
      showToast('Industry Vouch Received from Nova. 1/2 remaining to unlock.');
    }, 3500);

    const timer2 = setTimeout(() => {
      setVouchCount(2);
      showToast('Industry Vouch Received from Jade. Verification complete.');
      setTimeout(() => setCurrentStep(2), 1200);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [vouchLinkGenerated, vouchCount, showToast]);

  // Auto-complete after reaching step 2
  useEffect(() => {
    if (currentStep !== 2) return;
    const timer = setTimeout(() => {
      onVerificationComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [currentStep, onVerificationComplete]);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Velvet Rope Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-gold" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-gold">
            The Velvet Rope
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold italic text-foreground text-balance">
          Operator Onboarding <span className="text-accent-gold">&</span> Verification
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Complete your profile and receive peer verification to unlock the full Talent Suite.
        </p>
      </div>

      {/* ============================================ */}
      {/* VERIFICATION TRACKER (Progress Bar)          */}
      {/* ============================================ */}
      <div className="glass-card-glow p-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-5">
          Verification Progress
        </p>
        <div className="flex items-center gap-0">
          {STEP_LABELS.map((label, idx) => (
            <div key={label} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  idx < currentStep
                    ? 'bg-accent-gold border-accent-gold shadow-[0_0_15px_rgba(201,162,39,0.3)]'
                    : idx === currentStep
                      ? 'bg-accent-gold/15 border-accent-gold animate-pulse'
                      : 'bg-surface border-border'
                }`}>
                  {idx < currentStep ? (
                    <CheckCircle className="w-4 h-4 text-background" />
                  ) : idx === currentStep ? (
                    <span className="text-xs font-bold text-accent-gold">{idx + 1}</span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground/40">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight max-w-[90px] ${
                  idx <= currentStep ? 'text-accent-gold' : 'text-muted-foreground/40'
                }`}>
                  {label}
                </span>
              </div>
              {idx < STEP_LABELS.length - 1 && (
                <div className="flex-1 mx-2 self-start mt-4">
                  <div className="h-0.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-accent-gold rounded-full transition-all duration-700 ease-out"
                      style={{ width: idx < currentStep ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* STEP 0: THE IDENTITY MATRIX                  */}
      {/* ============================================ */}
      {currentStep === 0 && (
        <div className="glass-card-glow p-6 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-crimson/15 flex items-center justify-center">
              <User className="w-4 h-4 text-accent-crimson-light" />
            </div>
            <div>
              <p className="text-sm font-display font-bold italic text-foreground">The Identity Matrix</p>
              <p className="text-[10px] text-muted-foreground">Define your operator profile</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Stage Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                <Sparkles className="w-3 h-3 text-accent-gold" />
                Stage Name (Mononym Only)
              </label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => {
                  // Strip spaces and enforce mononym
                  const val = e.target.value.replace(/\s+/g, '');
                  setStageName(val);
                }}
                placeholder="e.g. Aria, Nova, Jade..."
                className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent-gold/40 focus:shadow-[0_0_20px_rgba(201,162,39,0.08)] transition-all"
              />
              {stageName && (
                <p className="text-[10px] text-accent-gold/60">
                  Your mononym: <span className="font-bold text-accent-gold">{stageName}</span>
                </p>
              )}
            </div>

            {/* Primary Archetype */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                <Palette className="w-3 h-3 text-accent-crimson-light" />
                Primary Archetype
              </label>
              <div className="relative">
                <select
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3.5 pr-10 text-sm text-foreground focus:outline-none focus:border-accent-gold/40 focus:shadow-[0_0_20px_rgba(201,162,39,0.08)] transition-all cursor-pointer"
                >
                  <option value="" className="bg-surface text-muted-foreground">Select your archetype...</option>
                  {ARCHETYPES.map((a) => (
                    <option key={a} value={a} className="bg-surface">{a}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 pointer-events-none rotate-90" />
              </div>
            </div>

            {/* Anchor Venue */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                <MapPin className="w-3 h-3 text-accent-gold" />
                Anchor Venue
              </label>
              <div className="relative">
                <select
                  value={anchorVenue}
                  onChange={(e) => setAnchorVenue(e.target.value)}
                  className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-3.5 pr-10 text-sm text-foreground focus:outline-none focus:border-accent-gold/40 focus:shadow-[0_0_20px_rgba(201,162,39,0.08)] transition-all cursor-pointer"
                >
                  <option value="" className="bg-surface text-muted-foreground">Select primary venue...</option>
                  {VENUES.map((v) => (
                    <option key={v} value={v} className="bg-surface">{v}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 pointer-events-none rotate-90" />
              </div>
            </div>
          </div>

          {/* Submit Profile */}
          <button
            onClick={handleProfileSubmit}
            disabled={!profileComplete}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed btn-gold neon-gold"
          >
            <CheckCircle className="w-4 h-4" />
            Lock In Profile
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================ */}
      {/* STEP 1: THE VOUCH GATEWAY                    */}
      {/* ============================================ */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Profile Summary (locked-in) */}
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center">
              <span className="text-sm font-bold text-accent-gold">{stageName.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{stageName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{archetype} &bull; {anchorVenue}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20">
              <CheckCircle className="w-3 h-3 text-accent-gold" />
              <span className="text-[9px] font-bold text-accent-gold uppercase tracking-wider">Drafted</span>
            </div>
          </div>

          {/* Vouch Gateway Card */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Frosted glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-elevated to-surface rounded-2xl" />
            <div className="absolute inset-0 backdrop-blur-sm bg-accent-gold/[0.02]" />

            <div className="relative border-2 border-accent-gold/15 rounded-2xl p-8 space-y-6 text-center">
              {/* Lock indicator */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-gold/8 border border-accent-gold/20 mx-auto">
                <Lock className="w-7 h-7 text-accent-gold" />
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <h3 className="text-lg font-display font-bold italic text-foreground">
                  Peer Verification Required
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  To maintain the integrity of the network, your profile remains hidden from
                  the Public Portal until verified by two established peers.
                </p>
              </div>

              {/* Vouch Progress */}
              <div className="flex items-center justify-center gap-4">
                {[0, 1].map((idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      idx < vouchCount
                        ? 'bg-accent-gold border-accent-gold shadow-[0_0_20px_rgba(201,162,39,0.3)]'
                        : 'bg-surface border-border'
                    }`}
                  >
                    {idx < vouchCount ? (
                      <CheckCircle className="w-5 h-5 text-background" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-muted-foreground/30" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground">
                {vouchCount}/2 Peer Vouches Received
              </p>

              {/* Generate Vouch Link */}
              {!vouchLinkGenerated ? (
                <button
                  onClick={handleGenerateVouchLink}
                  disabled={vouchLinkLoading}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 btn-gold neon-gold disabled:opacity-60"
                >
                  {vouchLinkLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Secure Link...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Generate Secure Vouch Link
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-accent-gold/20 text-xs text-accent-gold font-mono">
                    <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate max-w-[260px]">{generatedLink}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50">
                    Share this link with verified peers to receive your vouches.
                  </p>
                </div>
              )}

              {/* Requires text */}
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 font-semibold">
                Requires 2 active peer vouches
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STEP 2: VERIFIED / GOING LIVE                */}
      {/* ============================================ */}
      {currentStep === 2 && (
        <div className="glass-card-glow p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-gold/15 border border-accent-gold/30 mx-auto shadow-[0_0_40px_rgba(201,162,39,0.2)]">
            <Sparkles className="w-9 h-9 text-accent-gold" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold italic text-foreground">
              Verified <span className="text-accent-gold">&</span> Live
            </h3>
            <p className="text-sm text-muted-foreground">
              Welcome to the network, <span className="text-accent-gold font-bold">{stageName}</span>.
              Your profile is now visible on the City Grid.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 text-accent-gold animate-spin" />
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold">
              Loading Talent Suite...
            </span>
          </div>
        </div>
      )}

      {/* Skip for demo */}
      {currentStep < 2 && (
        <div className="text-center">
          <button
            onClick={onVerificationComplete}
            className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors underline underline-offset-4 uppercase tracking-wider"
          >
            Skip onboarding (demo)
          </button>
        </div>
      )}

      {/* ============================================ */}
      {/* FLOATING TOAST NOTIFICATION                  */}
      {/* ============================================ */}
      {toastVisible && (
        <div
          className={`fixed bottom-6 right-6 z-[70] max-w-sm transition-all duration-400 ${
            toastExiting
              ? 'opacity-0 translate-y-2 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
          style={{ animation: !toastExiting ? 'lucas-panel-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : undefined }}
        >
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-surface/95 backdrop-blur-xl border border-accent-gold/25 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(201,162,39,0.1)]">
            <div className="w-8 h-8 rounded-lg bg-accent-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-accent-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground leading-relaxed">{toastMessage}</p>
              <p className="text-[9px] text-muted-foreground/50 mt-1 uppercase tracking-wider">Vouch Protocol</p>
            </div>
            <button
              onClick={() => { setToastExiting(true); setTimeout(() => setToastVisible(false), 300); }}
              className="text-muted-foreground/40 hover:text-foreground transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
