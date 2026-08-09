import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Check,
  Zap,
  Star,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  FileText,
  CreditCard,
  Users,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { PlanTier } from '../types';
import { subscribeToTierPrices, formatPriceNaira, DEFAULT_PRICES, TierPrices } from '../lib/pricingService';

interface LandingPageProps {
  onStartDemo: () => void;
  onSelectPlan: (tier: PlanTier) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo, onSelectPlan }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activePreviewTab, setActivePreviewTab] = useState<'sentiment' | 'features' | 'actionPlan'>('sentiment');
  const [tierPrices, setTierPrices] = useState<TierPrices>(DEFAULT_PRICES);

  useEffect(() => {
    const unsub = subscribeToTierPrices((fetched) => {
      setTierPrices(fetched);
    });
    return () => unsub();
  }, []);

  const faqs = [
    {
      q: 'How does ReviewLens pull review data from Amazon or Shopify?',
      a: 'You can simply paste a batch of reviews or provide your Shopify product URL / Amazon ASIN. ReviewLens handles up to 50,000 characters at once and automatically categorizes every sentiment, feature mention, and competitor reference.',
    },
    {
      q: 'How accurate is the AI sentiment analysis and feature extraction?',
      a: 'ReviewLens uses Google Gemini 3.6 Flash fine-tuned for e-commerce semantics. It recognizes nuanced customer language, sarcasm, typos, and specific domain terms like "ANC", "sizing runs small", or "stitching quality".',
    },
    {
      q: 'Can I pay in Nigerian Naira (₦) via local payment methods?',
      a: 'Yes! All plans are priced directly in Nigerian Naira (₦) with instant Paystack payment integration supporting cards, bank transfers, USSD, and Apple Pay.',
    },
    {
      q: 'What is the difference between Starter and Growth plans?',
      a: 'Starter (₦3,000/mo) includes 1 active product and weekly automated reports. Growth (₦8,000/mo) allows 5 products, automated weekly re-analysis, plus our powerful side-by-side Competitor Analysis Mode.',
    },
    {
      q: 'Can I generate automated response replies for 1-star and 2-star reviews?',
      a: 'Absolutely! ReviewLens drafts 3 custom-tailored, empathetic response templates for your worst reviews addressing the customer\'s specific grievances with copy-to-clipboard ease.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* SEO & Meta tags header simulation */}
      <title>ReviewLens - AI E-commerce Review Analytics & Sentiment Intelligence</title>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#0F172A] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Built for Amazon & Shopify Store Owners</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Know what your customers really think —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200">
              in seconds.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Turn thousands of messy Amazon & Shopify customer reviews into structured sentiment scores, feature breakdowns, competitor insights, and prioritized action plans.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartDemo}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 text-blue-100" />
              <span>Launch Live Interactive App</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <a
              href="#pricing"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Pricing (₦3,000/mo)</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-bold uppercase tracking-[0.15em]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Review Parsing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Paystack ₦ Payments
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Weekly Re-analysis
            </span>
          </div>

          {/* Interactive Live Sample Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-left text-slate-900">
            {/* Header bar of sample preview */}
            <div className="bg-[#0F172A] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-bold text-slate-200 ml-2">
                  Aura Sound Pro Wireless Headphones — Analysis Snapshot
                </span>
              </div>
              
              <div className="flex gap-1.5 bg-slate-800 p-1 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setActivePreviewTab('sentiment')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activePreviewTab === 'sentiment'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sentiment & Rating
                </button>
                <button
                  onClick={() => setActivePreviewTab('features')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activePreviewTab === 'features'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Feature Mentions
                </button>
                <button
                  onClick={() => setActivePreviewTab('actionPlan')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activePreviewTab === 'actionPlan'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Action Plan
                </button>
              </div>
            </div>

            {/* Preview Tab Body */}
            <div className="p-6 bg-slate-50 text-slate-900">
              {activePreviewTab === 'sentiment' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Score card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Overall Sentiment Score</p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-5xl font-black text-emerald-600">86%</span>
                      </div>
                      <span className="inline-block mt-2 text-xs font-extrabold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Very Positive Customer Sentiment
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-medium text-slate-500 leading-relaxed">
                      Based on 184 customer reviews parsed from Amazon & Shopify.
                    </p>
                  </div>

                  {/* Rating distribution bar preview */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 col-span-2 shadow-sm">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3">Rating Breakdown</p>
                    <div className="space-y-2 text-xs">
                      {[
                        { stars: '5 Star', pct: 64, color: 'bg-emerald-500' },
                        { stars: '4 Star', pct: 20, color: 'bg-emerald-400' },
                        { stars: '3 Star', pct: 8, color: 'bg-amber-400' },
                        { stars: '2 Star', pct: 5, color: 'bg-orange-400' },
                        { stars: '1 Star', pct: 3, color: 'bg-rose-500' },
                      ].map((item) => (
                        <div key={item.stars} className="flex items-center gap-3">
                          <span className="w-12 text-slate-700 font-bold">{item.stars}</span>
                          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                          </div>
                          <span className="w-10 text-right font-black text-slate-900">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'features' && (
                <div className="space-y-3">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Top Feature Mentions & Sentiment Split</p>
                  {[
                    { feature: 'Audio & ANC Quality', pos: 94, neg: 6, count: 142 },
                    { feature: 'Price & Value', pos: 91, neg: 9, count: 98 },
                    { feature: 'Shipping & Speed', pos: 90, neg: 10, count: 54 },
                    { feature: 'Headband Comfort & Fit', pos: 72, neg: 28, count: 68 },
                  ].map((feat) => (
                    <div key={feat.feature} className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                      <div className="min-w-[180px]">
                        <span className="font-extrabold text-slate-900">{feat.feature}</span>
                        <span className="text-[11px] text-slate-400 font-semibold ml-2">({feat.count} mentions)</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-500 h-full" style={{ width: `${feat.pos}%` }} />
                          <div className="bg-rose-500 h-full" style={{ width: `${feat.neg}%` }} />
                        </div>
                        <span className="text-emerald-700 font-bold">{feat.pos}% positive</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activePreviewTab === 'actionPlan' && (
                <div className="space-y-3">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Prioritized Improvement Action Plan</p>
                  {[
                    { priority: 'High', title: 'Upgrade Headband Memory Foam Density', desc: 'Eliminates long-wear pressure complaints for larger head sizes.', impact: '-30% returns' },
                    { priority: 'Medium', title: 'Include Quick-Start Pairing QR Card', desc: 'Provides video walkthrough for multi-device Bluetooth setup.', impact: '-25% setup tickets' },
                  ].map((act) => (
                    <div key={act.title} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${act.priority === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {act.priority}
                      </span>
                      <div>
                        <p className="text-xs font-black text-slate-900">{act.title}</p>
                        <p className="text-xs text-slate-600 font-medium mt-1">{act.desc}</p>
                        <span className="inline-block mt-2 text-[11px] font-bold text-blue-600">
                          Estimated Impact: {act.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">How ReviewLens Works</h2>
            <p className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              From raw feedback to revenue strategy in 3 easy steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 relative shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg mb-6 shadow-sm">
                1
              </div>
              <h3 className="text-xl font-black text-slate-900">Paste or Sync Reviews</h3>
              <p className="mt-3 text-slate-600 text-xs font-medium leading-relaxed">
                Copy and paste up to 50,000 characters of reviews from Amazon, Shopify, AliExpress, or CSV files. No technical integration needed.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 relative shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg mb-6 shadow-sm">
                2
              </div>
              <h3 className="text-xl font-black text-slate-900">Gemini AI Analysis</h3>
              <p className="mt-3 text-slate-600 text-xs font-medium leading-relaxed">
                ReviewLens processes the corpus to extract exact sentiment metrics, feature complaint percentages, competitor comparisons, and customer quotes.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 relative shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg mb-6 shadow-sm">
                3
              </div>
              <h3 className="text-xl font-black text-slate-900">Execute Action Plan</h3>
              <p className="mt-3 text-slate-600 text-xs font-medium leading-relaxed">
                Get a ranked 3-step action plan to fix product defects, reduce returns, and copy AI reply templates to resolve negative reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (In Nigerian Naira ₦) */}
      <section id="pricing" className="py-24 relative bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Flexible Subscriptions</span>
            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              Simple, transparent pricing for e-commerce stores
            </h2>
            <p className="mt-3 text-slate-600 text-xs font-medium">
              Pay securely in Nigerian Naira (₦) via Paystack. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-black text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Perfect for solo store owners testing 1 key product.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-slate-900">{formatPriceNaira(tierPrices.Starter)}</span>
                  <span className="text-slate-500 font-bold text-xs ml-2">/ month</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> 1 Active Product Analysis
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Weekly Automated Reports
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Sentiment & Rating Breakdown
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> AI Review Reply Templates
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan('Starter')}
                className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold py-3 rounded-xl text-xs transition-colors border border-slate-200"
              >
                Choose Starter
              </button>
            </div>

            {/* Growth Plan (Popular) */}
            <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 flex flex-col justify-between relative shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Growth</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Designed for growing e-commerce brands with multiple SKUs.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-slate-900">{formatPriceNaira(tierPrices.Growth)}</span>
                  <span className="text-slate-500 font-bold text-xs ml-2">/ month</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> 5 Active Products
                  </li>
                  <li className="flex items-center gap-2.5 font-extrabold text-blue-700">
                    <Check className="w-4 h-4 text-emerald-600" /> Side-by-Side Competitor Mode
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Weekly Auto-Re-analysis
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Prioritized Improvement Action Plans
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Downloadable PDF Reports
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan('Growth')}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/30"
              >
                Choose Growth
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-black text-slate-900">Pro</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">For agencies, high-volume sellers, and multi-brand operators.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-slate-900">{formatPriceNaira(tierPrices.Pro)}</span>
                  <span className="text-slate-500 font-bold text-xs ml-2">/ month</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Unlimited Products & SKUs
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Full Competitor Analysis Matrix
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> REST API & Webhook Access
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Priority Gemini Processing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Dedicated Account Manager
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onSelectPlan('Pro')}
                className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold py-3 rounded-xl text-xs transition-colors border border-slate-200"
              >
                Choose Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-xs font-medium mt-2">Everything you need to know about ReviewLens</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-extrabold text-sm text-slate-900 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0F172A] border-t border-slate-800 text-slate-400 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="font-extrabold text-white">ReviewLens</span>
            <span className="text-slate-400">&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <p className="text-slate-400 font-medium">
            Powered by Google Gemini AI Engine & Paystack Payments
          </p>
        </div>
      </footer>
    </div>
  );
};
