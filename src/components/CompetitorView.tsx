import React, { useState } from 'react';
import {
  GitCompare,
  Lock,
  Sparkles,
  Zap,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Product, UserProfile, CompetitorComparison } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface CompetitorViewProps {
  user: UserProfile | null;
  products: Product[];
  onSelectPlan: (tier: 'Growth') => void;
}

export const CompetitorView: React.FC<CompetitorViewProps> = ({ user, products, onSelectPlan }) => {
  const isLocked = user?.planTier === 'Starter';

  const [mainProductId, setMainProductId] = useState(products[0]?.id || '');
  const [competitorName, setCompetitorName] = useState('Bose QuietComfort 45');
  const [competitorReviews, setCompetitorReviews] = useState(
    'Bose QC45 reviews: Great active noise cancellation. Sound is clean but bass is somewhat flat. Price is high at $279.'
  );

  const [isLoading, setIsLoading] = useState(false);

  const [compData, setCompData] = useState<CompetitorComparison>({
    mainSentimentScore: products[0]?.latestAnalysis.overallSentimentScore || 86,
    competitorSentimentScore: 74,
    keyDiffSummary: `${products[0]?.name || 'Our Product'} outperforms Bose QuietComfort 45 significantly in price-to-value ratio (+22%), battery life endurance (+14 hours), and mic clarity on Zoom, while Bose holds a slight edge in soft ear cushion padding.`,
    mainAdvantages: [
      '35+ Hour battery life vs 24 hours on Bose QC45',
      '50% lower price point with comparable Active Noise Cancellation',
      'Higher customer satisfaction for microphone clarity on Zoom/Teams calls',
    ],
    competitorAdvantages: [
      'Slightly softer plush ear cushion headband padding out of the box',
      'Longer established brand reputation on Amazon global store',
    ],
    featureComparison: [
      { feature: 'Audio Quality', mainScore: 92, competitorScore: 88 },
      { feature: 'Price & Value', mainScore: 94, competitorScore: 62 },
      { feature: 'Battery Life', mainScore: 96, competitorScore: 78 },
      { feature: 'Mic Clarity', mainScore: 88, competitorScore: 74 },
      { feature: 'Comfort / Fit', mainScore: 76, competitorScore: 84 },
    ],
  });

  const mainProduct = products.find((p) => p.id === mainProductId) || products[0];

  const handleRunComparison = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainProductName: mainProduct?.name || 'Main Product',
          mainReviews: mainProduct?.rawReviewCorpus || '',
          competitorProductName: competitorName,
          competitorReviews: competitorReviews,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setCompData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm my-8 max-w-xl mx-auto text-slate-700">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <GitCompare className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-slate-900">No Products Available for Comparison</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-md mx-auto">
          Add your first product review report to start benchmarking against your key market competitors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 relative pb-12">
      {/* Paywall Overlay for Starter Users */}
      {isLocked && (
        <div className="absolute inset-0 z-30 bg-[#0F172A]/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-slate-700 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-2">
            Growth Plan Feature
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white max-w-lg">
            Unlock Side-by-Side Competitor Intelligence Mode
          </h2>
          <p className="text-xs text-slate-300 max-w-md mt-2 mb-6 leading-relaxed">
            Compare your product's customer sentiment, feature ratings, and advantage matrix against key market competitors.
          </p>
          <button
            onClick={() => onSelectPlan('Growth')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Upgrade to Growth (₦8,000/mo)</span>
          </button>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Side-by-Side Competitor Mode</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare product sentiment scores, feature strengths, and customer preference gaps against rivals.
          </p>
        </div>

        <button
          onClick={handleRunComparison}
          disabled={isLoading || isLocked}
          className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Re-evaluate Comparison</span>
        </button>
      </div>

      {/* Comparison Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Product Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <label className="block text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">
            Product A (Your Store Item)
          </label>
          <select
            value={mainProductId}
            onChange={(e) => setMainProductId(e.target.value)}
            disabled={isLocked}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Current Sentiment Score:</span>
            <span className="text-2xl font-black text-emerald-600">{compData.mainSentimentScore}%</span>
          </div>
        </div>

        {/* Competitor Product Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <label className="block text-[11px] font-bold text-rose-600 uppercase tracking-[0.2em] mb-2">
            Product B (Target Competitor)
          </label>
          <input
            type="text"
            value={competitorName}
            onChange={(e) => setCompetitorName(e.target.value)}
            disabled={isLocked}
            placeholder="e.g. Bose QC45 or Competitor Brand X"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none mb-3"
          />
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Competitor Sentiment Score:</span>
            <span className="text-2xl font-black text-rose-600">{compData.competitorSentimentScore}%</span>
          </div>
        </div>
      </div>

      {/* Summary diff card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
          Competitive Analysis Summary
        </h3>
        <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 italic">
          "{compData.keyDiffSummary}"
        </p>
      </div>

      {/* Feature Matrix Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-4">
          Feature Score Matrix
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compData.featureComparison} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <XAxis dataKey="feature" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="mainScore" name={mainProduct?.name || 'Our Product'} fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="competitorScore" name={competitorName} fill="#F43F5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advantage Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Our Advantages */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-emerald-600 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Where Your Product Wins
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-800">
            {compData.mainAdvantages.map((adv, idx) => (
              <li key={idx} className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span className="font-medium text-emerald-950">{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor Advantages */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-rose-600 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Where Competitor Has Edge
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-800">
            {compData.competitorAdvantages.map((adv, idx) => (
              <li key={idx} className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span className="font-medium text-rose-950">{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
