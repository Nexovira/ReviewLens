import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  GitCompare,
  History,
  CreditCard,
  Settings,
  Sparkles,
  Zap,
  BarChart2,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, PlanTier, isPlatformOwner } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  user: UserProfile | null;
  onOpenAddProduct: () => void;
  productCount: number;
  onOpenTour?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  user,
  onOpenAddProduct,
  productCount,
  onOpenTour,
}) => {
  const isCompetitorLocked = user?.planTier === 'Starter';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Report Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'competitor',
      label: 'Competitor Mode',
      icon: GitCompare,
      badge: isCompetitorLocked ? 'Growth' : 'Active',
    },
    {
      id: 'history',
      label: 'Reports History',
      icon: History,
      badge: null,
    },
    {
      id: 'billing',
      label: 'Billing & Plan',
      icon: CreditCard,
      badge: user?.planTier || 'Starter',
    },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800/80 flex flex-col justify-between shrink-0 text-slate-400 hidden md:flex">
      {/* Top Section */}
      <div className="p-5 space-y-6">
        {/* Logo Banner */}
        <div className="pb-2 border-b border-slate-800/80">
          <Logo size="sm" variant="full" />
        </div>

        {/* Quick Add Product Button */}
        <button
          onClick={onOpenAddProduct}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Analyze New Product</span>
        </button>

        {/* Navigation links */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-2 mb-3">
            Analytics & Reports
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  ) : (
                    <Icon className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      item.badge === 'Growth' || item.badge === 'Starter'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-blue-400 hover:text-white hover:bg-slate-800/50 transition-all border border-blue-500/20 bg-blue-500/5 mt-2"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Product Tour</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                Guide
              </span>
            </button>
          )}

          {/* Owner Admin Dashboard Option (Only visible to platform owner ummuunaysah) */}
          {isPlatformOwner(user) && (
            <div className="pt-3 mt-3 border-t border-slate-800/80">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-2 mb-2">
                Platform Controls
              </p>
              <button
                onClick={() => onSelectView('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'admin'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Owner Admin</span>
                </div>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Owner
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Upgrade card if on Starter */}
        {user?.planTier === 'Starter' && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-xs text-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Starter Plan</span>
              <span className="text-[10px] font-bold text-blue-400">1/1 Limit</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-blue-500 h-full w-full" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Analyze up to 5 products + side-by-side Competitor mode for ₦8,000/mo.
            </p>
            <button
              onClick={() => onSelectView('billing')}
              className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
            >
              Upgrade to Growth
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-1">
          <span className="text-[11px] font-medium text-slate-400">Store: <strong className="text-white">{user?.storeName || 'My Store'}</strong></span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Online" />
        </div>
      </div>
    </aside>
  );
};
