import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AddProductModal } from './components/AddProductModal';
import { CompetitorView } from './components/CompetitorView';
import { ReportHistoryView } from './components/ReportHistoryView';
import { BillingView } from './components/BillingView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthModal } from './components/AuthModal';
import { PrintableReportView } from './components/PrintableReportView';
import { TourGuideModal } from './components/TourGuideModal';
import { UserProfile, Product, PlanTier } from './types';
import {
  getStoredUser,
  getStoredProducts,
  addStoredProduct,
  updateStoredProduct,
  deleteStoredProduct,
  setStoredUser,
} from './lib/supabaseClient';
import { auth, onAuthStateChanged } from './lib/firebase';
import { 
  getUserProfile, 
  saveUserProfile, 
  subscribeToUserProducts, 
  saveProductToFirestore, 
  deleteProductFromFirestore,
  logoutUser 
} from './lib/firebaseService';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [authDefaultPlan, setAuthDefaultPlan] = useState<PlanTier>('Growth');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          // Fallback if profile doc hasn't been written yet
          const fallback: UserProfile = {
            id: fbUser.uid,
            email: fbUser.email || 'user@store.com',
            storeName: fbUser.displayName || 'My E-Commerce Store',
            planTier: 'Growth',
            createdAt: new Date().toISOString()
          };
          setUser(fallback);
          saveUserProfile(fallback);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Realtime products subscription when user is logged in
  useEffect(() => {
    if (!user) {
      setProducts([]);
      setSelectedProduct(null);
      return;
    }

    const unsubProducts = subscribeToUserProducts(user.id, (fetchedProducts) => {
      setProducts(fetchedProducts);
      if (fetchedProducts.length > 0) {
        setSelectedProduct((prev) => {
          if (!prev) return fetchedProducts[0];
          const matched = fetchedProducts.find((p) => p.id === prev.id);
          return matched || fetchedProducts[0];
        });
      } else {
        setSelectedProduct(null);
      }
    });

    return () => unsubProducts();
  }, [user?.id]);

  const handleOpenAuthWithPlan = (tier: PlanTier) => {
    setAuthDefaultPlan(tier);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setCurrentView('landing');
  };

  const handleAddProductComplete = async (newProduct: Product) => {
    if (user) {
      await saveProductToFirestore(newProduct, user.id);
    } else {
      addStoredProduct(newProduct);
      setProducts(getStoredProducts());
    }
    setSelectedProduct(newProduct);
    setCurrentView('dashboard');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (user) {
      await deleteProductFromFirestore(productId);
    } else {
      const updated = deleteStoredProduct(productId);
      setProducts(updated);
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
        if (user) {
          await saveProductToFirestore(updatedProduct, user.id);
        } else {
          updateStoredProduct(updatedProduct);
          setProducts(getStoredProducts());
        }
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
        onOpenTour={() => setIsTourOpen(true)}
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
            onOpenTour={() => setIsTourOpen(true)}
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

            {currentView === 'admin' && (
              <AdminDashboardView
                currentUser={user}
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

      {/* Product Tour Guide Modal */}
      <TourGuideModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onStartAnalyzing={() => setIsAddProductOpen(true)}
      />
    </div>
  );
}
