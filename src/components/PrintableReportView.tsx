import React from 'react';
import { Product, AnalysisResult } from '../types';
import { ArrowLeft, Printer, Sparkles, BarChart3, CheckSquare } from 'lucide-react';
import { Logo } from './Logo';

interface PrintableReportViewProps {
  product: Product;
  onBack: () => void;
}

export const PrintableReportView: React.FC<PrintableReportViewProps> = ({ product, onBack }) => {
  const analysis: AnalysisResult = product.latestAnalysis;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      {/* Top Bar - hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet Card */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-800 print:border-gray-300 pb-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" variant="full" />
            <div>
              <h1 className="text-lg font-black text-white print:text-black">
                Executive Review Audit Report
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Product Sentiment & AI Action Intelligence Report
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 print:text-gray-600">
            <p className="font-bold text-white print:text-black">{product.name}</p>
            <p>ASIN/URL: {product.asinOrUrl}</p>
            <p>Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary & Score */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 print:text-gray-500">Overall Sentiment</span>
            <div className="text-4xl font-extrabold text-emerald-400 print:text-emerald-700 mt-2">
              {analysis.overallSentimentScore}/100
            </div>
            <p className="text-[11px] text-slate-400 print:text-gray-600 mt-1">
              Corpus: {analysis.totalReviewsAnalyzed} reviews
            </p>
          </div>

          <div className="col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 print:text-gray-500">Executive Summary</span>
            <p className="text-xs text-slate-200 print:text-gray-800 mt-2 italic leading-relaxed">
              "{analysis.summaryHeadline}"
            </p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white print:text-black mb-3 uppercase tracking-wider">Rating Distribution</h2>
          <div className="grid grid-cols-5 gap-3 text-center text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-slate-400 print:text-gray-600">5 Star</span>
              <p className="text-lg font-black text-emerald-400 print:text-emerald-700 mt-1">{analysis.ratingDistribution.star5}%</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-slate-400 print:text-gray-600">4 Star</span>
              <p className="text-lg font-black text-emerald-400 print:text-emerald-700 mt-1">{analysis.ratingDistribution.star4}%</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-slate-400 print:text-gray-600">3 Star</span>
              <p className="text-lg font-black text-amber-400 print:text-amber-700 mt-1">{analysis.ratingDistribution.star3}%</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-slate-400 print:text-gray-600">2 Star</span>
              <p className="text-lg font-black text-orange-400 print:text-orange-700 mt-1">{analysis.ratingDistribution.star2}%</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="font-bold text-slate-400 print:text-gray-600">1 Star</span>
              <p className="text-lg font-black text-rose-400 print:text-rose-700 mt-1">{analysis.ratingDistribution.star1}%</p>
            </div>
          </div>
        </div>

        {/* Strengths & Complaints */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xs font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-wider mb-3">Key Strengths</h2>
            <ul className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              {analysis.strengths.slice(0, 4).map((s, idx) => (
                <li key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                  <span className="font-bold text-white print:text-black">{s.title}</span> ({s.percentage}%)
                  <p className="text-[11px] text-slate-400 print:text-gray-600 mt-0.5">{s.summary}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold text-rose-400 print:text-rose-700 uppercase tracking-wider mb-3">Customer Complaints</h2>
            <ul className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              {analysis.complaints.slice(0, 4).map((c, idx) => (
                <li key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                  <span className="font-bold text-white print:text-black">{c.title}</span> ({c.percentage}%)
                  <p className="text-[11px] text-slate-400 print:text-gray-600 mt-0.5">{c.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Plan */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-white print:text-black uppercase tracking-wider mb-3">
            Prioritized Action Plan
          </h2>
          <div className="space-y-2 text-xs">
            {analysis.actionPlan.map((act, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 print:bg-gray-50 print:border-gray-200">
                <span className="font-bold text-indigo-400 print:text-indigo-700 mr-2">[{act.priority} Priority]</span>
                <span className="font-bold text-white print:text-black">{act.title}</span>
                <p className="text-[11px] text-slate-300 print:text-gray-700 mt-1">{act.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 print:border-gray-300 pt-4 text-[10px] text-slate-500 print:text-gray-500 flex justify-between">
          <span>ReviewLens AI E-commerce Analytics</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
