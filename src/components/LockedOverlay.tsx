import React from 'react';
import { Lock, AlertOctagon, CreditCard, Zap, ShieldAlert, LogOut, ArrowRight, PhoneCall } from 'lucide-react';
import { UserProfile } from '../types';

interface LockedOverlayProps {
  user: UserProfile | null;
  onOpenBilling: () => void;
  onSignOut: () => void;
}

export const LockedOverlay: React.FC<LockedOverlayProps> = ({
  user,
  onOpenBilling,
  onSignOut,
}) => {
  const plan = user?.planTier && user.planTier !== 'None' ? user.planTier : 'No Plan Selected';
  const isUnsubscribed = !user?.planTier || user.planTier === 'None' || user.subscriptionStatus === 'unsubscribed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-md text-slate-900 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-10 shadow-2xl relative text-center">
        {/* Lock Icon */}
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-5 shadow-sm ${
          isUnsubscribed ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          <Lock className="w-8 h-8" />
        </div>

        {/* Lock Badge */}
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
          isUnsubscribed
            ? 'text-amber-800 bg-amber-100/80 border-amber-300'
            : 'text-red-700 bg-red-100/80 border-red-200'
        }`}>
          <ShieldAlert className="w-3.5 h-3.5" />
          {isUnsubscribed ? 'No Active Subscription' : 'Subscription Inactive & Account Locked'}
        </span>

        <h2 className="text-2xl font-black text-slate-900 mt-4 mb-2 tracking-tight">
          {isUnsubscribed ? 'Select a Plan to Access ReviewLens AI' : 'Your ReviewLens AI subscription is inactive'}
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed mb-6 max-w-md mx-auto">
          {isUnsubscribed ? (
            <>You do not have an active plan. Select a subscription tier below (<strong className="text-slate-900">Starter, Growth, or Pro</strong>) and authorize your 3-day trial to start analyzing reviews and competitor insights.</>
          ) : (
            <>Your <strong>3-day trial</strong> for the <strong className="text-slate-900">{plan}</strong> has ended and we couldn't process your payment. Your ReviewLens AI features are currently locked.</>
          )}
        </p>

        {/* Status Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
          <div className="flex justify-between items-center text-slate-700">
            <span className="font-bold">Account Email:</span>
            <span className="font-mono text-slate-900">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="font-bold">Current Plan:</span>
            <span className="font-black text-blue-600">{plan}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span className="font-bold">Status:</span>
            <span className={`font-black px-2 py-0.5 rounded border ${
              isUnsubscribed
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-red-600 bg-red-50 border-red-200'
            }`}>
              {isUnsubscribed ? 'Unsubscribed / No Active Plan' : 'Payment Failed / Locked'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onOpenBilling}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>{isUnsubscribed ? 'Select a Plan & Start 3-Day Trial' : 'Update Payment Method & Unlock Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenBilling}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all"
            >
              Choose a Plan
            </button>
            <button
              onClick={onSignOut}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-6">
          Need billing support? Contact support@reviewlens-store.com
        </p>
      </div>
    </div>
  );
};
