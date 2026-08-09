import React, { useState } from 'react';
import { X, Mail, Lock, Store, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { UserProfile, PlanTier } from '../types';
import { SAMPLE_USER } from '../data/sampleData';
import { setStoredUser } from '../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  defaultPlan?: PlanTier;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, defaultPlan = 'Growth' }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('storeowner@lumina-commerce.com');
  const [password, setPassword] = useState('••••••••••••');
  const [storeName, setStoreName] = useState('Lumina Store');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(defaultPlan);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email: email || 'storeowner@lumina-commerce.com',
        storeName: storeName || 'E-commerce Brand',
        planTier: selectedPlan,
        createdAt: new Date().toISOString(),
      };
      setStoredUser(user);
      onSuccess(user);
      onClose();
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStoredUser(SAMPLE_USER);
      onSuccess(SAMPLE_USER);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {isLogin ? 'Sign In to ReviewLens' : 'Create Store Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isLogin
              ? 'Access your product review analytics and AI action plans.'
              : 'Start analyzing customer reviews in minutes.'}
          </p>
        </div>

        {/* Quick Demo Login Option */}
        <div className="mb-6 bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-blue-900">Instant Demo Mode</p>
            <p className="text-[11px] text-blue-700 font-medium">Preloaded with sample product reports</p>
          </div>
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
          >
            Instant Login
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex py-1 items-center mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">
            Or with Email
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                Store or Brand Name
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Lumina Essentials"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="storeowner@domain.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                Select Subscription Plan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Starter', 'Growth', 'Pro'] as PlanTier[]).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedPlan(tier)}
                    className={`py-2 px-2 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      selectedPlan === tier
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-extrabold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-extrabold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
