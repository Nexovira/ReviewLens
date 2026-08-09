import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Check, Upload, BarChart3, MessageSquare, Share2, ShieldCheck, Zap } from 'lucide-react';

interface TourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAnalyzing?: () => void;
}

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to ReviewLens AI",
    subtitle: "Turn Customer Reviews into Store Growth",
    description: "ReviewLens AI processes raw customer feedback from Amazon, Shopify, Jumia, and Konga into instant sentiment scores, product defect reports, and customer reply templates.",
    icon: Sparkles,
    badge: "Step 1 of 5",
    highlights: [
      "Instant 0-100 Sentiment Score & Letter Grade",
      "Automatic duplication & language filter",
      "Designed for e-commerce store owners & brand managers"
    ]
  },
  {
    title: "Adding Product Reviews",
    subtitle: "Flexible Import Methods",
    description: "Easily paste up to 50,000 characters of raw reviews, upload CSV spreadsheets, or enter product URLs to run comprehensive AI extractions.",
    icon: Upload,
    badge: "Step 2 of 5",
    highlights: [
      "Copy-paste reviews directly from seller portals",
      "Bulk CSV upload for fast batch processing",
      "ASIN & Shopify URL review extraction"
    ]
  },
  {
    title: "Deep Sentiment & Complaint Extraction",
    subtitle: "Know What Customers Really Think",
    description: "Discover top 5 customer strengths and top 5 complaints backed by real quote excerpts, rating distributions, and feature mention frequencies.",
    icon: BarChart3,
    badge: "Step 3 of 5",
    highlights: [
      "Real customer quotes for proof & evidence",
      "Feature mentions: Quality, Price, Size, Packaging",
      "Competitor brand mention detection"
    ]
  },
  {
    title: "Prioritized Action Plan & Replies",
    subtitle: "Turn Insights into Action",
    description: "Get a concrete, 3-5 step prioritized improvement plan ordered by effort vs. impact, plus 3 ready-to-copy response templates for negative reviews.",
    icon: MessageSquare,
    badge: "Step 4 of 5",
    highlights: [
      "High/Medium/Low priority operational steps",
      "Professional response templates for 1-star reviews",
      "One-click copy to clipboard"
    ]
  },
  {
    title: "Export, Share & Track Trends",
    subtitle: "Collaborate & Monitor Progress",
    description: "Download PDF report views, export CSV data, or generate shareable public links to send reports directly to manufacturers or team members.",
    icon: Share2,
    badge: "Step 5 of 5",
    highlights: [
      "Printable executive PDF reports",
      "One-click public shareable links",
      "Historical sentiment trend tracking"
    ]
  }
];

export const TourGuideModal: React.FC<TourGuideModalProps> = ({ isOpen, onClose, onStartAnalyzing }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('reviewlens_tour_completed', 'true');
      onClose();
      if (onStartAnalyzing) onStartAnalyzing();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0F172A] border border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors z-10"
          title="Close Tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">
            {currentStep.badge}
          </span>
          <span className="text-xs text-slate-400 font-semibold">Product Tour</span>
        </div>

        {/* Step Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
            <StepIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">{currentStep.title}</h3>
            <p className="text-xs text-blue-400 font-bold mt-0.5">{currentStep.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          {currentStep.description}
        </p>

        {/* Key Highlights List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5 mb-6">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Key Capabilities:
          </p>
          {currentStep.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="font-medium">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Step Indicators & Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-blue-500'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>{isLastStep ? 'Get Started' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
