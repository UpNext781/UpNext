'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  X,
  ChevronDown,
  MessageSquare,
  Wine,
  Car,
  Crown,
} from 'lucide-react';

interface LucasConciergeProps {
  syncWithYantra: (action: string, payload: Record<string, unknown>) => Promise<{ success: boolean }>;
}

interface ChatMessage {
  id: string;
  role: 'lucas' | 'user';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { id: 'vibe-check', label: 'Ask Lucas for a venue vibe check', icon: MessageSquare },
  { id: 'transport', label: 'Coordinate custom transport', icon: Car },
  { id: 'vip-upgrade', label: 'Request an urgent VIP table upgrade', icon: Crown },
];

const LUCAS_RESPONSES: Record<string, string> = {
  'vibe-check':
    "I've pulled tonight's live floor data. Christie's Cabaret in Tempe is running a high-energy rotation with 94% VIP capacity. Le Girls has a more intimate lounge atmosphere\u2014perfect for a quieter evening. Shall I deep-dive on either venue?",
  transport:
    "I can arrange a black car or luxury SUV from any pickup point in the Valley. Standard lead time is 25 minutes. Would you like me to dispatch one now, or schedule for a specific arrival window tonight?",
  'vip-upgrade':
    "Checking live table inventory... Table 3 at Christie's just opened with a direct stage view. I can lock it for 15 minutes while you decide. The premium package includes 2 bottles and priority host assignment. Want me to hold it?",
  default:
    "I'm cross-referencing tonight's venue data and talent rotations to find the perfect match for you. Could you tell me a bit more about what you're looking for\u2014energy level, group size, or any specific preferences?",
};

export default function LucasConcierge({ syncWithYantra }: LucasConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting',
      role: 'lucas',
      content:
        "Good evening. I'm Lucas, your private concierge for tonight. I have real-time access to every venue, table, and talent rotation in the Phoenix network. How can I elevate your evening?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string, actionId?: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    await syncWithYantra('lucas_chat', {
      message: content,
      action_id: actionId || null,
      timestamp: new Date().toISOString(),
    });

    // Simulate Lucas response
    await new Promise((r) => setTimeout(r, 1800));

    const responseText =
      actionId && LUCAS_RESPONSES[actionId]
        ? LUCAS_RESPONSES[actionId]
        : LUCAS_RESPONSES.default;

    const lucasMsg: ChatMessage = {
      id: `lucas-${Date.now()}`,
      role: 'lucas',
      content: responseText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, lucasMsg]);
    setIsTyping(false);
  };

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[number]) => {
    sendMessage(action.label, action.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group"
        >
          <div className="relative">
            {/* Outer pulse ring */}
            <div className="absolute -inset-2 rounded-full bg-accent-gold/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/80 flex items-center justify-center shadow-[0_0_30px_rgba(201,162,39,0.4)] group-hover:shadow-[0_0_40px_rgba(201,162,39,0.6)] transition-shadow">
              <Sparkles className="w-7 h-7 text-background" />
            </div>
            {/* Active indicator */}
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </div>
          {/* Label */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg bg-surface border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs font-semibold text-foreground">Lucas is active</p>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden border border-accent-gold/20 shadow-[0_0_60px_rgba(0,0,0,0.5),0_0_30px_rgba(201,162,39,0.15)]"
          style={{ animation: 'lucas-panel-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Header */}
          <div className="bg-surface/95 backdrop-blur-xl border-b border-accent-gold/15 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold/25 to-accent-crimson/15 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent-gold" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-surface" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Lucas <span className="text-accent-gold">//</span> Your Private Concierge
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active &mdash; Calibrating your evening
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-background/95 backdrop-blur-xl p-4 space-y-4 min-h-[280px] max-h-[360px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-accent-gold/15 border border-accent-gold/20 text-foreground'
                      : 'bg-surface border border-border text-foreground/90'
                  }`}
                >
                  {msg.role === 'lucas' && (
                    <p className="text-[9px] uppercase tracking-[0.2em] text-accent-gold font-bold mb-1.5">
                      Lucas
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-[9px] text-muted-foreground/40 mt-1.5 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border rounded-2xl px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-accent-gold font-bold mb-1.5">
                    Lucas
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-gold/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-accent-gold/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-accent-gold/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          {messages.length <= 2 && (
            <div className="bg-background/95 backdrop-blur-xl px-4 py-3 border-t border-border/50">
              <div className="space-y-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      disabled={isTyping}
                      className="w-full text-left px-3 py-2.5 rounded-xl bg-surface border border-border hover:border-accent-gold/30 transition-all flex items-center gap-3 group disabled:opacity-50"
                    >
                      <Icon className="w-4 h-4 text-accent-gold flex-shrink-0" />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="bg-surface/95 backdrop-blur-xl border-t border-accent-gold/10 p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Lucas anything..."
                disabled={isTyping}
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent-gold/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold hover:bg-accent-gold/25 transition-colors disabled:opacity-30"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
