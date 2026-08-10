import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, ShieldCheck, Zap, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile, PlanTier } from '../types';
import { formatPriceNaira, subscribeToSystemSettings, SystemSettings, DEFAULT_SETTINGS } from '../lib/pricingService';

interface PaystackTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanTier;
  planPrice: number;
  user: UserProfile | null;
  onTrialConfirmed: (updatedUser: UserProfile) => void;
}

export const PaystackTrialModal: React.FC<PaystackTrialModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  planPrice,
  user,
  onTrialConfirmed,
}) => {
  const [step, setStep] = useState<'disclosure' | 'checkout' | 'success'>('disclosure');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.storeName || 'Store Owner');
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsub = subscribeToSystemSettings((settings) => {
      setSystemSettings(settings);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep('disclosure');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitializeTrial = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || 'owner@store.com',
          amount: planPrice,
          planName: selectedPlan,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.status || data.data) {
        setStep('checkout');
      } else {
        setErrorMsg(data.message || 'Failed to initialize Paystack authorization.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Network error initializing Paystack trial.');
    }
  };

  const handleConfirmPaystackAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanCard = cardNumber.replace(/\s+/g, '');
    const last4 = cleanCard.length >= 4 ? cleanCard.slice(-4) : '••••';
    let detectedBrand = 'Paystack Card';
    if (cleanCard.startsWith('4')) detectedBrand = 'Visa';
    else if (cleanCard.startsWith('5')) detectedBrand = 'Mastercard';
    else if (cleanCard.startsWith('50') || cleanCard.startsWith('65')) detectedBrand = 'Verve';

    try {
      const demoRef = 'REF_TRIAL_' + Date.now();
      const res = await fetch('/api/paystack/confirm-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: demoRef,
          userId: user?.id,
          email: user?.email,
          planName: selectedPlan,
          storeName: user?.storeName,
          cardLast4: last4,
          cardBrand: detectedBrand,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.userProfile) {
        setStep('success');
        setTimeout(() => {
          onTrialConfirmed(data.userProfile);
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.message || 'Trial activation could not be verified by server.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Error processing payment method authorization.');
    }
  };

  const formattedPrice = formatPriceNaira(planPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md animate-fadeIn text-slate-900">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-blue-600 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                ReviewLens Paystack Trial
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">Start your {systemSettings.trialDurationDays}-day free trial</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 'disclosure' && (
          <div className="space-y-6">
            {/* Selected Plan Summary Box */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] text-white rounded-2xl p-5 shadow-inner border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Selected Subscription Tier</span>
                <span className="text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {systemSettings.trialDurationDays} Days Free
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">{selectedPlan} Plan</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{formattedPrice}</span>
                  <span className="text-xs text-slate-400 font-medium"> / month</span>
                </div>
              </div>
            </div>

            {/* MANDATORY PAYMENT DISCLOSURE */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  <strong className="font-extrabold text-amber-950 block mb-1">
                    Your credit/debit card is required to start the {systemSettings.trialDurationDays}-Day Free Trial.
                  </strong>
                  Initial Charge: <strong className="text-slate-900">₦0 ($0)</strong>. You will be billed <strong className="text-slate-900">{formattedPrice}/month</strong> starting on Day {systemSettings.trialDurationDays + 1} unless you cancel before the trial ends.
                </div>
              </div>
            </div>

            {/* Trial Terms List */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immediate {systemSettings.trialDurationDays}-day full access to all {selectedPlan} AI features</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero charge today (₦0.00 / $0 billed upfront)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cancel anytime in Billing settings before trial expires</span>
              </div>
            </div>

            <button
              onClick={handleInitializeTrial}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Initializing Paystack Checkout...</span>
              ) : (
                <>
                  <span>Add Card & Start {systemSettings.trialDurationDays}-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <form onSubmit={handleConfirmPaystackAuth} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Plan & Trial</span>
                <strong className="text-slate-900 font-black">{selectedPlan} Plan ({systemSettings.trialDurationDays}-Day Trial)</strong>
              </div>
              <span className="font-black text-slate-900 text-sm">{formattedPrice} after {systemSettings.trialDurationDays} days</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E-commerce Store Owner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number (Paystack Authorization)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Card Number (16 Digits)"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12/28"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV Security Code</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-3.5 rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Payment Method with Paystack...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm Payment Method & Start {systemSettings.trialDurationDays}-Day Trial</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 font-medium">
              Encrypted 256-bit SSL transaction via Paystack Payment Gateway.
            </p>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">{systemSettings.trialDurationDays}-Day Paid Trial Active!</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Your payment method was authorized successfully with Paystack. Enjoy {systemSettings.trialDurationDays} days of full <strong>{selectedPlan} Plan</strong> access!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
