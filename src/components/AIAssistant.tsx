import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Sparkles, Wand2 } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'sos' | 'chat' | 'dashboard';
}

interface AIMessage {
  id: string;
  type: 'ai' | 'user';
  text: string;
  actions?: { label: string; action: string }[];
}

const aiResponses: Record<string, AIMessage> = {
  battery: {
    id: 'battery',
    type: 'ai',
    text: 'This sounds like a battery issue. I recommend requesting a **Battery Jump** service. A provider should arrive within 8-15 minutes in your area.',
    actions: [
      { label: 'Request Battery Jump', action: 'request_battery' },
      { label: 'Get more help', action: 'more_help' },
    ],
  },
  mechanic: {
    id: 'mechanic',
    type: 'ai',
    text: 'A flat tire or mechanical issue needs a **Mechanic**. Based on your location, there are 12 mechanics nearby. Average response: 10 minutes.',
    actions: [
      { label: 'Request Mechanic', action: 'request_mechanic' },
      { label: 'Compare providers', action: 'compare' },
    ],
  },
  fuel: {
    id: 'fuel',
    type: 'ai',
    text: 'Running out of fuel? Request **Fuel Delivery**. We have 5 fuel delivery providers in your area. ETA: 15-20 minutes.',
    actions: [
      { label: 'Request Fuel', action: 'request_fuel' },
      { label: 'Safety tips', action: 'safety_tips' },
    ],
  },
  tow: {
    id: 'tow',
    type: 'ai',
    text: 'For an accident, I recommend **Tow Truck** service. This is urgent. I will prioritize your request and notify nearby providers immediately.',
    actions: [
      { label: 'Request Tow Truck', action: 'request_tow' },
      { label: 'Contact emergency services', action: 'emergency' },
    ],
  },
  find_mechanic: {
    id: 'find_mechanic',
    type: 'ai',
    text: 'There are 12 verified mechanics within 5km of your location. Top rated: **Kwame Osei** (4.8 stars, 2.3km away).',
  },
  predict_eta: {
    id: 'predict_eta',
    type: 'ai',
    text: 'Based on traffic and provider availability, the predicted ETA for a mechanic in your area is **8-12 minutes**. Peak hours (7-9 AM, 5-7 PM) may add 5-10 minutes.',
  },
  safety_tips: {
    id: 'safety_tips',
    type: 'ai',
    text: '1. Turn on hazard lights immediately. 2. Stay in your vehicle if on a busy road. 3. Place warning triangles if available. 4. Share your live location with emergency contacts.',
    actions: [
      { label: 'Share location', action: 'share_location' },
      { label: 'Add emergency contact', action: 'add_contact' },
    ],
  },
  more_help: {
    id: 'more_help',
    type: 'ai',
    text: 'Describe your issue in more detail. For example: "My car makes a clicking sound when I turn the key" or "I have a flat tire on the rear left side."',
  },
  compare: {
    id: 'compare',
    type: 'ai',
    text: '**Top 3 Mechanics Nearby:**\n1. Kwame Osei - 4.8 stars, GH₵85, 2.3km\n2. Ama Mensah - 4.6 stars, GH₵92, 3.1km\n3. Yaw Addo - 4.9 stars, GH₵110, 4.0km',
  },
  request_battery: {
    id: 'req_battery',
    type: 'ai',
    text: 'I have pre-filled a Battery Jump request. Tap below to broadcast to nearby providers.',
  },
  request_mechanic: {
    id: 'req_mechanic',
    type: 'ai',
    text: 'I have pre-filled a Mechanic request. Tap below to broadcast to nearby providers.',
  },
  request_fuel: {
    id: 'req_fuel',
    type: 'ai',
    text: 'I have pre-filled a Fuel Delivery request. Tap below to broadcast to nearby providers.',
  },
  request_tow: {
    id: 'req_tow',
    type: 'ai',
    text: 'I have pre-filled a Tow Truck request. This will be marked as urgent. Tap below to broadcast.',
  },
  emergency: {
    id: 'emergency',
    type: 'ai',
    text: 'For emergencies, call Ghana National Ambulance: **193**. Your location has been prepared for sharing.',
  },
  share_location: {
    id: 'share_location',
    type: 'ai',
    text: 'Your location is being shared with your emergency contacts. 3 contacts are currently tracking your live position.',
  },
  add_contact: {
    id: 'add_contact',
    type: 'ai',
    text: 'You can add emergency contacts in your Profile > Safety Contacts section. This helps loved ones track your location during SOS events.',
  },
};

export default function AIAssistant({ isOpen, onClose, context = 'dashboard' }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      text: context === 'sos'
        ? 'Hi! I can help analyze your issue and suggest the best service type. Describe what happened and I will categorize it.'
        : context === 'chat'
        ? 'I can help draft a professional message to your provider or suggest next steps.'
        : 'Hi! I am your AI roadside assistant. I can help you find providers, predict wait times, or suggest safety tips.',
      actions: context === 'sos' ? [
        { label: 'Engine won\'t start', action: 'battery' },
        { label: 'Flat tire', action: 'mechanic' },
        { label: 'Out of fuel', action: 'fuel' },
        { label: 'Accident', action: 'tow' },
      ] : [
        { label: 'Find nearest mechanic', action: 'find_mechanic' },
        { label: 'Predict ETA', action: 'predict_eta' },
        { label: 'Safety tips', action: 'safety_tips' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleAction = (action: string) => {
    const response = aiResponses[action];
    if (response) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 800);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AIMessage = { id: Date.now().toString(), type: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const lower = input.toLowerCase();
    let action = 'more_help';
    if (lower.includes('battery') || lower.includes('start') || lower.includes('click')) action = 'battery';
    else if (lower.includes('tire') || lower.includes('flat') || lower.includes('wheel')) action = 'mechanic';
    else if (lower.includes('fuel') || lower.includes('gas') || lower.includes('petrol')) action = 'fuel';
    else if (lower.includes('accident') || lower.includes('crash') || lower.includes('tow')) action = 'tow';
    else if (lower.includes('eta') || lower.includes('time') || lower.includes('wait')) action = 'predict_eta';
    else if (lower.includes('safety') || lower.includes('safe') || lower.includes('help')) action = 'safety_tips';
    else if (lower.includes('find') || lower.includes('search')) action = 'find_mechanic';
    else if (lower.includes('compare') || lower.includes('best')) action = 'compare';

    setTimeout(() => {
      const response = aiResponses[action];
      if (response) {
        setMessages(prev => [...prev, response]);
      }
      setIsTyping(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end justify-center"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-tireno-dark rounded-t-3xl w-full max-w-lg h-[80vh] flex flex-col border-t border-white/[0.06]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Tireno AI</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-tireno-green animate-pulse" />
                    <span className="text-tireno-green text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.type === 'ai' ? 'flex gap-2' : ''}`}>
                    {msg.type === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles size={14} className="text-white" />
                      </div>
                    )}
                    <div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-br from-tireno-orange to-tireno-orangeDark text-white rounded-br-md'
                          : 'bg-white/[0.03] text-white rounded-bl-md border border-white/[0.06]'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      </div>
                      {msg.actions && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.actions.map((action) => (
                            <button
                              key={action.action}
                              onClick={() => handleAction(action.action)}
                              className="bg-white/[0.03] text-tireno-orange text-xs font-medium px-3 py-2 rounded-full border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="bg-white/[0.03] px-4 py-3 rounded-2xl rounded-bl-md border border-white/[0.06]">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-3 text-white text-sm placeholder:text-white/20"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center disabled:opacity-50"
                >
                  <Wand2 size={18} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
