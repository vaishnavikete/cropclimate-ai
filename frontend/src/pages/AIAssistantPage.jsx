import React, { useState } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Info,
  Compass,
  CornerDownLeft,
  Lightbulb
} from 'lucide-react';
import { sendAIChat } from '../services/api';

export default function AIAssistantPage({ currentAnalysis }) {
  const farmCtx = currentAnalysis?.farm_summary || {
    crop: 'Soybean',
    temperature_c: 38.0,
    soil_moisture_pct: 21.0,
    location: 'Baramati, Pune'
  };

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your CropClimate AI Farm Advisor. I am currently connected to your ${farmCtx.crop || 'farm'} field data in ${farmCtx.location || 'Pune'} (Temperature: ${farmCtx.temperature_c || 38}°C, Soil Moisture: ${farmCtx.soil_moisture_pct || 21}%). How can I assist you with irrigation, pest risks, or heat mitigation today?`,
      timestamp: 'Just now'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    "My soybean field has low soil moisture and tomorrow temperature is 40°C. What should I do?",
    "When is the most critical time to irrigate my crop?",
    "Should I apply urea/nitrogen fertilizer right now?",
    "Are weather conditions favorable for aphids or fungal diseases?"
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await sendAIChat(query, farmCtx);
      const botMsg = {
        sender: 'assistant',
        text: res.reply,
        suggested_actions: res.suggested_actions,
        disclaimer: res.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "I am temporarily experiencing network connectivity issues. Based on local agronomic guidelines, prioritize morning irrigation and suspend chemical application during midday heat.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Bot className="w-4 h-4" />
          <span>Conversational Agricultural Copilot</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
          AI Farm Advisor
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-3xl">
          Context-grounded agronomic assistant powered by your farm's real parameters. Ask questions regarding heatwave defense, irrigation scheduling, and IPM practices.
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col h-[620px] overflow-hidden">
        
        {/* Active Farm Context Top Bar */}
        <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Grounded In: <strong>{farmCtx.crop} ({farmCtx.location})</strong></span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-stone-400">
            <span>Temp: {farmCtx.temperature_c}°C</span>
            <span>Moisture: {farmCtx.soil_moisture_pct}%</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl rounded-2xl p-4 space-y-2 ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200/60'
                }`}>
                  <div className="flex items-center space-x-2 text-[10px] opacity-75">
                    {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    <span>{isUser ? 'You (Farmer)' : 'CropClimate AI Advisor'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* Render Suggested Actions if available */}
                  {msg.suggested_actions && (
                    <div className="pt-2 mt-2 border-t border-stone-200/60 text-xs">
                      <span className="font-bold text-stone-700 block mb-1">Key Steps:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                        {msg.suggested_actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.disclaimer && (
                    <p className="text-[10px] text-stone-400 italic pt-1">
                      {msg.disclaimer}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-stone-100 text-stone-500 rounded-2xl rounded-tl-none p-3 text-xs flex items-center space-x-2">
                <Bot className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing agronomic rules and farm conditions...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="text-[11px] font-bold text-stone-400 flex-shrink-0">Try Asking:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 rounded-full text-xs bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Text Input & Send */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about heat mitigation, irrigation timing, or pest control..."
              className="flex-1 text-xs sm:text-sm rounded-xl border border-stone-200 p-3 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
