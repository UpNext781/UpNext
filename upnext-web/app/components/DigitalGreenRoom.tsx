'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Lock,
  ShieldCheck,
  Send,
  Loader2,
  MoreHorizontal,
  AlertTriangle,
  Users,
  CheckCircle,
  X,
} from 'lucide-react';

interface GreenRoomProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
  discretionMode: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

const ACTIVE_PEERS = [
  { name: 'Jade', status: 'on-floor' as const },
  { name: 'Nova', status: 'on-floor' as const },
  { name: 'Ruby', status: 'break' as const },
];

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: 'sys-1',
    sender: 'System',
    content: 'Encrypted channel established. All comms are peer-verified and ephemeral.',
    timestamp: new Date(Date.now() - 45 * 60000),
    isSystem: true,
  },
  {
    id: 'msg-1',
    sender: 'Jade',
    content: 'Floor is running hot tonight. VIP section 3 has a repeat whale from last Thursday.',
    timestamp: new Date(Date.now() - 32 * 60000),
  },
  {
    id: 'msg-2',
    sender: 'Nova',
    content: 'Copy. I clocked him. Same crew, bigger tab this time. Rotating to main stage in 15.',
    timestamp: new Date(Date.now() - 28 * 60000),
  },
  {
    id: 'msg-3',
    sender: 'Ruby',
    content: 'On break til 11:30. Heads up -- door guy flagged a bachelor party inbound, 8 deep.',
    timestamp: new Date(Date.now() - 18 * 60000),
  },
  {
    id: 'msg-4',
    sender: 'Jade',
    content: 'Good intel. I will hold VIP 3 and let the floor absorb the party traffic first.',
    timestamp: new Date(Date.now() - 12 * 60000),
  },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function DigitalGreenRoom({ syncWithYantra, discretionMode }: GreenRoomProps) {
  const [hasAccess, setHasAccess] = useState(true);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleRequestAccess = useCallback(async () => {
    setRequestingAccess(true);
    await syncWithYantra('green_room_access_request', {
      timestamp: new Date().toISOString(),
      venue: "Christie's Cabaret",
    });
    // Simulate vouch approval after delay
    setTimeout(() => {
      setRequestingAccess(false);
      setHasAccess(true);
    }, 2200);
  }, [syncWithYantra]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    setIsSending(true);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');

    await syncWithYantra('green_room_message', {
      content: newMsg.content,
      venue: "Christie's Cabaret",
      timestamp: new Date().toISOString(),
    });

    setIsSending(false);
  }, [inputValue, syncWithYantra]);

  const handleFlagOpSec = useCallback(async (messageId: string, sender: string) => {
    setOpenMenuId(null);
    await syncWithYantra('opsec_flag', {
      flagged_message_id: messageId,
      flagged_sender: sender,
      venue: "Christie's Cabaret",
      timestamp: new Date().toISOString(),
    });
    setToast('Risk logged. Tribunal monitoring active.');
  }, [syncWithYantra]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 ${discretionMode ? 'blur-md pointer-events-none select-none' : ''}`}>
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold italic text-foreground">
                {"Live Comms // Christie's Cabaret"}
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Digital Green Room
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Encrypted</span>
          </div>
        </div>

        {/* Active Participants */}
        {hasAccess && (
          <div className="mt-4 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {ACTIVE_PEERS.length} Verified Operators Active:{' '}
              {ACTIVE_PEERS.map((peer, i) => (
                <span key={peer.name}>
                  <span className="text-foreground font-medium">{peer.name}</span>
                  {peer.status === 'break' && (
                    <span className="text-accent-gold/70 text-[10px] ml-0.5">(break)</span>
                  )}
                  {i < ACTIVE_PEERS.length - 1 && ', '}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Gatekeeper State (no access) */}
      {!hasAccess && (
        <div className="p-10 flex flex-col items-center text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-accent-crimson/10 border border-accent-crimson/20 flex items-center justify-center">
            <Lock className="w-7 h-7 text-accent-crimson-light" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-foreground">Green Room Locked</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              This is an invite-only encrypted channel for verified operators on tonight&apos;s active shift.
            </p>
          </div>
          <button
            onClick={handleRequestAccess}
            disabled={requestingAccess}
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-accent-crimson/15 border border-accent-crimson/30 text-accent-crimson-light hover:bg-accent-crimson/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {requestingAccess ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Requesting Vouches...
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                Request Green Room Access
              </>
            )}
          </button>
          <p className="text-[10px] text-muted-foreground/60">
            Requires 2 active peer vouches to unlock.
          </p>
        </div>
      )}

      {/* Active Chat State */}
      {hasAccess && (
        <>
          {/* Messages Feed */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`group ${msg.isSystem ? '' : 'relative'}`}>
                {msg.isSystem ? (
                  // System message
                  <div className="flex items-center justify-center gap-2 py-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-[10px] text-emerald-400/60 font-semibold uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      {msg.content}
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>
                ) : (
                  // Peer message
                  <div className={`flex gap-3 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                      msg.sender === 'You'
                        ? 'bg-accent-gold/15 text-accent-gold'
                        : 'bg-accent-crimson/15 text-accent-crimson-light'
                    }`}>
                      {msg.sender[0]}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[75%] ${msg.sender === 'You' ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender !== 'You' && (
                          <span className="text-[10px] font-bold text-foreground">{msg.sender}</span>
                        )}
                        <span className="text-[9px] text-muted-foreground/50">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className={`inline-block px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                        msg.sender === 'You'
                          ? 'bg-accent-gold/10 border border-accent-gold/15 text-foreground'
                          : 'bg-surface-elevated border border-border text-foreground/90'
                      }`}>
                        {msg.content}
                      </div>
                    </div>

                    {/* OpSec Context Menu (peer messages only) */}
                    {msg.sender !== 'You' && !msg.isSystem && (
                      <div className="relative flex items-start pt-5" ref={openMenuId === msg.id ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-surface-elevated"
                          aria-label="Message options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>

                        {openMenuId === msg.id && (
                          <div className="absolute left-0 top-10 z-50 w-56 py-1.5 rounded-xl bg-surface-elevated border border-accent-crimson/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                            style={{ animation: 'profile-modal-enter 0.15s ease-out' }}
                          >
                            <button
                              onClick={() => handleFlagOpSec(msg.id, msg.sender)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-accent-crimson/10 transition-colors"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-accent-crimson-light" />
                              <span className="text-xs font-semibold text-accent-crimson-light">
                                Flag OpSec Risk
                              </span>
                            </button>
                            <p className="px-4 py-1 text-[9px] text-muted-foreground/50">
                              Silent Peer Review
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a secure message..."
                className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-emerald-500/40 transition-colors placeholder:text-muted-foreground/50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isSending}
                className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[9px] text-muted-foreground/40 mt-2 text-center">
              End-to-end encrypted. Messages are ephemeral and not stored.
            </p>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-accent-crimson/90 border border-accent-crimson-light/30 shadow-[0_8px_32px_rgba(165,42,42,0.4)] backdrop-blur-xl"
          style={{ animation: 'profile-modal-enter 0.25s ease-out' }}
        >
          <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
          <span className="text-xs font-bold text-white">{toast}</span>
          <button onClick={() => setToast(null)} className="text-white/60 hover:text-white transition-colors ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Access Toggle (demo control) */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setHasAccess(!hasAccess)}
          className="text-[9px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors underline underline-offset-2"
        >
          {hasAccess ? 'Simulate locked state' : 'Simulate access granted'}
        </button>
      </div>
    </div>
  );
}
