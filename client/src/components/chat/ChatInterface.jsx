import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import api from '../../services/api';
import toast from 'react-hot-toast';

const samplePrompts = [
  "I need wireless headphones under ₹3000 with good battery life",
  "Best gaming mouse with RGB under ₹3500",
  "Looking for a water bottle or flask for home under ₹1000",
  "Smartwatch with calling under ₹4000",
  "Running shoes and athletic jacket under ₹5000",
];

export default function ChatInterface({ onPipelineUpdate }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm PayPilot AI, your intelligent shopping assistant. Tell me what you're looking for, your budget, or specific preferences in plain English, and I'll find and compare the best products for you.",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    // 1. Append User Message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate / step through agent pipeline in real-time
    onPipelineUpdate?.({ step: 1, text: 'Understanding requirements & extracting budget...', isProcessing: true });

    try {
      setTimeout(() => {
        onPipelineUpdate?.({ step: 2, text: 'Scanning MongoDB product database...', isProcessing: true });
      }, 500);

      setTimeout(() => {
        onPipelineUpdate?.({ step: 3, text: 'Evaluating product specs, ratings & price envelope...', isProcessing: true });
      }, 1000);

      setTimeout(() => {
        onPipelineUpdate?.({ step: 4, text: 'Synthesizing recommendations & reasoning matrix...', isProcessing: true });
      }, 1500);

      const { data } = await api.post('/ai/chat', { query: textToSend });

      setTimeout(() => {
        onPipelineUpdate?.({ step: 5, text: 'Ready! Recommendations loaded. Items can be added to cart.', isProcessing: false });
      }, 2000);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.summary,
        data: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      toast.error('Failed to get AI recommendations');
      onPipelineUpdate?.({ step: 1, text: 'Error processing request', isProcessing: false });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I ran into an issue connecting to the AI engine. Please ensure the server is active or try rephrasing your request.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    handleSend(prompt);
  };

  return (
    <div className="glass-card flex flex-col h-[750px] overflow-hidden border-surface-800 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-surface-800 flex items-center justify-between bg-surface-950/40">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h2 className="font-display font-semibold text-white text-base">PayPilot Copilot</h2>
            <p className="text-xs text-surface-400">Contextual recommendation engine</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                sender: 'ai',
                text: "Chat refreshed! What would you like to search for next?",
                timestamp: 'Just now',
              },
            ]);
            onPipelineUpdate?.({ step: 0, text: 'Ready for new query', isProcessing: false });
          }}
          className="btn-ghost !p-2 text-xs flex items-center gap-1.5"
          title="Clear Chat"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-surface-400 text-xs py-2">
            <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <span>PayPilot AI is analyzing your request and matching catalog products...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts pill bar */}
      <div className="px-4 py-2 bg-surface-950/70 border-t border-surface-800/80 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-[11px] text-surface-500 flex items-center gap-1 shrink-0 font-medium">
          <Sparkles size={12} className="text-primary-400" /> Suggestions:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(p)}
            className="text-xs px-2.5 py-1 rounded-full bg-surface-800/80 hover:bg-primary-500/20 hover:text-primary-300 text-surface-300 border border-surface-700/60 transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-4 bg-surface-950/90 border-t border-surface-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I need noise cancelling headphones under ₹4000..."
            disabled={loading}
            className="input-field !py-3 !rounded-xl"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary !px-5 !py-3 !rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
