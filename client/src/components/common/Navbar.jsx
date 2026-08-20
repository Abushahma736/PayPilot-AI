import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Menu, X, Bot, LogOut, LayoutDashboard, Package, MessageSquare, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/chat', label: 'AI Assistant', icon: MessageSquare },
        { path: '/products', label: 'Products', icon: ShoppingBag },
        { path: '/orders', label: 'Orders', icon: Package },
      ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center transition-transform group-hover:scale-110">
              <Bot size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Pay<span className="gradient-text">Pilot</span> AI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-primary-500/15 text-primary-300'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-all"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-surface-400">
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-900/95 backdrop-blur-xl border-t border-surface-800 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(path)
                    ? 'bg-primary-500/15 text-primary-300'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-surface-400 hover:text-white">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-primary-400">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
