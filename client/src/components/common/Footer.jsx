import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-800/50 bg-surface-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="font-display font-semibold text-sm text-surface-400">
              PayPilot AI
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-surface-500">
            <Link to="/" className="hover:text-surface-300 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-surface-300 transition-colors">Products</Link>
            <Link to="/chat" className="hover:text-surface-300 transition-colors">AI Assistant</Link>
          </div>
          <p className="text-xs text-surface-600">
            Built for Razorpay AI Builder Internship 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
