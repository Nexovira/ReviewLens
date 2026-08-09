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
      const data = docSnap.data() as UserProfile;
      if (data && data.email && !data.email.includes('lumina-commerce.com')) {
        users.push({ id: docSnap.id, ...data });
      }
    });
    if (users.length > 0) return users;
  } catch (err) {
    console.warn('Firestore fetch users notice:', err);
  }

  try {
    const localUserStr = localStorage.getItem('reviewlens_user_profile');
    if (localUserStr) {
      const u = JSON.parse(localUserStr) as UserProfile;
      if (u && u.email && !u.email.includes('lumina-commerce.com')) {
        return [u];
      }
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
      const data = docSnap.data() as Product;
      if (data && (!data.userId || !data.userId.includes('demo'))) {
        products.push({ id: docSnap.id, ...data });
      }
    });
    if (products.length > 0) return products;
  } catch (err) {
    console.warn('Firestore fetch products notice:', err);
  }

  try {
    const localProdStr = localStorage.getItem('reviewlens_products');
    if (localProdStr) {
      const prods = JSON.parse(localProdStr) as Product[];
      return prods.filter((p) => p.userId && !p.userId.includes('demo'));
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
        const data = docSnap.data() as UserProfile;
        if (data && data.email && !data.email.includes('lumina-commerce.com')) {
          users.push({ id: docSnap.id, ...data });
        }
      });
      onUsersUpdate(users);
    }, (err) => {
      console.warn('Users snap notice:', err);
    });

    const productsQuery = collection(db, 'products');
    unsubProducts = onSnapshot(productsQuery, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Product;
        if (data && (!data.userId || !data.userId.includes('demo'))) {
          products.push({ id: docSnap.id, ...data });
        }
      });
      onProductsUpdate(products);
    }, (err) => {
      console.warn('Products snap notice:', err);
    });
  } catch (err) {
    console.warn('Admin subscription notice:', err);
  }

  return () => {
    unsubUsers();
    unsubProducts();
  };
}
