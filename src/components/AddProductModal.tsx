import React, { useState } from 'react';
import {
  X,
  Sparkles,
  FileText,
  Table,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Layers,
  Lock,
  Zap,
} from 'lucide-react';
import { Product, AnalysisResult, ManualReviewEntry, UserProfile } from '../types';
import { getTierProductLimit } from '../lib/supabaseClient';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeComplete: (product: Product) => void;
  user?: UserProfile | null;
  productCount?: number;
  onOpenBilling?: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeComplete,
  user,
  productCount = 0,
  onOpenBilling,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'manual'>('paste');
  const [productName, setProductName] = useState('');
  const [asinOrUrl, setAsinOrUrl] = useState('');
  const [category, setCategory] = useState('Electronics & Tech');
  const [reviewCorpus, setReviewCorpus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Manual review entry state
  const [manualReviews, setManualReviews] = useState<ManualReviewEntry[]>([
    { id: '1', rating: 5, title: 'Amazing quality', text: 'Best item I bought this year. Fast shipping.' },
    { id: '2', rating: 1, title: 'Sizing is small', text: 'Way too tight. Customer service was slow.' },
  ]);

  if (!isOpen) return null;

  const currentTier = user?.planTier || 'Starter';
  const tierLimit = getTierProductLimit(currentTier, user?.email);
  const isLimitReached = productCount >= tierLimit;

  if (isLimitReached) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fadeIn text-slate-900">
        <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            {currentTier} Plan Limit Reached
          </span>

          <h3 className="text-xl font-black text-slate-900 mt-4 mb-2">Product SKU Limit Reached</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Your <strong className="text-slate-900">{currentTier} plan</strong> is limited to <strong>{tierLimit} {tierLimit === 1 ? 'product SKU' : 'product SKUs'}</strong> ({productCount}/{tierLimit} active). Upgrade your plan to analyze more products simultaneously and unlock Competitor Benchmarking.
          </p>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                onClose();
                if (onOpenBilling) onOpenBilling();
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-white text-amber-300" />
              <span>Upgrade Plan to Growth / Pro</span>
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLoadSampleCorpus = () => {
    setProductName('Aura Sound Pro ANC Wireless Headphones');
    setAsinOrUrl('B08X91LK99 / https://luminastore.com/products/aura-sound-pro');
    setReviewCorpus(`5 Stars: The Active Noise Cancellation on these headphones completely blew my mind. I took them on an 8 hour transatlantic flight and couldn't hear the jet engines at all! Sound quality is crisp with punchy bass.
5 Stars: Unboxing experience was top notch. Fast shipping in 2 days. The battery lasts well over 35 hours of continuous music.
4 Stars: Great headphones for working from home. Comfortable ear cushions, though after 3 hours the top headband feels slightly tight on my crown.
1 Star: Took 15 minutes to pair with my MacBook and phone at the same time. The quick start guide is way too small to read without a magnifying glass!
5 Stars: Better than my $250 Bose QC45s for half the cost! Really impressed with the mic clarity on Zoom calls.
2 Stars: Headband is snug. If you have a larger head size like me, it exerts a bit of pressure.
5 Stars: Sturdy build, dropped it on tile twice and zero scratches.
1 Star: Delivery box arrived slightly crushed on one corner, though item inside was safe.
4 Stars: Bluetooth connection holds stable through 3 walls in my apartment. Very solid overall.`);
  };

  const handleAddManualRow = () => {
    setManualReviews([
      ...manualReviews,
      { id: Date.now().toString(), rating: 5, title: '', text: '' },
    ]);
  };

  const handleRemoveManualRow = (id: string) => {
    setManualReviews(manualReviews.filter((r) => r.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let textToAnalyze = reviewCorpus;
    if (activeTab === 'manual') {
      textToAnalyze = manualReviews
        .map((r) => `${r.rating} Stars - ${r.title}: ${r.text}`)
        .join('\n');
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 15) {
      setErrorMsg('Please enter or paste at least 15 characters of review text.');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Initializing Gemini 3.6 Flash Engine...');

    try {
      const steps = [
        'Parsing review corpus & normalizing sentiment vectors...',
        'Extracting top 5 strengths and complaint themes...',
        'Calculating feature mention frequency matrices...',
        'Detecting competitor brand references...',
        'Drafting prioritized action plan & reply templates...',
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        setLoadingStep(steps[i]);
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName || 'New E-commerce Product',
          productUrl: asinOrUrl || 'Direct Review Paste',
          reviewText: textToAnalyze,
          userProfile: user,
        }),
      });

      const responseData = await res.json();

      if (res.status === 402 || responseData.error === 'SUBSCRIPTION_LOCKED') {
        throw new Error(responseData.message || 'Your ReviewLens AI features are currently locked. Please update your payment method.');
      }

      if (!responseData.success && !responseData.data) {
        throw new Error(responseData.error || 'Failed to complete review analysis.');
      }

      const analysisResult: AnalysisResult = responseData.data;

      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        userId: 'usr_current',
        name: productName || 'Analyzed E-commerce Product',
        asinOrUrl: asinOrUrl || 'Imported Review Corpus',
        category: category || 'E-commerce Product',
        createdAt: new Date().toISOString(),
        lastAnalyzedAt: new Date().toISOString(),
        reviewCount: analysisResult.totalReviewsAnalyzed || Math.max(10, Math.floor(textToAnalyze.length / 120)),
        rawReviewCorpus: textToAnalyze,
        latestAnalysis: analysisResult,
      };

      setIsLoading(false);
      onAnalyzeComplete(newProduct);
      onClose();
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setErrorMsg(err.message || 'An error occurred while contacting AI analysis service.');
    }
  };

  const charCount = reviewCorpus.length;
  const maxChar = 50000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Add Product & Analyze Reviews</h2>
            <p className="text-xs text-slate-500 font-medium">
              Input reviews to generate structured sentiment intelligence, strengths, complaints, and action plans.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-rose-800 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        {isLoading ? (
          /* Skeleton & Live Loading State */
          <div className="py-12 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <Sparkles className="w-6 h-6 text-blue-600 absolute inset-0 m-auto" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 mb-2">Analyzing Customer Reviews...</h3>
              <p className="text-xs text-blue-800 font-mono bg-blue-50 py-1.5 px-4 rounded-full inline-block border border-blue-200 font-bold">
                {loadingStep}
              </p>
            </div>

            {/* Skeleton loader blocks */}
            <div className="space-y-2 max-w-md mx-auto pt-4">
              <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4 mx-auto" />
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2 mx-auto" />
              <div className="h-3 bg-slate-100 rounded animate-pulse w-5/6 mx-auto" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Aura Sound Pro Headphones"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                  ASIN / Shopify URL (Optional)
                </label>
                <input
                  type="text"
                  value={asinOrUrl}
                  onChange={(e) => setAsinOrUrl(e.target.value)}
                  placeholder="e.g. B08X91LK99"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Input Method Tabs */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-colors ${
                    activeTab === 'paste'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Bulk Text Paste (50k chars)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-colors ${
                    activeTab === 'manual'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  Manual Entry Table
                </button>
              </div>

              {activeTab === 'paste' && (
                <button
                  type="button"
                  onClick={handleLoadSampleCorpus}
                  className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample Reviews
                </button>
              )}
            </div>

            {/* Tab 1: Large Text Paste */}
            {activeTab === 'paste' ? (
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
                  <span>Paste raw reviews from Amazon, Shopify, or CSV export:</span>
                  <span className={charCount > maxChar ? 'text-rose-600 font-bold' : ''}>
                    {charCount.toLocaleString()} / {maxChar.toLocaleString()} chars
                  </span>
                </div>
                <textarea
                  rows={8}
                  maxLength={maxChar}
                  value={reviewCorpus}
                  onChange={(e) => setReviewCorpus(e.target.value)}
                  placeholder="Paste customer reviews here... (e.g., '5 Stars: Great product! Fast shipping...')"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-600 leading-relaxed"
                />
              </div>
            ) : (
              /* Tab 2: Manual Entry Table */
              <div className="space-y-3">
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {manualReviews.map((row, idx) => (
                    <div
                      key={row.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row gap-2 items-center"
                    >
                      <select
                        value={row.rating}
                        onChange={(e) => {
                          const updated = [...manualReviews];
                          updated[idx].rating = Number(e.target.value);
                          setManualReviews(updated);
                        }}
                        className="bg-white border border-slate-200 text-amber-600 font-black text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                      >
                        <option value={5}>5 ★★★★★</option>
                        <option value={4}>4 ★★★★☆</option>
                        <option value={3}>3 ★★★☆☆</option>
                        <option value={2}>2 ★★☆☆☆</option>
                        <option value={1}>1 ★☆☆☆☆</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Review title"
                        value={row.title}
                        onChange={(e) => {
                          const updated = [...manualReviews];
                          updated[idx].title = e.target.value;
                          setManualReviews(updated);
                        }}
                        className="w-full sm:w-1/3 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                      />

                      <input
                        type="text"
                        placeholder="Review comment details..."
                        value={row.text}
                        onChange={(e) => {
                          const updated = [...manualReviews];
                          updated[idx].text = e.target.value;
                          setManualReviews(updated);
                        }}
                        className="w-full sm:flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveManualRow(row.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddManualRow}
                  className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Review Row
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run ReviewLens AI</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
