import { db, collection, getDocs, onSnapshot } from './firebase';
import { UserProfile, Product } from '../types';

export interface PlatformMetrics {
  totalStores: number;
  totalProductsAnalyzed: number;
  totalReportsGenerated: number;
  estimatedMonthlyRevenue: number;
  tierBreakdown: {
    Starter: number;
    Growth: number;
    Pro: number;
  };
}

export interface ActivityLogItem {
  id: string;
  type: 'registration' | 'analysis' | 'product_added' | 'tier_change';
  title: string;
  details: string;
  timestamp: string;
}

export async function fetchAllRegisteredUsers(): Promise<UserProfile[]> {
  try {
    const querySnap = await getDocs(collection(db, 'users'));
    const users: UserProfile[] = [];
    querySnap.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() } as UserProfile);
    });
    if (users.length > 0) return users;
  } catch (err) {
    console.warn('Firestore fetch users error, checking local fallback:', err);
  }

  try {
    const localUserStr = localStorage.getItem('reviewlens_user_profile');
    if (localUserStr) {
      const u = JSON.parse(localUserStr) as UserProfile;
      return [u];
    }
  } catch (err) {
    console.error('Error reading local user profile:', err);
  }

  return [];
}

export async function fetchAllPlatformProducts(): Promise<Product[]> {
  try {
    const querySnap = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    querySnap.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });
    if (products.length > 0) return products;
  } catch (err) {
    console.warn('Firestore fetch products error:', err);
  }

  try {
    const localProdStr = localStorage.getItem('reviewlens_products');
    if (localProdStr) {
      return JSON.parse(localProdStr) as Product[];
    }
  } catch (err) {
    console.error('Error reading local products:', err);
  }

  return [];
}

export function subscribeToAdminData(
  onUsersUpdate: (users: UserProfile[]) => void,
  onProductsUpdate: (products: Product[]) => void
) {
  let unsubUsers = () => {};
  let unsubProducts = () => {};

  try {
    const usersQuery = collection(db, 'users');
    unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        users.push({ id: docSnap.id, ...docSnap.data() } as UserProfile);
      });
      onUsersUpdate(users);
    }, (err) => {
      console.warn('Users snap warning:', err);
    });

    const productsQuery = collection(db, 'products');
    unsubProducts = onSnapshot(productsQuery, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      onProductsUpdate(products);
    }, (err) => {
      console.warn('Products snap warning:', err);
    });
  } catch (err) {
    console.warn('Admin subscription error:', err);
  }

  return () => {
    unsubUsers();
    unsubProducts();
  };
}
