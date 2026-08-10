import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { saveUserProfile } from '../lib/firebaseService';

interface BillingCallbackHandlerProps {
  currentUser: UserProfile | null;
  onVerificationComplete: (updatedUser: UserProfile) => void;
}

export const BillingCallbackHandler: React.FC<BillingCallbackHandlerProps> = ({
  currentUser,
  onVerificationComplete,
}) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying account setup & activating trial...');
  const [activatedPlan, setActivatedPlan] = useState<string>('Growth');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');
    const urlUserId = params.get('userId');
    const urlPlanId = params.get('planId');

    const isCallbackPath = window.location.pathname.includes('/billing/callback');

    if (!reference && !isCallbackPath) return;

    let isMounted = true;

    const verifyTransaction = async () => {
      try {
        const refToUse = reference || `REF_${Date.now()}`;
        const targetUserId = currentUser?.id || urlUserId || '';
        const targetPlan = urlPlanId || 'Growth';

        const res = await fetch('/api/billing/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: refToUse,
            userId: targetUserId,
            planId: targetPlan,
            email: currentUser?.email,
          }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (data.success || data.status) {
          const profile: UserProfile = data.userProfile || {
            id: targetUserId || `usr_${Date.now()}`,
            email: currentUser?.email || 'store@owner.com',
            storeName: currentUser?.storeName || 'My E-Commerce Brand',
            planTier: (targetPlan as any) || 'Growth',
            subscriptionStatus: 'trialing',
            cardTokenized: true,
            createdAt: currentUser?.createdAt || new Date().toISOString(),
          };

          setActivatedPlan(profile.planTier);
          setStatus('success');
          setMessage(`Success! ${profile.planTier} Plan trial activated.`);

          // Save to Firestore and LocalStorage
          await saveUserProfile(profile);

          // Clean up URL search parameters without page refresh
          const cleanUrl = window.location.origin + window.location.pathname.replace('/billing/callback', '/');
          window.history.replaceState({}, document.title, cleanUrl);

          setTimeout(() => {
            if (isMounted) {
              onVerificationComplete(profile);
            }
          }, 1500);
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed. Please try again.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Billing verification callback error:', err);
        setStatus('error');
        setMessage(err.message || 'Error processing billing verification callback.');
      }
    };

    verifyTransaction();

    return () => {
      isMounted = false;
    };
  }, []);

  const params = new URLSearchParams(window.location.search);
  const reference = params.get('reference') || params.get('trxref');
  const isCallbackPath = window.location.pathname.includes('/billing/callback');

  if (!reference && !isCallbackPath) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-md text-slate-900 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Paystack Payment Verification
              </span>
              <h3 className="text-xl font-black text-slate-900">Activating ReviewLens Trial</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-Bit Encrypted Paystack Authorization</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-scaleIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Trial Unlocked
              </span>
              <h3 className="text-xl font-black text-slate-900">{activatedPlan} Plan Active!</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Your payment authorization was verified successfully. Redirecting you to your unlocked dashboard...
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-xs text-emerald-900 font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Full AI analysis features unlocked</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Verification Error</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
            </div>

            <button
              onClick={() => {
                const cleanUrl = window.location.origin + window.location.pathname.replace('/billing/callback', '/');
                window.location.href = cleanUrl;
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              Return to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
