import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  BarChart3,
  DollarSign,
  Check,
  Search,
  RefreshCw,
  Lock,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  Building2,
  Layers,
  Activity,
  Save,
  Clock,
  ArrowRight,
  Zap,
  ToggleLeft,
  ToggleRight,
  PieChart
} from 'lucide-react';
import { UserProfile, Product, PlanTier } from '../types';
import { subscribeToAdminData, fetchAllRegisteredUsers, fetchAllPlatformProducts } from '../lib/adminService';
import {
  subscribeToTierPrices,
  saveTierPricesToFirestore,
  subscribeToSystemSettings,
  saveSystemSettingsToFirestore,
  formatPriceNaira,
  TierPrices,
  SystemSettings,
  DEFAULT_PRICES,
  DEFAULT_SETTINGS
} from '../lib/pricingService';

interface AdminDashboardViewProps {
  currentUser: UserProfile | null;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'pricing' | 'users' | 'activity'>('metrics');
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [tierPrices, setTierPrices] = useState<TierPrices>(DEFAULT_PRICES);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  
  // Pricing form state
  const [starterPriceInput, setStarterPriceInput] = useState<number>(3000);
  const [growthPriceInput, setGrowthPriceInput] = useState<number>(8000);
  const [proPriceInput, setProPriceInput] = useState<number>(15000);
  
  // Global Trial Form state
  const [trialsEnabledToggle, setTrialsEnabledToggle] = useState<boolean>(true);
  const [trialDurationInput, setTrialDurationInput] = useState<number>(7);
  
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState('');
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState('');
  const [isSavingPrices, setIsSavingPrices] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Load prices & subscribe
  useEffect(() => {
    const unsubPricing = subscribeToTierPrices((fetchedPrices) => {
      setTierPrices(fetchedPrices);
      setStarterPriceInput(fetchedPrices.Starter);
      setGrowthPriceInput(fetchedPrices.Growth);
      setProPriceInput(fetchedPrices.Pro);
    });

    const unsubSettings = subscribeToSystemSettings((fetchedSettings) => {
      setSystemSettings(fetchedSettings);
      setTrialsEnabledToggle(fetchedSettings.trialsEnabled);
      setTrialDurationInput(fetchedSettings.trialDurationDays);
    });

    return () => {
      unsubPricing();
      unsubSettings();
    };
  }, []);

  // Load real users & products with realtime listener
  useEffect(() => {
    const unsubAdmin = subscribeToAdminData(
      (users) => {
        let merged = [...users];
        if (currentUser && currentUser.email && !merged.some((u) => u.id === currentUser.id || u.email === currentUser.email)) {
          merged.push(currentUser);
        }
        setUsersList(merged);
      },
      (prods) => setProductsList(prods)
    );

    // Initial fetch fallback
    fetchAllRegisteredUsers().then((u) => {
      let merged = [...u];
      if (currentUser && currentUser.email && !merged.some((usr) => usr.id === currentUser.id || usr.email === currentUser.email)) {
        merged.push(currentUser);
      }
      setUsersList(merged);
    });
    fetchAllPlatformProducts().then((p) => {
      if (p.length > 0) setProductsList(p);
    });

    return () => unsubAdmin();
  }, [currentUser]);

  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrices(true);
    setPricingSaveSuccess('');

    const newPrices: TierPrices = {
      Starter: Number(starterPriceInput) || 0,
      Growth: Number(growthPriceInput) || 0,
      Pro: Number(proPriceInput) || 0,
    };

    try {
      await saveTierPricesToFirestore(newPrices);
      setIsSavingPrices(false);
      setPricingSaveSuccess('Tier prices updated successfully! New prices are now active on customer Pricing & Billing pages.');
      setTimeout(() => setPricingSaveSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to save prices:', err);
      setIsSavingPrices(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSaveSuccess('');

    const updated: SystemSettings = {
      trialsEnabled: trialsEnabledToggle,
      trialDurationDays: Math.max(1, Number(trialDurationInput) || 7),
    };

    try {
      await saveSystemSettingsToFirestore(updated);
      setIsSavingSettings(false);
      setSettingsSaveSuccess(
        `Global Trial Settings updated! Free trials are now ${
          updated.trialsEnabled ? 'ENABLED' : 'DISABLED'
        } globally with a duration of ${updated.trialDurationDays} days.`
      );
      setTimeout(() => setSettingsSaveSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to save system settings:', err);
      setIsSavingSettings(false);
    }
  };

  // Metrics Calculations aggregated from Firestore
  const totalStores = usersList.length;
  const totalProducts = productsList.length;
  const totalReportsGenerated = productsList.reduce((acc, p) => acc + (p.latestAnalysis ? 1 : 0), 0);
  
  // Subscription status aggregations
  const activePaidUsers = usersList.filter((u) => u.subscriptionStatus === 'active');
  const trialingUsers = usersList.filter((u) => u.subscriptionStatus === 'trialing');
  const totalActiveSubscriptions = activePaidUsers.length + trialingUsers.length;
  const totalUnsubscribedUsers = usersList.filter((u) => u.subscriptionStatus === 'unsubscribed' || u.subscriptionStatus === 'locked' || u.subscriptionStatus === 'payment_failed').length;

  // Tier counts
  const starterCount = usersList.filter((u) => u.planTier === 'Starter').length;
  const growthCount = usersList.filter((u) => u.planTier === 'Growth').length;
  const proCount = usersList.filter((u) => u.planTier === 'Pro').length;

  // Active paid tier counts for MRR
  const paidStarter = activePaidUsers.filter((u) => u.planTier === 'Starter').length;
  const paidGrowth = activePaidUsers.filter((u) => u.planTier === 'Growth').length;
  const paidPro = activePaidUsers.filter((u) => u.planTier === 'Pro').length;

  // Fallback safe prices
  const starterPrice = tierPrices?.Starter ?? DEFAULT_PRICES.Starter;
  const growthPrice = tierPrices?.Growth ?? DEFAULT_PRICES.Growth;
  const proPrice = tierPrices?.Pro ?? DEFAULT_PRICES.Pro;

  // Aggregated MRR from active paid subscriptions
  const activeMRR =
    paidStarter * starterPrice +
    paidGrowth * growthPrice +
    paidPro * proPrice;

  // Projected MRR including trialing conversions
  const projectedMRR =
    starterCount * starterPrice +
    growthCount * growthPrice +
    proCount * proPrice;

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      (u.storeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || u.planTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 pb-12">
      {/* Admin Header Banner */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Platform Owner Control Center
              </span>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                systemSettings.trialsEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                Trials: {systemSettings.trialsEnabled ? `ON (${systemSettings.trialDurationDays} Days)` : 'OFF'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Owner Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-medium leading-relaxed">
              Manage platform subscription tier pricing, monitor registered store accounts, toggle global trial settings, and track real-time billing metrics across the ReviewLens ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged in as Owner</span>
              <span className="text-xs font-black text-white">{currentUser?.email || 'Owner Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Key Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Active Subscriptions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Subscriptions</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-blue-600 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalActiveSubscriptions}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {activePaidUsers.length} Paid / {trialingUsers.length} Trialing
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active store accounts across all tiers</p>
        </div>

        {/* Metric 2: Monthly Recurring Revenue (MRR) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active MRR</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{formatPriceNaira(activeMRR)}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Firestore Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Projected run-rate: {formatPriceNaira(projectedMRR)}</p>
        </div>

        {/* Metric 3: AI Reports Generated */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Review Reports</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalReportsGenerated}</span>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              Gemini 2.5/3.6
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Across {totalProducts} catalog products</p>
        </div>

        {/* Metric 4: Registered Store Accounts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalStores}</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {totalUnsubscribedUsers} Unsubscribed
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Registered merchant user profiles</p>
        </div>
      </div>

      {/* Navigation Tabs for Owner Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'metrics'
              ? 'bg-[#0F172A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Billing Metrics & Global Trial Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'pricing'
              ? 'bg-[#0F172A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Edit Tier Pricing</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'users'
              ? 'bg-[#0F172A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Stores Directory ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'activity'
              ? 'bg-[#0F172A] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Platform Activity & Breakdown</span>
        </button>
      </div>

      {/* TAB 1: Billing Metrics View & Global Trial Controls */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {/* Global Trial Period Toggle & Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Global Free Trial Controls & Policy Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Enable or disable free trial periods globally across the application. When disabled, customers are billed immediately upon checkout without a trial period.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                  trialsEnabledToggle
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {trialsEnabledToggle ? `Global Free Trial ACTIVE (${trialDurationInput} Days)` : 'Immediate Billing ENABLED (No Trial)'}
                </span>
              </div>
            </div>

            {settingsSaveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settingsSaveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Toggle Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                        Free Trial Period Toggle
                      </span>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Controls whether new subscribers receive a trial before card charge.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setTrialsEnabledToggle(!trialsEnabledToggle)}
                      className="cursor-pointer focus:outline-none"
                    >
                      {trialsEnabledToggle ? (
                        <ToggleRight className="w-10 h-10 text-emerald-600 transition-all" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-slate-400 transition-all" />
                      )}
                    </button>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-semibold ${
                    trialsEnabledToggle
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/80 border-amber-200 text-amber-900'
                  }`}>
                    {trialsEnabledToggle ? (
                      <span>✅ <strong>Free Trials Enabled:</strong> Customers authorizing a plan receive a {trialDurationInput}-day trial ($0 charged today). First charge occurs on Day {Number(trialDurationInput) + 1}.</span>
                    ) : (
                      <span>⚡ <strong>Immediate Billing:</strong> Free trials are turned off. Customers authorizing a plan will be charged the plan price immediately upon payment authorization.</span>
                    )}
                  </div>
                </div>

                {/* Duration Input Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
                      Configurable Trial Duration (Days)
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium mb-3">
                      Specify trial period length in days (e.g. 3, 7, 14, 30 days) without hardcoding values in code.
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={90}
                        required
                        value={trialDurationInput}
                        onChange={(e) => setTrialDurationInput(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                      <span className="absolute right-4 top-2.5 font-bold text-slate-400 text-xs">Days</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Current setting in Firestore: <strong>{systemSettings.trialDurationDays} Days</strong>
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {isSavingSettings ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Global Trial Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Aggregated Subscription & MRR Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Tier MRR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Starter Plan MRR</span>
                <span className="text-xs font-bold text-slate-500">{formatPriceNaira(tierPrices.Starter)}/mo</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">{formatPriceNaira(paidStarter * tierPrices.Starter)}</span>
                <span className="text-xs text-slate-500 block mt-1 font-medium">
                  {paidStarter} Paid Active • {starterCount} Total Accounts
                </span>
              </div>
            </div>

            {/* Growth Tier MRR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-blue-800">Growth Plan MRR</span>
                <span className="text-xs font-bold text-blue-600">{formatPriceNaira(tierPrices.Growth)}/mo</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">{formatPriceNaira(paidGrowth * tierPrices.Growth)}</span>
                <span className="text-xs text-slate-500 block mt-1 font-medium">
                  {paidGrowth} Paid Active • {growthCount} Total Accounts
                </span>
              </div>
            </div>

            {/* Pro Tier MRR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-purple-800">Pro Plan MRR</span>
                <span className="text-xs font-bold text-purple-600">{formatPriceNaira(tierPrices.Pro)}/mo</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">{formatPriceNaira(paidPro * tierPrices.Pro)}</span>
                <span className="text-xs text-slate-500 block mt-1 font-medium">
                  {paidPro} Paid Active • {proCount} Total Accounts
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Edit Tier Pricing */}
      {activeTab === 'pricing' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Manage Platform Subscription Tier Pricing
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Live Synchronization Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Update monthly prices for Starter, Growth, and Pro tiers. Price updates saved here will automatically reflect on the public customer Pricing page and the customer Billing checkout modal.
            </p>
          </div>

          {pricingSaveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pricingSaveSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSavePrices} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter Plan Editor */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">Starter Plan</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">1 Product</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Monthly Price (NGN ₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₦</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={starterPriceInput}
                      onChange={(e) => setStarterPriceInput(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-4 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Current active rate: <strong>{formatPriceNaira(tierPrices.Starter)}/mo</strong></p>
              </div>

              {/* Growth Plan Editor */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 space-y-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Most Popular
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-900">Growth Plan</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">5 Products</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Monthly Price (NGN ₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₦</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={growthPriceInput}
                      onChange={(e) => setGrowthPriceInput(Number(e.target.value))}
                      className="w-full bg-white border border-blue-300 rounded-xl pl-8 pr-4 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Current active rate: <strong>{formatPriceNaira(tierPrices.Growth)}/mo</strong></p>
              </div>

              {/* Pro Plan Editor */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">Pro Plan</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">Unlimited</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Monthly Price (NGN ₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₦</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={proPriceInput}
                      onChange={(e) => setProPriceInput(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-4 py-2 text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Current active rate: <strong>{formatPriceNaira(tierPrices.Pro)}/mo</strong></p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                Note: Updating these values instantly changes what customers see on landing page and checkout.
              </p>
              <button
                type="submit"
                disabled={isSavingPrices}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                {isSavingPrices ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Tier Prices</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Registered Stores Directory */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Registered Stores & User Directory
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Comprehensive list of all e-commerce brands, user account emails, assigned plan tiers, and registration timestamps.
              </p>
            </div>

            {/* Filter & Search controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search store or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="all">All Tiers ({usersList.length})</option>
                <option value="Starter">Starter ({starterCount})</option>
                <option value="Growth">Growth ({growthCount})</option>
                <option value="Pro">Pro ({proCount})</option>
              </select>
            </div>
          </div>

          {/* Owner policy reminder alert */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Subscription Lifecycle Controls:</strong> Manage 7-day free trial status, lock status, or extend trials for individual store accounts.
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Admin Override Enabled
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Store Name</th>
                  <th className="py-3 px-4">User Email</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Subscription Status</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4 text-right">Products Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                      No registered stores match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const userProductsCount = productsList.filter((p) => p.userId === u.id).length;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>{u.storeName || 'E-Commerce Store'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              u.planTier === 'Pro'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : u.planTier === 'Growth'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {u.planTier} ({formatPriceNaira(tierPrices[u.planTier] || DEFAULT_PRICES[u.planTier])})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            u.subscriptionStatus === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.subscriptionStatus === 'trialing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {u.subscriptionStatus || 'trialing'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-semibold">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900">
                          {userProductsCount} SKUs
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Platform Activity & Breakdown */}
      {activeTab === 'activity' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Distribution Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Subscription Tier Distribution
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Percentage of registered stores across each active plan.
            </p>

            <div className="space-y-4 pt-2">
              {/* Starter */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Starter Plan (₦{(tierPrices?.Starter ?? 3000).toLocaleString()})</span>
                  <span className="text-slate-900">{starterCount} stores ({totalStores ? Math.round((starterCount / totalStores) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-500 h-full transition-all duration-500"
                    style={{ width: `${totalStores ? (starterCount / totalStores) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Growth */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-blue-700">Growth Plan (₦{(tierPrices?.Growth ?? 8000).toLocaleString()})</span>
                  <span className="text-blue-900">{growthCount} stores ({totalStores ? Math.round((growthCount / totalStores) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{ width: `${totalStores ? (growthCount / totalStores) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Pro */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-purple-700">Pro Plan (₦{(tierPrices?.Pro ?? 15000).toLocaleString()})</span>
                  <span className="text-purple-900">{proCount} stores ({totalStores ? Math.round((proCount / totalStores) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full transition-all duration-500"
                    style={{ width: `${totalStores ? (proCount / totalStores) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Real-time Platform Activity Monitor
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Live audit of store additions, AI analyses, and system updates.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Platform Synchronized</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {totalStores} stores connected via Firebase Firestore & Auth.
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">Just now</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Product Analysis Pipeline</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {totalProducts} product SKUs active, {totalReportsGenerated} AI review reports compiled.
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">Active</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Dynamic Pricing Engine</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Current price rates: Starter ({formatPriceNaira(tierPrices.Starter)}), Growth ({formatPriceNaira(tierPrices.Growth)}), Pro ({formatPriceNaira(tierPrices.Pro)}).
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">Live Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
