import { UserProfile, Product, PlanTier, isPlatformOwner } from '../types';

const LOCAL_STORAGE_KEY_USER = 'reviewlens_user_profile';
const LOCAL_STORAGE_KEY_PRODUCTS = 'reviewlens_products';

export function getStoredUser(): UserProfile | null {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return null;
}

export function setStoredUser(user: UserProfile): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
}

export function getStoredProducts(): Product[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
  if (stored !== null) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return [];
}

export function setStoredProducts(products: Product[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

export function addStoredProduct(newProduct: Product): Product[] {
  const current = getStoredProducts();
  const updated = [newProduct, ...current];
  setStoredProducts(updated);
  return updated;
}

export function updateStoredProduct(updatedProduct: Product): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
  setStoredProducts(updated);
  return updated;
}

export function deleteStoredProduct(productId: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  setStoredProducts(updated);
  return updated;
}

export function updatePlanTierInStorage(newTier: PlanTier): UserProfile | null {
  const user = getStoredUser();
  if (!user) return null;
  const updated = { ...user, planTier: newTier };
  setStoredUser(updated);
  return updated;
}

export function getTierProductLimit(tier: PlanTier, email?: string): number {
  if (email && isPlatformOwner({ email } as UserProfile)) {
    return 999999;
  }
  switch (tier) {
    case 'Starter':
      return 1;
    case 'Growth':
      return 5;
    case 'Pro':
      return 999999;
    default:
      return 1;
  }
}
