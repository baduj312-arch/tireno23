import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Paperclip, Send } from 'lucide-react';
import { mockMessages, mockProviders } from '../data/mock';

export default function Chat() {
  const navigate = useNavigate();
  useParams();
  const provider = mockProviders[0];
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "I'm 5 min away",
    "Send your location",
    "Payment ready",
    "Job complete?",
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'driver' as const,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setSending(true);

    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        sender: 'provider' as const,
        text: 'Got it 👍',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      setMessages(prev => [...prev, reply]);
      setSending(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-tireno-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-tireno-dark/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 -ml-1 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </motion.button>
          <div className="flex items-center gap-3 ml-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-tireno-orange/20">
                {provider.avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-tireno-green rounded-full border-2 border-tireno-dark" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{provider.name}</p>
              <p className="text-tireno-green text-xs">Online</p>
            </div>
          </div>
          <button className="ml-auto w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
            <Phone size={18} className="text-tireno-green" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-w-lg mx-auto w-full">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
              className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                msg.sender === 'driver'
                  ? 'bg-gradient-to-br from-tireno-orange to-tireno-orangeDark text-white rounded-br-md'
                  : 'bg-white/[0.03] text-white rounded-bl-md border border-white/[0.06]'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'driver' ? 'text-white/50' : 'text-white/30'
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/[0.03] px-4 py-3 rounded-2xl rounded-bl-md border border-white/[0.06]">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Replies */}
      <div className="max-w-lg mx-auto w-full px-4 pb-2 flex gap-2 overflow-x-auto">
        {quickReplies.map((qr) => (
          <button
            key={qr}
            onClick={() => handleSend(qr)}
            className="bg-white/[0.03] text-tireno-orange text-xs font-medium px-3 py-2 rounded-full border border-white/[0.06] whitespace-nowrap hover:bg-white/[0.06] transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="max-w-lg mx-auto w-full p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
            <Paperclip size={20} className="text-white/30" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Type a message..."
            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-3 text-white text-sm placeholder:text-white/20"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-tireno-orange to-tireno-orangeDark flex items-center justify-center disabled:opacity-50 shadow-lg shadow-tireno-orange/20"
          >
            <Send size={18} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
