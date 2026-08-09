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
  ArrowRight
} from 'lucide-react';
import { UserProfile, Product, PlanTier } from '../types';
import { subscribeToAdminData, fetchAllRegisteredUsers, fetchAllPlatformProducts } from '../lib/adminService';
import { subscribeToTierPrices, saveTierPricesToFirestore, formatPriceNaira, TierPrices, DEFAULT_PRICES } from '../lib/pricingService';

interface AdminDashboardViewProps {
  currentUser: UserProfile | null;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'users' | 'activity'>('pricing');
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [tierPrices, setTierPrices] = useState<TierPrices>(DEFAULT_PRICES);
  
  // Pricing form state
  const [starterPriceInput, setStarterPriceInput] = useState<number>(3000);
  const [growthPriceInput, setGrowthPriceInput] = useState<number>(8000);
  const [proPriceInput, setProPriceInput] = useState<number>(15000);
  
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState('');
  const [isSavingPrices, setIsSavingPrices] = useState(false);
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

    return () => unsubPricing();
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

  // Metrics Calculations
  const totalStores = usersList.length;
  const totalProducts = productsList.length;
  const totalReportsGenerated = productsList.reduce((acc, p) => acc + (p.latestAnalysis ? 1 : 0), 0);
  
  const starterCount = usersList.filter((u) => u.planTier === 'Starter').length;
  const growthCount = usersList.filter((u) => u.planTier === 'Growth').length;
  const proCount = usersList.filter((u) => u.planTier === 'Pro').length;

  const estimatedMonthlyRevenue =
    starterCount * tierPrices.Starter +
    growthCount * tierPrices.Growth +
    proCount * tierPrices.Pro;

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
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Owner Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-medium leading-relaxed">
              Manage platform subscription tier pricing, monitor registered store accounts, and track real-time AI review analysis metrics across the ReviewLens ecosystem.
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
        {/* Metric 1: Total Stores */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registered Stores</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalStores}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Active Users
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Accounts across Starter, Growth & Pro</p>
        </div>

        {/* Metric 2: Total Products Analyzed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Products Analyzed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{totalProducts}</span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Catalog Items
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active product SKUs under audit</p>
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
              Gemini 3.6
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Comprehensive sentiment reports</p>
        </div>

        {/* Metric 4: Platform MRR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estimated MRR</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{formatPriceNaira(estimatedMonthlyRevenue)}</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Monthly Run-Rate
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Based on active plan pricing</p>
        </div>
      </div>

      {/* Navigation Tabs for Owner Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex items-center gap-2 overflow-x-auto">
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

      {/* TAB 1: Edit Tier Pricing */}
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
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
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

      {/* TAB 2: Registered Stores Directory */}
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
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3 text-xs text-slate-600 font-medium">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              <strong>Automated Tier Lifecycle:</strong> Customer plan tiers update automatically when users execute subscription upgrades via Paystack or billing checkout. Manual tier modification is intentionally restricted to preserve automated subscription accounting.
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
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4 text-right">Products Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
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

      {/* TAB 3: Platform Activity & Breakdown */}
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
                  <span className="text-slate-700">Starter Plan (₦{tierPrices.Starter.toLocaleString()})</span>
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
                  <span className="text-blue-700">Growth Plan (₦{tierPrices.Growth.toLocaleString()})</span>
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
                  <span className="text-purple-700">Pro Plan (₦{tierPrices.Pro.toLocaleString()})</span>
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
