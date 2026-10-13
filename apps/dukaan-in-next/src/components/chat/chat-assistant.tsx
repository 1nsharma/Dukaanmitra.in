"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, MessageCircle, Send, User, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { uiEmitter } from "@/lib/ui-event-emitter";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => {
    setIsOpen(false);
    uiEmitter.emit('close-chat');
  };

  useEffect(() => {
    uiEmitter.on('open-chat', openChat);
    return () => {
      uiEmitter.off('open-chat', openChat);
    };
  }, []);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/interactive-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error('Interactive demo request failed');
      }

      const result = await response.json() as { response: string };
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={() => (isOpen ? closeChat() : openChat())}
          aria-label="Toggle chat assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm">
          <Card className="flex flex-col h-[60vh] shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Bot className="text-primary" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="p-2 bg-muted rounded-full">
                      <Bot className="w-5 h-5" />
                    </div>
                    <p className="bg-muted text-muted-foreground p-3 rounded-lg max-w-[80%]">
                      Hello! I'm the DukaanMitra AI assistant. How can I help you demo our product today?
                    </p>
                  </div>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-3 text-sm",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="p-2 bg-muted rounded-full">
                          <Bot className="w-5 h-5" />
                        </div>
                      )}
                      <p
                        className={cn(
                          "p-3 rounded-lg max-w-[80%]",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {message.content}
                      </p>
                      {message.role === "user" && (
                        <div className="p-2 bg-primary text-primary-foreground rounded-full">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3 text-sm">
                      <div className="p-2 bg-muted rounded-full">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="bg-muted text-muted-foreground p-3 rounded-lg flex items-center gap-2">
                         <Loader2 className="w-4 h-4 animate-spin"/>
                         <span>Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about features..."
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
