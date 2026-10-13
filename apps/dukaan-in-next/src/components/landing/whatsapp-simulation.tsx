'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCheck, MoreVertical, Phone, Video } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  time: string;
}

export function WhatsAppSimulation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const script = [
    { text: "Rahul 500 Chini", sender: 'user' as const, delay: 1000 },
    { text: "Noted! Logged ₹500 for Rahul under 'Chini'.", sender: 'ai' as const, delay: 1500 },
    { text: "Total udhaar for Rahul: ₹1,200.", sender: 'ai' as const, delay: 500 },
    { text: "Daily Sale: ₹4,500", sender: 'user' as const, delay: 2000 },
    { text: "Sales updated! Your EOD report is being generated. 📊", sender: 'ai' as const, delay: 1000 },
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    const runScript = () => {
      if (currentIndex < script.length) {
        const item = script[currentIndex];
        
        if (item.sender === 'ai') {
          setIsTyping(true);
          timeout = setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), text: item.text, sender: item.sender, time: "09:41" }]);
            currentIndex++;
            runScript();
          }, 1500);
        } else {
          timeout = setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: item.text, sender: item.sender, time: "09:41" }]);
            currentIndex++;
            runScript();
          }, item.delay);
        }
      } else {
        // Loop after a delay
        timeout = setTimeout(() => {
          setMessages([]);
          currentIndex = 0;
          runScript();
        }, 3000);
      }
    };

    runScript();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0b141a] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      {/* Header */}
      <div className="bg-[#202c33] p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-black">
            M
          </div>
          <div>
            <div className="font-bold text-sm">Munim AI</div>
            <div className="text-[10px] text-primary">online</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/60">
          <Video size={18} />
          <Phone size={18} />
          <MoreVertical size={18} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:400px]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] p-3 rounded-2xl relative
                ${msg.sender === 'user' ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'}
              `}>
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[9px] opacity-50">{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck size={12} className="text-[#53bdeb]" />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex justify-start"
          >
            <div className="bg-[#202c33] p-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="bg-[#202c33] p-3 flex items-center gap-3">
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-sm text-white/40">
          Type a message
        </div>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black">
          <Send size={18} />
        </div>
      </div>
    </div>
  );
}
