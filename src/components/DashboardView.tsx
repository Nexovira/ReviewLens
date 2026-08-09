import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Printer,
  Copy,
  Check,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Star,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Zap,
  Trash2,
} from 'lucide-react';
import { Product, AnalysisResult, ActionItem } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface DashboardViewProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onOpenAddProduct: () => void;
  onReAnalyze: (product: Product) => void;
  onOpenPrintView: () => void;
  onDeleteProduct?: (productId: string) => void;
  isAnalyzing: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onOpenAddProduct,
  onReAnalyze,
  onOpenPrintView,
  onDeleteProduct,
  isAnalyzing,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedStrength, setExpandedStrength] = useState<string | null>(null);
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);
  const [actionPlanState, setActionPlanState] = useState<ActionItem[]>(
    selectedProduct?.latestAnalysis.actionPlan || []
  );

  // Synchronize action plan if product changes
  React.useEffect(() => {
    if (selectedProduct) {
      setActionPlanState(selectedProduct.latestAnalysis.actionPlan);
    }
  }, [selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm my-8 max-w-xl mx-auto text-slate-700">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-slate-900">No Products Analyzed Yet</h3>
        <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed max-w-md mx-auto">
          Upload your first customer reviews to discover what your customers really think and generate actionable AI insights.
        </p>
        <button
          onClick={onOpenAddProduct}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add First Product
        </button>
      </div>
    );
  }

  const analysis: AnalysisResult = selectedProduct.latestAnalysis;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleActionItem = (index: number) => {
    const updated = [...actionPlanState];
    updated[index] = { ...updated[index], completed: !updated[index].completed };
    setActionPlanState(updated);
  };

  // Star distribution data for Donut Chart
  const starData = [
    { name: '5 Star', value: analysis.ratingDistribution.star5, color: '#10B981' },
    { name: '4 Star', value: analysis.ratingDistribution.star4, color: '#34D399' },
    { name: '3 Star', value: analysis.ratingDistribution.star3, color: '#FBBF24' },
    { name: '2 Star', value: analysis.ratingDistribution.star2, color: '#FB923C' },
    { name: '1 Star', value: analysis.ratingDistribution.star1, color: '#EF4444' },
  ];

  // Feature mentions bar chart data
  const featureChartData = analysis.featureMentions.map((fm) => ({
    feature: fm.feature,
    Positive: fm.positive,
    Negative: fm.negative,
  }));

  // Qualitative sentiment badge
  const getSentimentBadge = (score: number) => {
    if (score >= 80) return { label: 'Extremely Positive', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
    if (score >= 65) return { label: 'Generally Positive', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' };
    if (score >= 50) return { label: 'Mixed Feedback', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    return { label: 'Needs Urgent Action', color: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
  };

  const sentimentBadge = getSentimentBadge(analysis.overallSentimentScore);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 pb-16">
      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Product selector dropdown */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const found = products.find((p) => p.id === e.target.value);
                  if (found) onSelectProduct(found);
                }}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-extrabold text-lg sm:text-xl rounded-xl px-3 py-1 focus:outline-none focus:border-blue-500 cursor-pointer max-w-xs sm:max-w-md truncate"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700 font-bold">
                {selectedProduct.asinOrUrl}
              </span>
              <span>•</span>
              <span>
                Analyzed: <strong className="text-slate-800">{new Date(selectedProduct.lastAnalyzedAt).toLocaleDateString()}</strong>
              </span>
              <span>•</span>
              <span>
                Corpus: <strong className="text-slate-800">{analysis.totalReviewsAnalyzed} reviews</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onReAnalyze(selectedProduct)}
            disabled={isAnalyzing}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Re-analyze Corpus</span>
          </button>
          <button
            onClick={onOpenPrintView}
            className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
          {onDeleteProduct && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${selectedProduct.name}" and its analysis report?`)) {
                  onDeleteProduct(selectedProduct.id);
                }
              }}
              title="Delete this product report"
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Overall Sentiment Score Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[300px]">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">
              Overall Sentiment
            </h3>
            <div className="mt-2">
              <div className="text-[100px] sm:text-[110px] font-black leading-none tracking-tighter text-slate-900 italic">
                {analysis.overallSentimentScore}<span className="text-blue-500">%</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                analysis.overallSentimentScore >= 80
                  ? 'bg-emerald-100 text-emerald-700'
                  : analysis.overallSentimentScore >= 65
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {sentimentBadge.label}
              </span>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>+4.2% from last week</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 font-medium italic border-t border-slate-100 pt-3">
              "{analysis.summaryHeadline}"
            </p>
          </div>
        </div>

        {/* Rating Distribution Card */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-4">
              Rating Distribution
            </h3>
            <div className="space-y-2 text-xs">
              {starData.map((star) => (
                <div key={star.name} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 w-8">{star.name.replace(' Star', '★')}</span>
                  <div className="flex-1 mx-2 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${star.value}%`, backgroundColor: star.color }}
                    />
                  </div>
                  <span className="font-extrabold text-slate-900 w-8 text-right">{star.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-bold uppercase tracking-wider flex justify-between">
            <span>Corpus Total</span>
            <span className="text-slate-900">{analysis.totalReviewsAnalyzed} Reviews</span>
          </div>
        </div>

        {/* AI Improvement Plan Card (Dark Navy Slate) */}
        <div className="lg:col-span-5 bg-[#1E293B] text-white rounded-2xl p-6 shadow-xl h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-blue-400">
                AI Improvement Plan
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded">
                Ranked Impact
              </span>
            </div>

            <ul className="space-y-3">
              {actionPlanState.slice(0, 3).map((act, idx) => (
                <li key={idx} className="flex gap-3 group items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    0{idx + 1}
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-100 leading-tight mb-0.5">{act.title}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{act.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Expected Revenue Impact:</span>
            <strong className="text-emerald-400 font-bold">High Return</strong>
          </div>
        </div>
      </div>

      {/* Feature Mentions Bar Chart Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-1">
              Feature Sentiment Matrix
            </h3>
            <p className="text-xs font-semibold text-slate-800">Positive vs negative customer sentiment breakdown across key dimensions.</p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <XAxis dataKey="feature" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Positive" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Negative" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths & Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Strengths */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-emerald-600">
              Top 5 Strengths
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Positive Highlights
            </span>
          </div>

          <div className="space-y-3">
            {analysis.strengths.map((item, idx) => {
              const isExpanded = expandedStrength === item.id;
              return (
                <div
                  key={item.id || idx}
                  className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100/80"
                >
                  <div
                    onClick={() => setExpandedStrength(isExpanded ? null : item.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-900">
                        {item.percentage}% Pos
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] italic text-emerald-800 leading-relaxed mt-1.5">
                    "{item.summary}"
                  </p>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">Quotes:</p>
                      {item.quotes.map((q, qIdx) => (
                        <div key={qIdx} className="bg-white text-xs text-slate-800 p-2.5 rounded-lg border border-emerald-200 italic">
                          "{q}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Critical Complaints */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-rose-600">
              Critical Complaints
            </h3>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {analysis.complaints.map((item, idx) => {
              const isExpanded = expandedComplaint === item.id;
              return (
                <div
                  key={item.id || idx}
                  className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-100/80"
                >
                  <div
                    onClick={() => setExpandedComplaint(isExpanded ? null : item.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-900">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-200/60 text-rose-900">
                        {item.percentage}% Issue
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-rose-700" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-rose-700" />
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] italic text-rose-800 leading-relaxed mt-1.5">
                    "{item.summary}"
                  </p>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-rose-200/60 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-900">Quotes:</p>
                      {item.quotes.map((q, qIdx) => (
                        <div key={qIdx} className="bg-white text-xs text-slate-800 p-2.5 rounded-lg border border-rose-200 italic">
                          "{q}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Suggested Reply Templates */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-1">
              AI Response Generator
            </h3>
            <h4 className="text-sm font-bold text-slate-900">Customer Support Reply Templates</h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">Copy & customize responses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.replyTemplates.map((reply, idx) => (
            <div key={reply.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                    {reply.targetReviewRating} Star Review
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">{reply.issueFocus}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic mb-3">"{reply.sampleReviewQuote}"</p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans mb-4 shadow-2xs">
                  {reply.suggestedReply}
                </div>
              </div>

              <button
                onClick={() => handleCopy(reply.suggestedReply, reply.id || `r-${idx}`)}
                className="w-full bg-[#0F172A] hover:bg-slate-800 text-xs font-bold py-2 px-3 rounded-lg text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {copiedId === (reply.id || `r-${idx}`) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Template</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Banner at Bottom */}
      <div className="col-span-12 flex flex-col sm:flex-row items-center justify-between bg-[#0F172A] text-white rounded-2xl px-8 py-5 relative overflow-hidden gap-4 shadow-xl">
        <div className="z-10">
          <h4 className="text-white font-bold text-base">Unlock Side-by-Side Competitor Benchmarking</h4>
          <p className="text-slate-400 text-xs mt-0.5">Compare your review sentiment directly against competing Amazon & Jumia brands.</p>
        </div>
        <button
          onClick={() => onSelectProduct(products[0])}
          className="z-10 shrink-0 px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg hover:bg-blue-500 transition-colors"
        >
          Explore Competitor Mode
        </button>
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-500/20 to-transparent" />
      </div>
    </div>
  );
};
