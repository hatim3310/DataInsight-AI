import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithData } from '../services/geminiService';

interface ChatInterfaceProps {
  csvSample: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ csvSample }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I have analyzed your dataset. Ask me any questions about trends, summaries, or specific data points.',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Keep track of history for the API
  const historyRef = useRef<{role: string, parts: {text: string}[]}[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatWithData(csvSample, input, historyRef.current);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I couldn't generate a response.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);

      // Update history
      historyRef.current.push(
        { role: 'user', parts: [{ text: userMessage.text }] },
        { role: 'model', parts: [{ text: botMessage.text }] }
      );

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error processing your request.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center bg-white">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
            <Sparkles className="w-5 h-5 text-gray-900" />
        </div>
        <div>
            <h3 className="font-bold text-gray-900">AI Analyst</h3>
            <p className="text-xs text-gray-400">Powered by Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gray-900 text-white rounded-br-none'
                  : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wider font-bold opacity-50">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                {msg.role === 'user' ? 'You' : 'AI'}
              </div>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center space-x-3">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              <span className="text-gray-500 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your data..."
            className="w-full bg-gray-50 text-gray-900 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-gray-200 border border-transparent transition-all placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-gray-900 text-white rounded-full hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;