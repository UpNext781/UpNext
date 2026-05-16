'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Send,
  Loader2,
  Activity,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Zap,
  AlertTriangle,
  Eye,
  EyeOff,
  DollarSign,
  Crosshair,
  ShieldAlert,
  Radio,
  PenLine,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

interface RoxyCoPilotProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  discretionMode: boolean;
  decoyActive?: boolean;
  onDecoyToggle?: () => void;
}

interface RoxyMessage {
  id: string;
  role: 'roxy' | 'user';
  content: string;
  timestamp: Date;
  priority?: 'high' | 'normal';
}

const SHORTCUT_COMMANDS = [
  {
    id: 'cycle-copy',
    label: 'Have Roxy cycle my notification copy',
    icon: RefreshCw,
  },
  {
    id: 'regular-activity',
    label: 'Query Roxy on current regular client activity',
    icon: Activity,
  },
  {
    id: 'decoy-interface',
    label: 'Toggle emergency decoy interface',
    icon: ShieldCheck,
  },
];

const ROXY_RESPONSES: Record<string, string> = {
  'cycle-copy':
    "Copy rotated. I've swapped your outbound notification to the 'Mystic' template. Current text reads: \"Tonight\u2019s line is locked. The deck clears at midnight.\" This copy hasn't been used in 4 shifts\u2014zero pattern overlap. You're clean.",
  'regular-activity':
    "Scanning your regular client ledger... 'Blackcard-7' checked in at Christie's 18 min ago, Table 3. Historical pattern says he tips 40% above floor avg. 'SilverFox-12' is en route to Le Girls\u2014ETA 35 min. No other regulars flagged in tonight's data.",
  'decoy-interface':
    "Decoy interface armed. If triggered, your screen will flash to a generic calendar/scheduling app. All financial data, venue names, and client intel will be masked instantly. Tap the Discretion Mode toggle to activate. Stay sharp.",
  default:
    "I'm running a full analysis on your current floor metrics. Saturation at your venue is holding at 31%\u2014plenty of room. VIP demand is spiking in the next 90 minutes. I'd recommend positioning near Table 3 for maximum visibility. Need anything else?",
};

// ============================================
// TACTICAL INTELLIGENCE ALERTS
// ============================================
interface TacticalAlert {
  id: string;
  type: 'pricing' | 'target' | 'opsec';
  text: string;
  time: string;
}

const TACTICAL_ALERTS: TacticalAlert[] = [
  {
    id: 'alert-pricing-1',
    type: 'pricing',
    text: 'Surge Detected: Floor at 92% capacity. Suggest raising VIP minimums by $100.',
    time: '12s ago',
  },
  {
    id: 'alert-target-1',
    type: 'target',
    text: "Proximity Hit: A client matching your 'Whale' profile just booked a skybox.",
    time: '2m ago',
  },
  {
    id: 'alert-opsec-1',
    type: 'opsec',
    text: 'Tribunal Update: 1 operator flagged in the Digital Green Room.',
    time: '8m ago',
  },
  {
    id: 'alert-pricing-2',
    type: 'pricing',
    text: "VIP demand inflection point reached. Dance rate premium now +35% above floor avg.",
    time: '14m ago',
  },
  {
    id: 'alert-target-2',
    type: 'target',
    text: "Repeat Client Alert: 'SilverFox-12' on approach. Last visit: $1,800 spend. Prefers Table 7.",
    time: '19m ago',
  },
];

const ALERT_STYLES: Record<TacticalAlert['type'], { bg: string; border: string; dot: string; icon: React.ElementType; label: string }> = {
  pricing: {
    bg: 'bg-accent-gold/8',
    border: 'border-accent-gold/20',
    dot: 'bg-accent-gold animate-pulse',
    icon: DollarSign,
    label: 'PRICING',
  },
  target: {
    bg: 'bg-accent-crimson/8',
    border: 'border-accent-crimson/20',
    dot: 'bg-accent-crimson-light animate-pulse',
    icon: Crosshair,
    label: 'TARGET',
  },
  opsec: {
    bg: 'bg-muted-foreground/5',
    border: 'border-border',
    dot: 'bg-muted-foreground/40',
    icon: ShieldAlert,
    label: 'OPSEC',
  },
};

const LIVE_FEED_ITEMS = [
  {
    id: 'feed-1',
    text: 'Analyzing saturation at primary venue... 31% \u2014 well below threshold.',
    time: 'Now',
    priority: 'normal' as const,
  },
  {
    id: 'feed-2',
    text: "Core recommendation locked. Christie's Cabaret remains optimal.",
    time: '2m ago',
    priority: 'normal' as const,
  },
  {
    id: 'feed-3',
    text: 'VIP surge detected: 3 new bookings in last 15 min at your venue.',
    time: '5m ago',
    priority: 'high' as const,
  },
  {
    id: 'feed-4',
    text: 'Notification copy last rotated 2 shifts ago. Recommend cycling.',
    time: '12m ago',
    priority: 'normal' as const,
  },
];

// ============================================
// CLIENT COMMS COPILOT (Ghostwriter)
// ============================================
const TARGET_PROFILES = [
  { id: 'whale', label: 'The Whale', desc: 'High roller. $2K+ avg spend.' },
  { id: 'regular', label: 'The Regular', desc: 'Loyal return visitor.' },
  { id: 'ghost', label: 'The Ghost', desc: 'Went silent after 3+ visits.' },
] as const;

const OBJECTIVES = [
  { id: 'pull', label: 'Pull to Venue', desc: 'Get them in the door tonight.' },
  { id: 'upsell', label: 'Upsell Bottle Service', desc: 'Escalate spend tier.' },
  { id: 'retain', label: 'Flirt & Retain', desc: 'Keep the hook warm.' },
] as const;

type ScriptTone = 'direct' | 'sultry' | 'engineer';

interface GeneratedScript {
  tone: ScriptTone;
  label: string;
  sublabel: string;
  text: string;
  accentColor: string;
  dotColor: string;
}

const SCRIPT_MATRIX: Record<string, Record<string, GeneratedScript[]>> = {
  'whale': {
    'pull': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "Floor is packed tonight. I have a booth in the back with your name on it if you get here by 11.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "Wearing that black dress you like. Let me know when you're pulling up.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "Just had a table open up in my section. Thought of you first before I let the host give it away.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
    'upsell': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "We just got that Clase Azul you were asking about. I set a bottle aside. It won't last the night.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "I'm in the skybox tonight. Come keep me company and I'll make sure you're taken care of.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "Management's running a private tasting tonight, invite-only. I told them to hold your spot.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
    'retain': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "Haven't seen you in a minute. The floor's not the same. Swing by this week?", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "Was thinking about that conversation we had last time. You owe me a rematch.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "Just got put on a new rotation schedule. Wanted to make sure you know my nights before anyone else.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
  },
  'regular': {
    'pull': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "Your usual spot's open tonight. Kitchen just dropped new apps. Come through.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "It's been too quiet without you here. I saved your seat.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "They're running a regulars-only deal tonight. Didn't want you to miss it.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
    'upsell': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "We just opened the VIP mezzanine tonight. I can get you in before it fills up.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "I want to show you the new lounge upstairs. It's invite-only and I saved you a spot.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "The manager just comped a round for the VIP section. I told them to add you to the list.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
    'retain': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "Miss seeing your face. Free drink on me next time you come in.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "I keep looking at the door expecting to see you walk in. Don't be a stranger.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "Someone asked about your table the other night. I told them it was reserved. Just in case.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
  },
  'ghost': {
    'pull': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "Long time. Tonight's a big night and I'd love to see you here. No pressure, just good energy.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "You crossed my mind today. Come find me tonight? I'll make it worth it.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "We're doing something different tonight. Thought it might pull you out of hiding.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
    'upsell': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "We just redesigned the VIP section. Honestly thought of you. Come see it.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "I got moved to the premium lounge. It's a whole new vibe. You should come experience it.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "There's a private event this Friday and I have one plus-one left. You in?", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
    'retain': [
      { tone: 'direct', label: 'Option A', sublabel: 'Direct & Urgent', text: "Just checking in. No agenda. Hope you're good.", accentColor: 'text-accent-crimson-light', dotColor: 'bg-accent-crimson-light' },
      { tone: 'sultry', label: 'Option B', sublabel: 'Sultry & Exclusive', text: "You've been quiet. I noticed. That's all.", accentColor: 'text-accent-gold', dotColor: 'bg-accent-gold' },
      { tone: 'engineer', label: 'Option C', sublabel: 'The Social Engineer', text: "Funny, your name came up when someone asked who the best regulars were. Thought you should know.", accentColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
    ],
  },
};

export default function RoxyCoPilot({ syncWithYantra, discretionMode, decoyActive, onDecoyToggle }: RoxyCoPilotProps) {
  const [messages, setMessages] = useState<RoxyMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [feedExpanded, setFeedExpanded] = useState(true);
  const [commandsExpanded, setCommandsExpanded] = useState(true);
  const [alertsExpanded, setAlertsExpanded] = useState(true);
  const [radarPulseCount, setRadarPulseCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ghostwriter state
  const [gwTarget, setGwTarget] = useState('');
  const [gwObjective, setGwObjective] = useState('');
  const [gwScripts, setGwScripts] = useState<GeneratedScript[]>([]);
  const [gwGenerating, setGwGenerating] = useState(false);
  const [gwCopied, setGwCopied] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Radar pulse counter for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarPulseCount(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sendCommand = async (content: string, commandId?: string) => {
    const userMsg: RoxyMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    await syncWithYantra('roxy_command', {
      message: content,
      command_id: commandId || null,
      discretion_mode: discretionMode,
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 1500));

    const responseText =
      commandId && ROXY_RESPONSES[commandId]
        ? ROXY_RESPONSES[commandId]
        : ROXY_RESPONSES.default;

    const roxyMsg: RoxyMessage = {
      id: `roxy-${Date.now()}`,
      role: 'roxy',
      content: responseText,
      timestamp: new Date(),
      priority: commandId === 'decoy-interface' ? 'high' : 'normal',
    };
    setMessages((prev) => [...prev, roxyMsg]);
    setIsThinking(false);
  };

  const handleShortcut = (cmd: (typeof SHORTCUT_COMMANDS)[number]) => {
    sendCommand(cmd.label, cmd.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendCommand(inputValue.trim());
  };

  const handleGenerateHooks = async () => {
    if (!gwTarget || !gwObjective) return;
    setGwGenerating(true);
    setGwScripts([]);

    await syncWithYantra('ghostwriter_generate', {
      target: gwTarget,
      objective: gwObjective,
      timestamp: new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 1800));

    const scripts = SCRIPT_MATRIX[gwTarget]?.[gwObjective] || SCRIPT_MATRIX['whale']['pull'];
    setGwScripts(scripts);
    setGwGenerating(false);
  };

  const handleCopyScript = async (text: string, tone: string) => {
    await navigator.clipboard.writeText(text);
    setGwCopied(tone);
    await syncWithYantra('ghostwriter_copy', {
      target: gwTarget,
      objective: gwObjective,
      tone,
      timestamp: new Date().toISOString(),
    });
    setTimeout(() => setGwCopied(null), 2000);
  };

  return (
    <div className="glass-card-glow p-5 md:p-6 space-y-5 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-crimson/5 via-transparent to-accent-gold/5 pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-crimson/25 to-accent-gold/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent-crimson-light" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Roxy AI <span className="text-accent-crimson-light">//</span> Tactical Command Center
            </h2>
            <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online &mdash; Full spectrum monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-crimson/10 text-accent-crimson-light">
          <Eye className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Tactical</span>
        </div>
      </div>

      {/* ============================================ */}
      {/* LIVE INTELLIGENCE FEED (Typed Alert Chips)   */}
      {/* ============================================ */}
      <div className="relative space-y-2">
        <button
          onClick={() => setAlertsExpanded(!alertsExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-accent-crimson-light" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Live Intelligence Alerts
            </p>
            <span className="w-4 h-4 rounded-full bg-accent-crimson/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-accent-crimson-light">{TACTICAL_ALERTS.length}</span>
            </span>
          </div>
          {alertsExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {alertsExpanded && (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {TACTICAL_ALERTS.map((alert) => {
              const style = ALERT_STYLES[alert.type];
              const AlertIcon = style.icon;
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border transition-colors ${style.bg} ${style.border}`}
                >
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mt-0.5">
                    <AlertIcon className={`w-3.5 h-3.5 ${
                      alert.type === 'pricing' ? 'text-accent-gold' :
                      alert.type === 'target' ? 'text-accent-crimson-light' :
                      'text-muted-foreground/60'
                    }`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${
                        alert.type === 'pricing' ? 'text-accent-gold' :
                        alert.type === 'target' ? 'text-accent-crimson-light' :
                        'text-muted-foreground/50'
                      }`}>
                        {style.label}
                      </span>
                      <span className="text-[8px] text-muted-foreground/30">{alert.time}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      discretionMode ? 'blur-sm select-none' : 'text-foreground/80'
                    }`}>
                      {alert.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* BLACKBOOK RADAR                              */}
      {/* ============================================ */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-3.5 h-3.5 text-accent-gold" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Blackbook Radar
          </p>
          <span className="text-[9px] text-accent-gold font-semibold ml-auto">
            Scan #{radarPulseCount + 1}
          </span>
        </div>

        <div className="relative rounded-xl bg-surface/60 border border-accent-gold/10 overflow-hidden p-4">
          {/* Radar visualization */}
          <div className="relative w-full h-28 flex items-center justify-center">
            {/* Concentric rings */}
            <div className="absolute w-24 h-24 rounded-full border border-accent-gold/8" />
            <div className="absolute w-16 h-16 rounded-full border border-accent-gold/12" />
            <div className="absolute w-8 h-8 rounded-full border border-accent-gold/18" />

            {/* Center dot */}
            <div className="absolute w-2 h-2 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(201,162,39,0.5)]" />

            {/* Sweep line */}
            <div
              className="absolute w-12 h-[1px] bg-gradient-to-r from-accent-gold/60 to-transparent origin-left radar-sweep"
              style={{ left: '50%', top: '50%' }}
            />

            {/* Detected blips */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"
              style={{ top: '25%', left: '62%' }} />
            <div className="absolute w-1 h-1 rounded-full bg-accent-crimson-light animate-pulse"
              style={{ top: '60%', left: '35%' }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
              style={{ top: '40%', left: '70%' }} />

            {/* Fade overlay at edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-surface/60 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-accent-gold/10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
              <span className="text-[10px] font-semibold text-accent-gold">Active Floor Scanning</span>
            </div>
            <span className={`text-[10px] ${discretionMode ? 'blur-sm select-none' : 'text-muted-foreground/60'}`}>
              3 matches on-premises
            </span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* CLIENT COMMS COPILOT (Ghostwriter)           */}
      {/* ============================================ */}
      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <PenLine className="w-3.5 h-3.5 text-accent-crimson-light" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Roxy <span className="text-accent-crimson-light">//</span> Ghostwriter
          </p>
        </div>

        <div className="rounded-xl bg-surface/60 border border-accent-crimson/10 p-4 space-y-4">
          {/* Target Profile Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Target Profile
            </label>
            <div className="relative">
              <select
                value={gwTarget}
                onChange={(e) => { setGwTarget(e.target.value); setGwScripts([]); }}
                className="w-full appearance-none bg-surface border border-border rounded-lg px-3.5 py-2.5 pr-8 text-xs text-foreground focus:outline-none focus:border-accent-crimson/40 transition-colors cursor-pointer"
              >
                <option value="" className="bg-surface text-muted-foreground">Select target type...</option>
                {TARGET_PROFILES.map(t => (
                  <option key={t.id} value={t.id} className="bg-surface">{t.label} -- {t.desc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 pointer-events-none" />
            </div>
          </div>

          {/* Objective Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Objective
            </label>
            <div className="relative">
              <select
                value={gwObjective}
                onChange={(e) => { setGwObjective(e.target.value); setGwScripts([]); }}
                className="w-full appearance-none bg-surface border border-border rounded-lg px-3.5 py-2.5 pr-8 text-xs text-foreground focus:outline-none focus:border-accent-crimson/40 transition-colors cursor-pointer"
              >
                <option value="" className="bg-surface text-muted-foreground">Select objective...</option>
                {OBJECTIVES.map(o => (
                  <option key={o.id} value={o.id} className="bg-surface">{o.label} -- {o.desc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 pointer-events-none" />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateHooks}
            disabled={!gwTarget || !gwObjective || gwGenerating}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-accent-crimson/15 border border-accent-crimson/25 text-accent-crimson-light hover:bg-accent-crimson/25 hover:border-accent-crimson/40 hover:shadow-[0_0_25px_rgba(165,42,42,0.12)]"
          >
            {gwGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Roxy is writing...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Generate Hooks
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Output Matrix: Generated Scripts */}
        {gwScripts.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 px-1">
              Generated Scripts &mdash; {TARGET_PROFILES.find(t => t.id === gwTarget)?.label} / {OBJECTIVES.find(o => o.id === gwObjective)?.label}
            </p>
            {gwScripts.map((script) => (
              <div
                key={script.tone}
                className="rounded-xl bg-surface border border-border p-4 space-y-2.5 hover:border-accent-gold/20 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${script.dotColor}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${script.accentColor}`}>
                      {script.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground/40">
                      {script.sublabel}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyScript(script.text, script.tone)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-muted-foreground hover:text-accent-gold hover:border-accent-gold/30 transition-all opacity-60 group-hover:opacity-100"
                  >
                    {gwCopied === script.tone ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-semibold text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[9px] font-semibold">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className={`text-sm leading-relaxed ${
                  discretionMode ? 'blur-sm select-none' : 'text-foreground/85'
                }`}>
                  &ldquo;{script.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* STATUS FEED (original)                       */}
      {/* ============================================ */}
      <div className="relative space-y-2">
        <button
          onClick={() => setFeedExpanded(!feedExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-accent-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Roxy Status Feed
            </p>
          </div>
          {feedExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {feedExpanded && (
          <div className="space-y-1.5">
            {LIVE_FEED_ITEMS.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs ${
                  item.priority === 'high'
                    ? 'bg-accent-crimson/8 border border-accent-crimson/15'
                    : 'bg-surface/50'
                }`}
              >
                <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  item.priority === 'high' ? 'bg-accent-crimson-light animate-pulse' : 'bg-accent-gold/50'
                }`} />
                <p className={`leading-snug flex-1 ${discretionMode ? 'blur-sm select-none' : 'text-muted-foreground'}`}>
                  {item.text}
                </p>
                <span className="text-[9px] text-muted-foreground/40 whitespace-nowrap flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shortcut Commands */}
      <div className="relative space-y-2">
        <button
          onClick={() => setCommandsExpanded(!commandsExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-accent-crimson-light" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Quick Commands
            </p>
          </div>
          {commandsExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {commandsExpanded && (
          <div className="space-y-2">
            {SHORTCUT_COMMANDS.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleShortcut(cmd)}
                  disabled={isThinking}
                  className="w-full text-left px-3.5 py-3 rounded-xl bg-surface border border-border hover:border-accent-crimson/30 transition-all flex items-center gap-3 group disabled:opacity-50"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent-crimson/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-crimson/20 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-accent-crimson-light" />
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    {cmd.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Conversation Thread */}
      {messages.length > 0 && (
        <div className="relative space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Tactical Log
            </p>
          </div>

          <div className="max-h-[240px] overflow-y-auto space-y-2.5 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl px-3.5 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-accent-gold/8 border border-accent-gold/15 ml-8'
                    : msg.priority === 'high'
                    ? 'bg-accent-crimson/8 border border-accent-crimson/20 mr-4'
                    : 'bg-surface border border-border mr-4'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p
                    className={`text-[9px] uppercase tracking-[0.2em] font-bold ${
                      msg.role === 'roxy' ? 'text-accent-crimson-light' : 'text-accent-gold'
                    }`}
                  >
                    {msg.role === 'roxy' ? 'Roxy' : 'You'}
                  </p>
                  <span className="text-[8px] text-muted-foreground/40">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${
                  discretionMode && msg.role === 'roxy' ? 'blur-sm select-none' : 'text-foreground/85'
                }`}>
                  {msg.content}
                </p>
              </div>
            ))}

            {isThinking && (
              <div className="bg-surface border border-accent-crimson/15 rounded-xl px-3.5 py-2.5 mr-4">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent-crimson-light mb-1">
                  Roxy
                </p>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 text-accent-crimson-light animate-spin" />
                  <span className="text-xs text-muted-foreground italic">
                    Processing tactical query...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Text Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Command Roxy directly..."
            disabled={isThinking}
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent-crimson/40 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="w-10 h-10 rounded-xl bg-accent-crimson/15 flex items-center justify-center text-accent-crimson-light hover:bg-accent-crimson/25 transition-colors disabled:opacity-30"
          >
            {isThinking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-[9px] text-muted-foreground/30">
          <span>Channel: E2E Encrypted</span>
          <span>Discretion: {discretionMode ? 'Active' : 'Off'}</span>
        </div>
      </form>

      {/* ============================================ */}
      {/* DECOY PROTOCOL (Panic Button)                */}
      {/* ============================================ */}
      <div className="relative border-t border-accent-crimson/15 pt-4 mt-2">
        <button
          onClick={onDecoyToggle}
          className={`w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
            decoyActive
              ? 'bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
              : 'bg-accent-crimson/10 border-2 border-accent-crimson/25 text-accent-crimson-light hover:bg-accent-crimson/20 hover:border-accent-crimson/40 hover:shadow-[0_0_30px_rgba(165,42,42,0.15)]'
          }`}
        >
          {decoyActive ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
          {decoyActive ? 'Disengage Decoy Protocol' : 'Engage Decoy Protocol'}
        </button>
        <p className="text-[9px] text-center text-muted-foreground/30 mt-2 tracking-wide">
          {decoyActive
            ? 'Ghost state active. All identifiers masked. Tap to restore.'
            : 'Instantly mask all sensitive data. Screen converts to cover app.'}
        </p>
      </div>
    </div>
  );
}
