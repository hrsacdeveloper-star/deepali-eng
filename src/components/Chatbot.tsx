import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/db/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am Deepali Assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const SUGGESTED_QUESTIONS = [
    "Tell me about Deepali",
    "What are your core products?",
    "Which industries do you serve?",
    "Where are you located?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp }]);
    setIsTyping(true);

    try {
      // Offline Search Algorithm via PostgreSQL RPC
      const { data, error } = await supabase.rpc('search_chatbot', { query_text: userMsg });
      
      if (error) throw error;

      const responseText = data || "Sorry, I couldn't find information related to your question.";
      simulateTyping(responseText);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      simulateTyping("*(Error connecting to knowledge base. Please try again later.)*");
    }
  };

  const simulateTyping = (fullText: string) => {
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);

    let i = 0;
    const speed = 10; // ms per character
    const interval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          ...updated[lastIdx],
          content: fullText.substring(0, i + 1)
        };
        return updated;
      });
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white border shadow-xl rounded-xl w-[320px] sm:w-[380px] h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-secondary text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded-full overflow-hidden w-8 h-8 flex items-center justify-center">
                <img 
                  src="https://miaoda-edit-image.s3cdn.medo.dev/d2lgq5dxewap/IMG-d2z4mbvpflkw.png" 
                  alt="Deepali Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Deepali Assistant</h3>
                <p className="text-xs text-white/70">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="flex flex-col max-w-[75%]">
                  <div 
                    className={`p-3 rounded-xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white border rounded-tl-none text-secondary shadow-sm'
                    }`}
                  >
                    <div className="prose prose-sm prose-p:leading-relaxed prose-pre:my-0 max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  <span className={`text-[10px] text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-secondary text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-white border rounded-xl rounded-tl-none shadow-sm flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-muted/50 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon"
              className="rounded-full shrink-0 w-10 h-10"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center relative"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};


