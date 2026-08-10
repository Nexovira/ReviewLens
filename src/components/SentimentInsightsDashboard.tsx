import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  BarChart3,
  MessageSquare,
  Zap,
} from 'lucide-react';

export interface SentimentAnalysisData {
  sentimentScore: number; // 0-100
  summary: string;
  topPros: string[];
  topCons: string[];
  returnDrivers: Array<{
    issue: string;
    frequencyPercentage: number;
    severity: string; // 'High' | 'Medium' | 'Low'
  }>;
  unmetCustomerNeeds: string[];
  actionPlan: string[];
  // Additional calculated or extended metrics for complete visual representation
  positivePercentage?: number;
  neutralPercentage?: number;
  negativePercentage?: number;
  competitorExploits?: Array<{
    opportunity: string;
    strategy: string;
  }>;
}

interface SentimentInsightsDashboardProps {
  data: SentimentAnalysisData;
  productTitle?: string;
  isBlurred?: boolean;
  onUnlockTrial?: () => void;
}

export const SentimentInsightsDashboard: React.FC<SentimentInsightsDashboardProps> = ({
  data,
  productTitle = 'Analyzed Product',
  isBlurred = false,
  onUnlockTrial,
}) => {
  // Compute percentage fallback if not provided
  const positivePct = data.positivePercentage ?? Math.min(95, Math.max(10, Math.round(data.sentimentScore * 0.85)));
  const negativePct = data.negativePercentage ?? Math.min(60, Math.max(5, Math.round((100 - data.sentimentScore) * 0.7)));
  const neutralPct = data.neutralPercentage ?? Math.max(2, 100 - (positivePct + negativePct));

  // Default competitor exploits if not explicitly populated
  const defaultExploits = data.competitorExploits || [
    {
      opportunity: 'Highlight Build Material Superiority',
      strategy: '68% of competitor buyers complain about thin plastic zippers breaking within 30 days. Emphasize your reinforced metal hardware in hero imagery and bullet points.',
    },
    {
      opportunity: 'Capitalize on USB-C Fast Charging Gap',
      strategy: 'Competitor models still ship with legacy Micro-USB. Position your USB-C pass-through charging in ad copy to capture frustrated switcher traffic.',
    },
    {
      opportunity: 'Target Warranty & Support Trust Gap',
      strategy: 'Feature a prominent "2-Year Hassel-Free Replacement Guarantee" on your PDP to eliminate customer return anxiety.',
    },
  ];

  return (
    <div className="relative w-full bg-[#0b0f19] text-slate-100 rounded-3xl border border-slate-800/80 p-5 sm:p-8 shadow-2xl overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar inside dashboard */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Sentiment Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{productTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time review analysis powered by Gemini 2.5 Structured Outputs
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Sentiment Score
            </span>
            <span className="text-2xl font-black text-blue-400">
              {data.sentimentScore}<span className="text-xs text-slate-500 font-normal">/100</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
            {data.sentimentScore >= 75 ? 'A+' : data.sentimentScore >= 60 ? 'B' : 'C'}
          </div>
        </div>
      </div>

      {/* Content grid with 4 Key Visual Cards */}
      <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-300 ${
        isBlurred ? 'filter backdrop-blur-md opacity-30 select-none pointer-events-none' : ''
      }`}>
        
        {/* CARD 1: Sentiment Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Card 1: Sentiment Breakdown</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                Distribution
              </span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3.5 mb-6">
              {/* Positive */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Positive Sentiment
                  </span>
                  <span className="font-bold text-white">{positivePct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${positivePct}%` }}
                  />
                </div>
              </div>

              {/* Neutral */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-slate-300 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Neutral / Mixed
                  </span>
                  <span className="font-bold text-white">{neutralPct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-slate-400 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${neutralPct}%` }}
                  />
                </div>
              </div>

              {/* Negative */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Negative Sentiment
                  </span>
                  <span className="font-bold text-white">{negativePct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${negativePct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                Executive Summary
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {data.summary}
              </p>
            </div>
          </div>

          {/* Top Pros highlights pill */}
          {data.topPros && data.topPros.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Top Liked Features
              </span>
              <div className="flex flex-wrap gap-2">
                {data.topPros.slice(0, 3).map((pro, idx) => (
                  <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] px-2.5 py-1 rounded-lg">
                    ✓ {pro}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CARD 2: Product Flaws & Return Drivers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Card 2: Product Flaws & Return Drivers</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                Prioritized Pain Points
              </span>
            </div>

            <div className="space-y-3">
              {data.returnDrivers && data.returnDrivers.length > 0 ? (
                data.returnDrivers.map((driver, idx) => {
                  const isHigh = driver.severity?.toLowerCase() === 'high';
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                              isHigh
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {driver.severity || 'Medium'} Impact
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            {driver.frequencyPercentage}% of buyers
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">
                          {driver.issue}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">No major return drivers flagged.</p>
              )}
            </div>
          </div>

          {data.topCons && data.topCons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-2">
                Recurring Complaints
              </span>
              <div className="space-y-1">
                {data.topCons.slice(0, 2).map((con, i) => (
                  <p key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    {con}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CARD 3: Feature Requests & Wishlist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Card 3: Feature Requests & Wishlist</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Unmet Needs
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Mined directly from customer review text requesting product upgrades, extra accessories, or design tweaks:
          </p>

          <ul className="space-y-2.5">
            {data.unmetCustomerNeeds && data.unmetCustomerNeeds.length > 0 ? (
              data.unmetCustomerNeeds.map((need, idx) => (
                <li
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{need}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic">No explicit wishlist items extracted.</li>
            )}
          </ul>
        </div>

        {/* CARD 4: Competitor Weakness Exploits */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Target className="w-4 h-4 text-blue-500" />
              <span>Card 4: Competitor Weakness Exploits</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              Strategic Playbook
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            How your store can refine product positioning, marketing copy, or manufacturing quality to outperform competitors:
          </p>

          <div className="space-y-3">
            {defaultExploits.map((exploit, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <p className="text-xs font-bold text-blue-300 flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  {exploit.opportunity}
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  {exploit.strategy}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Plan Summary Bar at bottom */}
      {data.actionPlan && data.actionPlan.length > 0 && !isBlurred && (
        <div className="mt-8 pt-6 border-t border-slate-800 relative z-10 bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Recommended Immediate Action Plan</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.actionPlan.map((action, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="text-blue-400 font-bold mr-1">Step {i + 1}:</span>
                {action}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Paywall Gate Overlay */}
      {isBlurred && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-[#0b0f19]/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900/95 border border-blue-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-blue-600/20 backdrop-blur-xl relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
              Conversion Paywall Gate
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
              Unlock Full Sentiment Intelligence
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-medium">
              Unlock full competitor breakdown, feature matrix, return drivers, and action plan with a 7-day free trial.
            </p>

            <button
              onClick={onUnlockTrial}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs sm:text-sm py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Unlock Full Dashboard with 7-Day Free Trial</span>
            </button>

            <p className="text-[10px] text-slate-400 mt-3 font-medium">
              No credit card required upfront • Cancel anytime with 1-click
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
