import React, { useState } from 'react';
import { History, Search, RefreshCw, Calendar, ArrowUpRight, BarChart2, CheckCircle2, Trash2 } from 'lucide-react';
import { Product, AnalysisResult } from '../types';

interface ReportHistoryViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onReAnalyze: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  isAnalyzing: boolean;
}

export const ReportHistoryView: React.FC<ReportHistoryViewProps> = ({
  products,
  onSelectProduct,
  onReAnalyze,
  onDeleteProduct,
  isAnalyzing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [autoReanalyzeMsg, setAutoReanalyzeMsg] = useState<string | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.asinOrUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWeeklyAutoRun = (product: Product) => {
    setAutoReanalyzeMsg(`Scheduling automated weekly re-analysis for ${product.name}...`);
    onReAnalyze(product);
    setTimeout(() => {
      setAutoReanalyzeMsg(`Weekly re-analysis schedule updated for ${product.name}!`);
      setTimeout(() => setAutoReanalyzeMsg(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">Saved Reports & Historical Runs</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access past review analysis snapshots, track sentiment trends over time, and trigger weekly re-analyses.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products or ASIN..."
            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {autoReanalyzeMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{autoReanalyzeMsg}</span>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-[0.2em] text-[10px]">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">ASIN / URL</th>
                <th className="px-6 py-4">Last Analysis Date</th>
                <th className="px-6 py-4">Review Corpus</th>
                <th className="px-6 py-4">Sentiment Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-slate-900 text-sm block truncate max-w-xs">{p.name}</span>
                    <span className="text-[11px] text-slate-400 font-semibold">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-600 font-bold">
                    {p.asinOrUrl}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{new Date(p.lastAnalyzedAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-semibold">
                    <strong className="text-slate-900">{p.latestAnalysis.totalReviewsAnalyzed}</strong> reviews
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-black text-xs">
                      {p.latestAnalysis.overallSentimentScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>View Report</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleWeeklyAutoRun(p)}
                      disabled={isAnalyzing}
                      title="Run Weekly Re-analysis on new reviews"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                      <span>Weekly Re-run</span>
                    </button>
                    {onDeleteProduct && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        title="Delete product"
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded-lg border border-rose-200 transition-colors inline-flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
