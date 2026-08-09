import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AddProductModal } from './components/AddProductModal';
import { CompetitorView } from './components/CompetitorView';
import { ReportHistoryView } from './components/ReportHistoryView';
import { BillingView } from './components/BillingView';
import { AuthModal } from './components/AuthModal';
import { PrintableReportView } from './components/PrintableReportView';
import { UserProfile, Product, PlanTier } from './types';
import {
  getStoredUser,
  getStoredProducts,
  addStoredProduct,
  updateStoredProduct,
  deleteStoredProduct,
  setStoredUser,
} from './lib/supabaseClient';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [authDefaultPlan, setAuthDefaultPlan] = useState<PlanTier>('Growth');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedUser = getStoredUser();
    const loadedProducts = getStoredProducts();
    setUser(loadedUser);
    setProducts(loadedProducts);
    if (loadedProducts.length > 0) {
      setSelectedProduct(loadedProducts[0]);
    }
  }, []);

  const handleOpenAuthWithPlan = (tier: PlanTier) => {
    setAuthDefaultPlan(tier);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('reviewlens_user_profile');
    setUser(null);
    setCurrentView('landing');
  };

  const handleAddProductComplete = (newProduct: Product) => {
    const updated = addStoredProduct(newProduct);
    setProducts(updated);
    setSelectedProduct(newProduct);
    setCurrentView('dashboard');
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = deleteStoredProduct(productId);
    setProducts(updated);
    if (selectedProduct?.id === productId) {
      setSelectedProduct(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleReAnalyze = async (productToReanalyze: Product) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productToReanalyze.name,
          productUrl: productToReanalyze.asinOrUrl,
          reviewText: productToReanalyze.rawReviewCorpus,
        }),
      });
      const data = await res.json();
      if (data.data) {
        const updatedProduct: Product = {
          ...productToReanalyze,
          lastAnalyzedAt: new Date().toISOString(),
          latestAnalysis: data.data,
        };
        const updatedList = updateStoredProduct(updatedProduct);
        setProducts(updatedList);
        setSelectedProduct(updatedProduct);
      }
    } catch (err) {
      console.error('Re-analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (currentView === 'print' && selectedProduct) {
    return (
      <PrintableReportView
        product={selectedProduct}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        currentView={currentView}
        onSelectView={setCurrentView}
        productCount={products.length}
      />

      {/* Main Body */}
      {currentView === 'landing' ? (
        <LandingPage
          onStartDemo={() => {
            if (!user) {
              setIsAuthOpen(true);
            } else {
              setCurrentView('dashboard');
            }
          }}
          onSelectPlan={(tier) => {
            if (!user) {
              handleOpenAuthWithPlan(tier);
            } else {
              setCurrentView('billing');
            }
          }}
        />
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Dark Sidebar for App Navigation */}
          <Sidebar
            currentView={currentView}
            onSelectView={setCurrentView}
            user={user}
            onOpenAddProduct={() => setIsAddProductOpen(true)}
            productCount={products.length}
          />

          {/* Main Dashboard Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#F1F5F9] overflow-y-auto min-h-[calc(100vh-4rem)]">
            {currentView === 'dashboard' && (
              <DashboardView
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
                onOpenAddProduct={() => setIsAddProductOpen(true)}
                onReAnalyze={handleReAnalyze}
                onOpenPrintView={() => setCurrentView('print')}
                onDeleteProduct={handleDeleteProduct}
                isAnalyzing={isAnalyzing}
              />
            )}

            {currentView === 'competitor' && (
              <CompetitorView
                user={user}
                products={products}
                onSelectPlan={(tier) => {
                  if (user) {
                    const updated = { ...user, planTier: tier };
                    setUser(updated);
                    setStoredUser(updated);
                  } else {
                    handleOpenAuthWithPlan(tier);
                  }
                }}
              />
            )}

            {currentView === 'history' && (
              <ReportHistoryView
                products={products}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('dashboard');
                }}
                onReAnalyze={handleReAnalyze}
                onDeleteProduct={handleDeleteProduct}
                isAnalyzing={isAnalyzing}
              />
            )}

            {currentView === 'billing' && (
              <BillingView
                user={user}
                productCount={products.length}
                onUpdateUser={setUser}
              />
            )}
          </main>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultPlan={authDefaultPlan}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAnalyzeComplete={handleAddProductComplete}
      />
    </div>
  );
}
