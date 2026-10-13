import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  Check,
  Sparkles,
} from "lucide-react";
import { generateV2Response, routeMessage } from "../services/geminiService";
import { ParsedTransaction, AgentRoutingResponse } from "../types";
import { cn } from "../lib/utils";
import { useAnalyticsEvent } from "../hooks/useAnalyticsEvent";

type Message =
  | {
      id: string;
      text: string;
      sender: "user";
      timestamp: Date;
      status: "sent" | "delivered" | "read";
    }
  | {
      id: string;
      text: string;
      sender: "bot";
      timestamp: Date;
      status?: "read";
      parsed?: ParsedTransaction;
      triage?: AgentRoutingResponse;
    };

export const WhatsAppSimulation: React.FC<{ storeId: string }> = ({
  storeId,
}) => {
  const { trackEvent } = useAnalyticsEvent();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Namaste! I'm your DukaanMitra v2.0 AI. Send me your transactions or ask about customer preferences. I remember everything!",
      sender: "bot",
      timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      status: "read",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    trackEvent("whatsapp_message_sent", { store_id: storeId });

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // 1. Triage the message (Agent Swarm routing)
      const triage = await routeMessage(input, storeId);

      // 2. Generate response with Memory context
      const botResponse = await generateV2Response(
        input,
        storeId,
        undefined,
        messages.map((m) => ({
          role: m.sender === "bot" ? "model" : "user",
          parts: [{ text: m.text }],
        })),
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        status: "read",
        triage,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("AI processing error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Munim is thinking too hard... Please try again in a bit.",
        sender: "bot",
        timestamp: new Date(),
        status: "read",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#fdfdfd] overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-5 flex items-center justify-between text-white border-b-4 border-indigo-600">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot size={28} />
          </div>
          <div className="flex flex-col -space-y-1">
            <h3 className="font-black text-lg italic uppercase tracking-tighter">
              Munim AI
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-70 italic">
                Online & Thinking
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 hidden sm:block">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 italic">
            v2.0 Hyper-ledger
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#ece5dd]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[85%] p-5 rounded-[1.5rem] shadow-sm relative border-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2",
              msg.sender === "user"
                ? "bg-indigo-50 border-indigo-100 ml-auto rounded-tr-none hover:shadow-lg translate-x-1"
                : "bg-white border-slate-100 mr-auto rounded-tl-none hover:shadow-lg -translate-x-1",
            )}
          >
            <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
              {msg.text}
            </p>
            {msg.triage && (
              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center gap-2">
                <div className="p-1 px-2 bg-indigo-600 text-white rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm italic">
                  <Sparkles size={8} className="animate-pulse" />
                  {msg.triage.intent} AGENT
                </div>
                <span className="text-[9px] font-bold text-slate-400 italic truncate max-w-[150px] opacity-70">
                  {msg.triage.reasoning}
                </span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 mt-2 opacity-50">
              <span className="text-[9px] font-black text-slate-500">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {msg.sender === "user" && (
                <div className="flex items-center -space-x-1">
                  <Check
                    size={10}
                    className={cn(
                      msg.status === "read"
                        ? "text-indigo-600"
                        : "text-slate-400",
                    )}
                  />
                  <Check
                    size={10}
                    className={cn(
                      msg.status === "read"
                        ? "text-indigo-600"
                        : "text-slate-400",
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="bg-white border-2 border-slate-100 p-4 px-6 rounded-[2rem] rounded-tl-none shadow-sm w-max flex items-center gap-3 animate-pulse">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
              Munim is writing
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white p-6 border-t-4 border-slate-900 flex items-center gap-4">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your command (e.g. Sales, Udhaar, Query)..."
            className="w-full bg-slate-50 p-5 px-8 rounded-[1.5rem] border-2 border-slate-100 focus:border-indigo-600 focus:bg-white focus:ring-0 transition-all font-bold italic text-slate-900 shadow-inner group-hover:border-slate-200"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
            <kbd className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[8px] font-black shadow-sm">
              ENTER
            </kbd>
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-indigo-600 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale shadow-[6px_6px_0px_0px_rgba(79,70,229,0.2)] hover:shadow-none"
        >
          <Send size={24} className="hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};
