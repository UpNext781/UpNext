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
} from 'lucide-react';

interface RoxyCoPilotProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  discretionMode: boolean;
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

const LIVE_FEED_ITEMS = [
  {
    id: 'feed-1',
    text: 'Analyzing saturation at primary venue... 31% \u2014 well below threshold.',
    time: 'Now',
    priority: 'normal' as const,
  },
  {
    id: 'feed-2',
    text: 'Core recommendation locked. Christie\'s Cabaret remains optimal.',
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

export default function RoxyCoPilot({ syncWithYantra, discretionMode }: RoxyCoPilotProps) {
  const [messages, setMessages] = useState<RoxyMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [feedExpanded, setFeedExpanded] = useState(true);
  const [commandsExpanded, setCommandsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              Roxy AI <span className="text-accent-crimson-light">//</span> Strategic Shift Co-Pilot
            </h2>
            <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online &mdash; Monitoring floor metrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-crimson/10 text-accent-crimson-light">
          <Eye className="w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Tactical</span>
        </div>
      </div>

      {/* Live Status Feed */}
      <div className="relative space-y-2">
        <button
          onClick={() => setFeedExpanded(!feedExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-accent-gold" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Live Intelligence Feed
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
    </div>
  );
}
