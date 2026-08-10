import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  LogOut,
  ArrowRight,
  HelpCircle,
  Clock,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';

interface LockedOverlayProps {
  user: UserProfile | null;
  onOpenBilling: () => void;
  onSignOut: () => void;
  onContinueFreeTier?: () => void;
}

export const LockedOverlay: React.FC<LockedOverlayProps> = ({
  user,
  onOpenBilling,
  onSignOut,
  onContinueFreeTier,
}) => {
  const plan = user?.planTier && user.planTier !== 'None' ? user.planTier : 'Starter';
  const isPaymentFailed = user?.subscriptionStatus === 'payment_failed' || user?.subscriptionStatus === 'locked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#030712]/90 backdrop-blur-xl text-slate-100 animate-fadeIn overflow-y-auto">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 md:p-8 shadow-2xl relative text-center my-auto overflow-hidden font-sans">
        
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badge - Softer & Frictionless Messaging */}
        <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3">
          <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>{isPaymentFailed ? 'Payment Update Required' : 'Your 7-Day Free Trial Has Ended'}</span>
        </div>

        {/* Main Headline */}
        <h2 className="relative z-10 text-lg sm:text-2xl font-black text-white tracking-tight mb-2">
          {isPaymentFailed
            ? 'Action Required: Update Payment Method'
            : 'Unlock Full Sentiment Intelligence'}
        </h2>

        {/* Subtitle */}
        <p className="relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 max-w-md mx-auto font-medium">
          {isPaymentFailed
            ? `We couldn't process your payment for the ${plan} plan. Please update your card details to restore instant access.`
            : 'Start your 7-Day Free Trial ($0 / ₦0 charged today) to unlock full competitor breakdowns, return drivers, and action plans.'}
        </p>

        {/* Value Recap Card */}
        <div className="relative z-10 bg-slate-900/90 border border-slate-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-left mb-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Pro Features Unlocked With 7-Day Trial
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md shrink-0">
              $0 Charged Today
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-200">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs">Unlimited Amazon & Shopify Product URL Analyses</span>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs">Prioritized Return Drivers & Severity Badges</span>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs">Competitor Weakness Exploits & Strategy Matrix</span>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs">AI Review Mining Engine Powered by Gemini 2.5 Flash</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Secure Tokenized Checkout
            </span>
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Dual Action Buttons */}
        <div className="relative z-10 space-y-2.5">
          {/* Primary Action Button */}
          <button
            onClick={onOpenBilling}
            className="w-full min-h-[48px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
            <span>
              {isPaymentFailed
                ? 'Update Payment Method & Restore Access'
                : 'Add Card & Start 7-Day Free Trial ✨'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          {/* Secondary Action (Low-Emphasis Link/Button) */}
          <button
            onClick={onContinueFreeTier || onOpenBilling}
            className="w-full min-h-[44px] bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Continue on Daily Free Tier (1 Analysis/Day)</span>
          </button>
        </div>

        {/* Account Info & Support */}
        <div className="relative z-10 mt-5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-slate-400">
          <span className="truncate max-w-[220px]">
            Logged in as: <strong className="text-slate-200 font-mono">{user?.email || 'User'}</strong>
          </span>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onSignOut}
              className="text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
            <a
              href="mailto:support@reviewlens-store.com"
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Support</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
