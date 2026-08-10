import React from 'react';
import { Sparkles, BarChart3, User, LogOut, Layers, ShieldCheck, Zap, Compass } from 'lucide-react';
import { UserProfile, isPlatformOwner } from '../types';
import { getTierProductLimit } from '../lib/supabaseClient';
import { Logo } from './Logo';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  currentView: string;
  onSelectView: (view: string) => void;
  productCount: number;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  currentView,
  onSelectView,
  productCount,
  onOpenTour,
}) => {
  const isAppView = currentView !== 'landing';
  const tierLimit = user ? getTierProductLimit(user.planTier, user.email) : 1;
  const isOwner = isPlatformOwner(user);
  const isUnlimited = isOwner || user?.planTier === 'Pro';

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onSelectView('landing')}
          className="flex items-center text-left group focus:outline-none"
        >
          <Logo size="sm" variant="full" />
        </button>

        {/* Navigation items for landing vs app */}
        {!isAppView ? (
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing (₦)
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>
        ) : (
          <div className="hidden sm:flex items-center gap-3">
            {/* Usage Meter */}
            <div className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2.5 text-xs text-slate-300">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs">
                Products: <strong className="text-white font-bold">{productCount}</strong> /{' '}
                {tierLimit >= 999 ? 'Unlimited' : tierLimit}
              </span>
              <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: tierLimit >= 999 ? '100%' : `${Math.min(100, (productCount / tierLimit) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Plan Badge */}
            <button
              onClick={() => onSelectView('billing')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Zap className={`w-3.5 h-3.5 ${isUnlimited ? 'text-amber-400 fill-amber-400' : 'text-amber-400'}`} />
              <span>
                {isUnlimited
                  ? 'Pro / Unlimited'
                  : (!user?.planTier || user.planTier === 'None' || user.subscriptionStatus === 'unsubscribed')
                  ? 'No Active Plan'
                  : user.subscriptionStatus === 'trialing'
                  ? `${user.planTier} (7-Day Free Trial)`
                  : `${user.planTier} Plan`}
              </span>
            </button>

            {/* Tour Guide Button */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="bg-blue-900/50 hover:bg-blue-900/80 text-blue-300 border border-blue-700/50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Start Product Tour"
              >
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>Product Tour</span>
              </button>
            )}
          </div>
        )}

        {/* User Account / Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectView('dashboard')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[11px]">
                    {user.email.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate font-bold text-slate-200">
                    {user.storeName || user.email}
                  </span>
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <p className="font-bold text-white truncate">{user.storeName || 'Store Owner'}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => onSelectView('admin')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-slate-800 rounded-lg flex items-center gap-2 mt-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Owner Admin Control
                    </button>
                  )}
                  <button
                    onClick={() => onSelectView('billing')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    Subscription & Billing
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start Free Trial
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
