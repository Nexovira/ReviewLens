import React, { useState } from 'react';
import { CreditCard, Check, Zap, Layers, ShieldCheck, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { UserProfile, PlanTier } from '../types';
import { getTierProductLimit, updatePlanTierInStorage } from '../lib/supabaseClient';
import { saveUserProfile } from '../lib/firebaseService';

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
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentTier = user?.planTier || 'Starter';
  const tierLimit = getTierProductLimit(currentTier);

  const plans = [
    {
      name: 'Starter' as PlanTier,
      priceNaira: '₦3,000',
      period: 'per month',
      productsLimit: '1 Product',
      desc: 'Ideal for solo sellers auditing 1 flagship product.',
      features: [
        '1 Active Product Analysis',
        'Weekly Automated Reports',
        'Sentiment & Star Distribution Breakdown',
        'AI Negative Review Reply Templates',
      ],
    },
    {
      name: 'Growth' as PlanTier,
      priceNaira: '₦8,000',
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
      ],
    },
    {
      name: 'Pro' as PlanTier,
      priceNaira: '₦15,000',
      period: 'per month',
      productsLimit: 'Unlimited Products',
      desc: 'For multi-brand operators, agencies & high-volume stores.',
      features: [
        'Unlimited Products & SKUs',
        'Full Competitor Matrix & Benchmarking',
        'REST API & Webhook Data Access',
        'Priority Gemini 3.6 Processing',
        'Dedicated E-commerce Account Manager',
      ],
    },
  ];

  const handlePaystackCheckout = (tier: PlanTier) => {
    setSelectedTier(tier);
    setIsPaystackOpen(true);
  };

  const handleCompletePaystackPayment = async () => {
    setIsProcessing(true);
    try {
      const updated = updatePlanTierInStorage(selectedTier);
      if (user) {
        const fullProfile = { ...user, planTier: selectedTier };
        await saveUserProfile(fullProfile);
        onUpdateUser(fullProfile);
      } else {
        onUpdateUser(updated);
      }
      setIsProcessing(false);
      setIsPaystackOpen(false);
      setPaymentSuccessMsg(`Success! Your subscription has been upgraded to ${selectedTier} Plan.`);
      setTimeout(() => setPaymentSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating plan:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 pb-12">
      {/* Header & Status */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Subscription & Paystack Billing</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store's ReviewLens subscription tier and Paystack payment methods.
          </p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="bg-[#0F172A] text-white rounded-xl p-4 flex items-center gap-6 shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Active Plan</span>
            <div className="text-lg font-black text-white flex items-center gap-1.5 mt-0.5">
              <Zap className="w-4 h-4 text-amber-400" />
              {currentTier} Plan
            </div>
          </div>
          <div className="border-l border-slate-700 pl-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Usage Meter</span>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {productCount} / {tierLimit === 999 ? 'Unlimited' : tierLimit} Products
            </div>
          </div>
        </div>
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
                onClick={() => handlePaystackCheckout(p.name)}
                disabled={isCurrent}
                className={`mt-6 w-full font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : p.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    : 'bg-[#0F172A] hover:bg-slate-800 text-white'
                }`}
              >
                <span>{isCurrent ? 'Current Plan' : `Pay ${p.priceNaira} via Paystack`}</span>
                {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Paystack Integration Gateway Simulation Modal */}
      {isPaystackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsPaystackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold text-lg"
            >
              &times;
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Paystack Payment Portal</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Upgrading to <strong className="text-slate-900">{selectedTier} Plan</strong> ({plans.find((p) => p.name === selectedTier)?.priceNaira}/month)
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs text-slate-700 font-medium mb-6">
              <div className="flex justify-between">
                <span>Account Email:</span>
                <strong className="text-slate-900">{user?.email}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Gateway:</span>
                <strong className="text-emerald-600">Paystack Nigeria (Naira ₦)</strong>
              </div>
              <div className="flex justify-between">
                <span>Supported Methods:</span>
                <span className="text-slate-500">Cards, Bank Transfer, USSD</span>
              </div>
            </div>

            <button
              onClick={handleCompletePaystackPayment}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Authorize ₦ Payment</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400 font-medium text-center mt-3">
              Secured by 256-bit SSL encryption via Paystack
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
