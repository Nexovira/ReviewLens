import { db, doc, getDoc, setDoc, onSnapshot } from './firebase';

export interface TierPrices {
  Starter: number;
  Growth: number;
  Pro: number;
}

export const DEFAULT_PRICES: TierPrices = {
  Starter: 3000,
  Growth: 8000,
  Pro: 15000,
};

const LOCAL_STORAGE_KEY = 'reviewlens_tier_prices';

export function getLocalTierPrices(): TierPrices {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading local tier prices:', err);
  }
  return DEFAULT_PRICES;
}

export async function fetchTierPricesFromFirestore(): Promise<TierPrices> {
  try {
    const docRef = doc(db, 'settings', 'pricing');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as TierPrices;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch pricing settings from Firestore, using local fallback:', err);
  }
  return getLocalTierPrices();
}

export async function saveTierPricesToFirestore(prices: TierPrices): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'pricing');
    await setDoc(docRef, prices, { merge: true });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prices));
  } catch (err) {
    console.error('Error saving pricing to Firestore:', err);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prices));
  }
}

export function subscribeToTierPrices(onUpdate: (prices: TierPrices) => void) {
  try {
    const docRef = doc(db, 'settings', 'pricing');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const prices = snap.data() as TierPrices;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prices));
        onUpdate(prices);
      } else {
        onUpdate(getLocalTierPrices());
      }
    }, (err) => {
      console.warn('Pricing snapshot notice:', err.message);
      onUpdate(getLocalTierPrices());
    });
  } catch (err) {
    onUpdate(getLocalTierPrices());
    return () => {};
  }
}

export function formatPriceNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
