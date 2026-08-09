import { 
  auth, 
  db, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  onSnapshot,
  FirebaseUser
} from './firebase';
import { UserProfile, Product, PlanTier } from '../types';
import { SAMPLE_USER, SAMPLE_PRODUCTS } from '../data/sampleData';

// Save/Update User Profile in Firestore
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', profile.id);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem('reviewlens_user_profile', JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving user profile to Firestore:', err);
    localStorage.setItem('reviewlens_user_profile', JSON.stringify(profile));
  }
}

// Get User Profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.error('Error fetching user profile from Firestore:', err);
  }
  return null;
}

// Sign Up with Email
export async function signUpUser(
  email: string, 
  pass: string, 
  storeName: string, 
  planTier: PlanTier
): Promise<UserProfile> {
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  const uid = userCred.user.uid;
  const profile: UserProfile = {
    id: uid,
    email: email,
    storeName: storeName || 'My E-Commerce Brand',
    planTier: planTier || 'Growth',
    createdAt: new Date().toISOString()
  };

  await saveUserProfile(profile);

  // Seed initial sample product for new user if they have none
  try {
    const sampleProduct = {
      ...SAMPLE_PRODUCTS[0],
      id: `prod_${Date.now()}_1`,
      userId: uid
    };
    await saveProductToFirestore(sampleProduct, uid);
  } catch (e) {
    console.error('Error seeding initial product:', e);
  }

  return profile;
}

// Sign In with Email
export async function signInUser(email: string, pass: string): Promise<UserProfile> {
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  const uid = userCred.user.uid;
  let profile = await getUserProfile(uid);
  
  if (!profile) {
    profile = {
      id: uid,
      email: email,
      storeName: 'My E-Commerce Brand',
      planTier: 'Growth',
      createdAt: new Date().toISOString()
    };
    await saveUserProfile(profile);
  } else {
    localStorage.setItem('reviewlens_user_profile', JSON.stringify(profile));
  }
  return profile;
}

// Sign In with Google
export async function signInWithGoogleAuth(): Promise<UserProfile> {
  const res = await signInWithPopup(auth, googleProvider);
  const user = res.user;
  const uid = user.uid;
  let profile = await getUserProfile(uid);

  if (!profile) {
    profile = {
      id: uid,
      email: user.email || 'google_user@store.com',
      storeName: user.displayName ? `${user.displayName}'s Store` : 'My E-Commerce Store',
      planTier: 'Growth',
      createdAt: new Date().toISOString()
    };
    await saveUserProfile(profile);

    // Seed sample product
    try {
      const sampleProduct = {
        ...SAMPLE_PRODUCTS[0],
        id: `prod_${Date.now()}_1`,
        userId: uid
      };
      await saveProductToFirestore(sampleProduct, uid);
    } catch (e) {
      console.error('Error seeding initial product:', e);
    }
  } else {
    localStorage.setItem('reviewlens_user_profile', JSON.stringify(profile));
  }

  return profile;
}

// Sign Out
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Signout error:', err);
  }
  localStorage.removeItem('reviewlens_user_profile');
}

// Firestore Products Realtime Listener
export function subscribeToUserProducts(
  uid: string, 
  onProductsUpdated: (products: Product[]) => void
) {
  // If no user is authenticated with Firebase or if this is a demo user, use local cache/sample data
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    const cached = localStorage.getItem('reviewlens_products');
    if (cached) {
      try {
        onProductsUpdated(JSON.parse(cached));
      } catch {
        onProductsUpdated(SAMPLE_PRODUCTS);
      }
    } else {
      onProductsUpdated(SAMPLE_PRODUCTS);
    }
    return () => {};
  }

  try {
    const q = query(collection(db, 'products'), where('userId', '==', uid));
    return onSnapshot(q, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      if (products.length === 0) {
        // Fallback to local cache if empty
        const cached = localStorage.getItem('reviewlens_products');
        if (cached) {
          try {
            onProductsUpdated(JSON.parse(cached));
            return;
          } catch {}
        }
      } else {
        localStorage.setItem('reviewlens_products', JSON.stringify(products));
      }
      onProductsUpdated(products);
    }, (error) => {
      console.warn('Products snapshot notice:', error.message);
      const cached = localStorage.getItem('reviewlens_products');
      if (cached) {
        try { onProductsUpdated(JSON.parse(cached)); } catch {}
      } else {
        onProductsUpdated(SAMPLE_PRODUCTS);
      }
    });
  } catch (err) {
    console.warn('Failed to set up products listener:', err);
    return () => {};
  }
}

// Save Product to Firestore
export async function saveProductToFirestore(product: Product, uid: string): Promise<void> {
  try {
    const productRef = doc(db, 'products', product.id);
    const dataToSave = {
      ...product,
      userId: uid,
      updatedAt: new Date().toISOString()
    };
    await setDoc(productRef, dataToSave, { merge: true });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
  }
}

// Delete Product from Firestore
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
  }
}
