import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveChatMessage, getChatHistory, clearChatHistory } from '../services/supabaseService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are GlobeBot, an enthusiastic and knowledgeable AI travel assistant for GlobeTrotter. Your personality traits:

- **Warm & Friendly**: You're excited to help travelers plan their perfect trips
- **Expert Knowledge**: You have extensive knowledge about destinations worldwide - cultures, cuisines, attractions, hidden gems, best times to visit, costs, safety tips
- **Practical**: You give actionable advice with specific recommendations (restaurants, hotels, activities)
- **Budget-Conscious**: You consider different budget levels and always offer options
- **Cultural Sensitivity**: You respect local customs and encourage responsible tourism

When helping users:
1. Ask clarifying questions about their preferences (budget, travel style, interests, dates)
2. Suggest specific destinations with reasons why they'd be a good fit
3. Recommend itineraries with day-by-day activities when asked
4. Share insider tips and local experiences
5. Warn about common tourist traps or safety concerns
6. Consider weather/seasons in your recommendations

Keep responses concise but informative. Use emojis sparingly to add warmth. If users ask about creating a trip, guide them to use the GlobeTrotter app features.

Remember: You're passionate about travel and want to help everyone have amazing adventures! 🌍`;

const TravelChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    const { messages: history } = await getChatHistory();
    if (history.length > 0) {
      setMessages(history.map((m: any) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })));
    }
    setIsLoadingHistory(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message to Supabase
    await saveChatMessage('user', userMessage.content);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Check if API key exists
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        throw new Error('API key not configured');
      }
      
      // Call Groq API with timeout
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })), // Limit context
            { role: 'user', content: userMessage.content },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message to Supabase (non-blocking)
      saveChatMessage('assistant', assistantContent).catch(console.error);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Chat error:', error);
      
      let errorContent = "I'm having trouble connecting right now. Please try again in a moment! 🌐";
      
      if (error.name === 'AbortError') {
        errorContent = "The request took too long. Please try a shorter question! ⏱️";
      } else if (error.message?.includes('API key')) {
        errorContent = "I'm not fully configured yet. Please check back later! 🔧";
      } else if (error.message?.includes('rate limit')) {
        errorContent = "I'm getting too many requests. Please wait a moment and try again! 🚦";
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = async () => {
    if (confirm('Clear all chat history?')) {
      await clearChatHistory();
      setMessages([]);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-white/20 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-[190] w-[400px] h-[600px] max-h-[70vh] glass border border-white/20 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">GlobeBot</h3>
                  <p className="text-xs text-white/50">Your AI Travel Guide</p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="p-2 text-white/40 hover:text-white/70 hover:bg-white/10 rounded-lg transition-all"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white/60" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Welcome to GlobeBot!</h4>
                  <p className="text-sm text-white/50 mb-6">
                    I'm here to help you discover amazing destinations and plan your perfect trip. Ask me anything!
                  </p>
                  <div className="space-y-2 w-full">
                    {[
                      "What's the best time to visit Japan?",
                      "Suggest a 7-day Europe itinerary",
                      "Budget-friendly beach destinations",
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="w-full text-left text-sm p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/70"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index === messages.length - 1 ? 0.1 : 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-white text-black rounded-br-md'
                          : 'bg-white/10 text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-white/70">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about destinations, tips, itineraries..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-white/30 text-center mt-2">
                Powered by Groq AI • GlobeTrotter
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelChatbot;
