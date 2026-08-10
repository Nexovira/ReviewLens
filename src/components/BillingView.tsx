import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Layers, ShieldCheck, ArrowRight, ExternalLink, Sparkles, Clock, AlertTriangle, ShieldAlert, XCircle } from 'lucide-react';
import { UserProfile, PlanTier } from '../types';
import { getTierProductLimit, updatePlanTierInStorage } from '../lib/supabaseClient';
import { saveUserProfile } from '../lib/firebaseService';
import { subscribeToTierPrices, subscribeToSystemSettings, formatPriceNaira, DEFAULT_PRICES, DEFAULT_SETTINGS, TierPrices, SystemSettings } from '../lib/pricingService';
import { PaystackTrialModal } from './PaystackTrialModal';

interface BillingViewProps {
  user: UserProfile | null;
  productCount: number;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  user,
  productCount,
  onUpdateUser,
}) => {
  const [selectedTier, setSelectedTier] = useState<PlanTier>(user?.planTier || 'Growth');
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [tierPrices, setTierPrices] = useState<TierPrices>(DEFAULT_PRICES);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsub = subscribeToTierPrices((fetched) => {
      setTierPrices(fetched);
    });
    const unsubSettings = subscribeToSystemSettings((fetchedSettings) => {
      setSystemSettings(fetchedSettings);
    });
    return () => {
      unsub();
      unsubSettings();
    };
  }, []);

  const isUnsubscribed = !user?.planTier || user.planTier === 'None' || user.subscriptionStatus === 'unsubscribed';
  const currentTier = isUnsubscribed ? 'None' : user.planTier;
  const tierLimit = getTierProductLimit(currentTier);
  const subStatus = user?.subscriptionStatus || 'unsubscribed';

  const plans = [
    {
      name: 'Starter' as PlanTier,
      priceNaira: formatPriceNaira(tierPrices.Starter),
      rawPrice: tierPrices.Starter,
      period: 'per month',
      productsLimit: '1 Product',
      desc: 'Ideal for solo sellers auditing 1 flagship product.',
      features: [
        '1 Active Product Analysis',
        'Weekly Automated Reports',
        'Sentiment & Star Distribution Breakdown',
        'AI Negative Review Reply Templates',
        '3-Day Paid Trial Available',
      ],
    },
    {
      name: 'Growth' as PlanTier,
      priceNaira: formatPriceNaira(tierPrices.Growth),
      rawPrice: tierPrices.Growth,
      period: 'per month',
      productsLimit: '5 Products',
      popular: true,
      desc: 'Recommended for growing Shopify & Amazon store brands.',
      features: [
        '5 Active Product Analyses',
        'Side-by-Side Competitor Mode',
        'Weekly Auto-Reanalysis Engine',
        'Prioritized Improvement Action Plans',
        'Downloadable Printable PDF Reports',
        '3-Day Paid Trial Available',
      ],
    },
    {
      name: 'Pro' as PlanTier,
      priceNaira: formatPriceNaira(tierPrices.Pro),
      rawPrice: tierPrices.Pro,
      period: 'per month',
      productsLimit: 'Unlimited Products',
      desc: 'For multi-brand operators, agencies & high-volume stores.',
      features: [
        'Unlimited Products & SKUs',
        'Full Competitor Matrix & Benchmarking',
        'REST API & Webhook Data Access',
        'Priority Gemini 3.6 Processing',
        'Dedicated E-commerce Account Manager',
        '3-Day Paid Trial Available',
      ],
    },
  ];

  const handleOpenTrialModal = (tier: PlanTier) => {
    setSelectedTier(tier);
    setIsTrialModalOpen(true);
  };

  const handleTrialConfirmed = async (updatedUser: UserProfile) => {
    updatePlanTierInStorage(updatedUser.planTier);
    await saveUserProfile(updatedUser);
    onUpdateUser(updatedUser);
    setPaymentSuccessMsg(`Success! Your 7-day free trial for ${updatedUser.planTier} Plan is active.`);
    setTimeout(() => setPaymentSuccessMsg(''), 5000);
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? Your access will end when your trial or billing period expires.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch('/api/paystack/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      setIsCancelling(false);

      if (data.userProfile) {
        const fullProfile: UserProfile = { ...user, ...data.userProfile, cancelAtPeriodEnd: true };
        await saveUserProfile(fullProfile);
        onUpdateUser(fullProfile);
        setPaymentSuccessMsg('Your subscription has been set to cancel at the end of the current period.');
        setTimeout(() => setPaymentSuccessMsg(''), 5000);
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setIsCancelling(false);
    }
  };

  // Helper to format ISO date
  const formatDateStr = (iso?: string) => {
    if (!iso) return 'N/A';
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 pb-12">
      {/* Header & Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Subscription & Paystack Billing</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your ReviewLens 7-day free trial, plan billing, and Paystack authorization methods.
          </p>
        </div>

        {/* Status Badge Box */}
        <div className="bg-[#0F172A] text-white rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-md border border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 block">Current Plan & Status</span>
            <div className="text-base font-black text-white flex items-center gap-2 mt-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{isUnsubscribed ? 'No Active Plan' : `${currentTier} Plan`}</span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                subStatus === 'trialing' ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' :
                subStatus === 'active' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                isUnsubscribed ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                'bg-red-500/20 text-red-300 border-red-500/30'
              }`}>
                {subStatus === 'trialing' ? '7-Day Free Trial' : isUnsubscribed ? 'Unsubscribed' : subStatus}
              </span>
            </div>
          </div>

          <div className="border-l border-slate-700 pl-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">Next Charge / End</span>
            <div className="text-xs font-bold text-slate-200 mt-1">
              {user?.trialEndDate ? formatDateStr(user.trialEndDate) : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Requirement Details Panel */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0F172A] text-white rounded-2xl p-6 shadow-lg border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Paystack Subscription Control Center
          </h3>
          {subStatus === 'trialing' && (
            <span className="bg-amber-400 text-slate-900 font-black text-[10px] uppercase px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Trial Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Trial / Plan Status</span>
            <strong className="text-white text-sm capitalize">{subStatus}</strong>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Trial End Date</span>
            <strong className="text-white text-sm">{formatDateStr(user?.trialEndDate)}</strong>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Recurring Plan Price</span>
            <strong className="text-emerald-400 text-sm">{formatPriceNaira(tierPrices[currentTier])} / mo</strong>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">Payment Authorization</span>
            <strong className="text-slate-200 text-sm">{user?.paymentMethodMasked || 'Paystack Verified Method'}</strong>
          </div>
        </div>

        {subStatus === 'trialing' && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-amber-300/90 font-medium leading-relaxed">
              You are currently enjoying your 7-day free trial of <strong>{currentTier} Plan</strong> ($0 / ₦0 charged today). Starting on Day 8, your authorized payment method will be charged {formatPriceNaira(tierPrices[currentTier])} unless you cancel below.
            </p>
            <button
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{user?.cancelAtPeriodEnd ? 'Cancel Scheduled' : 'Cancel Subscription'}</span>
            </button>
          </div>
        )}
      </div>

      {paymentSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = currentTier === p.name;
          return (
            <div
              key={p.name}
              className={`bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all relative ${
                p.popular
                  ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] px-3 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">{p.name}</h3>
                  {isCurrent && (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-slate-500 mt-1">{p.desc}</p>

                <div className="mt-5 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">{p.priceNaira}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">{p.period}</span>
                </div>

                <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 inline-block">
                  ⚡ Includes {systemSettings.trialDurationDays}-Day Free Trial
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-medium">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 stroke-[3]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleOpenTrialModal(p.name)}
                className={`mt-6 w-full font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                    : p.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    : 'bg-[#0F172A] hover:bg-slate-800 text-white'
                }`}
              >
                <span>{isCurrent ? 'Manage / Restart Trial' : `Start ${systemSettings.trialDurationDays}-Day Trial (${p.priceNaira})`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Paystack Trial Modal */}
      <PaystackTrialModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        selectedPlan={selectedTier}
        planPrice={plans.find((p) => p.name === selectedTier)?.rawPrice || 8000}
        user={user}
        onTrialConfirmed={handleTrialConfirmed}
      />
    </div>
  );
};
