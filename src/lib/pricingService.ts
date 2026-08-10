import { db, doc, getDoc, setDoc, onSnapshot } from './firebase';

export interface TierPrices {
  Starter: number;
  Growth: number;
  Pro: number;
}

export interface SystemSettings {
  trialsEnabled: boolean;
  trialDurationDays: number;
}

export const DEFAULT_PRICES: TierPrices = {
  Starter: 3000,
  Growth: 8000,
  Pro: 15000,
};

export const DEFAULT_SETTINGS: SystemSettings = {
  trialsEnabled: true,
  trialDurationDays: 7,
};

const LOCAL_STORAGE_PRICES_KEY = 'reviewlens_tier_prices';
const LOCAL_STORAGE_SETTINGS_KEY = 'reviewlens_system_settings';

export function getLocalTierPrices(): TierPrices {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRICES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading local tier prices:', err);
  }
  return DEFAULT_PRICES;
}

export function getLocalSystemSettings(): SystemSettings {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading local system settings:', err);
  }
  return DEFAULT_SETTINGS;
}

export async function fetchTierPricesFromFirestore(): Promise<TierPrices> {
  try {
    const docRef = doc(db, 'settings', 'pricing');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as TierPrices;
      localStorage.setItem(LOCAL_STORAGE_PRICES_KEY, JSON.stringify(data));
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
    localStorage.setItem(LOCAL_STORAGE_PRICES_KEY, JSON.stringify(prices));
  } catch (err) {
    console.error('Error saving pricing to Firestore:', err);
    localStorage.setItem(LOCAL_STORAGE_PRICES_KEY, JSON.stringify(prices));
  }
}

export function subscribeToTierPrices(onUpdate: (prices: TierPrices) => void) {
  try {
    const docRef = doc(db, 'settings', 'pricing');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const prices = snap.data() as TierPrices;
        localStorage.setItem(LOCAL_STORAGE_PRICES_KEY, JSON.stringify(prices));
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

export async function fetchSystemSettingsFromFirestore(): Promise<SystemSettings> {
  try {
    const docRef = doc(db, 'settings', 'system');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SystemSettings;
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch system settings from Firestore, using local fallback:', err);
  }
  return getLocalSystemSettings();
}

export async function saveSystemSettingsToFirestore(settings: SystemSettings): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'system');
    await setDoc(docRef, settings, { merge: true });
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving system settings to Firestore:', err);
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }
}

export function subscribeToSystemSettings(onUpdate: (settings: SystemSettings) => void) {
  try {
    const docRef = doc(db, 'settings', 'system');
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const settings = snap.data() as SystemSettings;
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
        onUpdate(settings);
      } else {
        onUpdate(getLocalSystemSettings());
      }
    }, (err) => {
      console.warn('System settings snapshot notice:', err.message);
      onUpdate(getLocalSystemSettings());
    });
  } catch (err) {
    onUpdate(getLocalSystemSettings());
    return () => {};
  }
}

export function formatPriceNaira(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₦0';
  }
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}
