import { 
  auth, 
  db, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
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
  try {
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
    return profile;
  } catch (err: any) {
    console.warn('Firebase signUp error, attempting fallback profile save:', err);
    const code = err?.code || '';
    const msg = err?.message || '';
    if (code === 'auth/operation-not-allowed' || code === 'auth/unauthorized-domain' || msg.includes('operation-not-allowed') || msg.includes('unauthorized-domain')) {
      const fallbackProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        email: email,
        storeName: storeName || 'My E-Commerce Brand',
        planTier: planTier || 'Growth',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('reviewlens_user_profile', JSON.stringify(fallbackProfile));
      return fallbackProfile;
    }
    throw err;
  }
}

// Sign In with Email
export async function signInUser(email: string, pass: string): Promise<UserProfile> {
  try {
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
  } catch (err: any) {
    console.warn('Firebase signIn error, checking local fallback:', err);
    const code = err?.code || '';
    const msg = err?.message || '';
    if (code === 'auth/operation-not-allowed' || code === 'auth/unauthorized-domain' || msg.includes('operation-not-allowed') || msg.includes('unauthorized-domain')) {
      const savedUserStr = localStorage.getItem('reviewlens_user_profile');
      if (savedUserStr) {
        return JSON.parse(savedUserStr);
      }
      const fallbackProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        email: email,
        storeName: 'My E-Commerce Brand',
        planTier: 'Growth',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('reviewlens_user_profile', JSON.stringify(fallbackProfile));
      return fallbackProfile;
    }
    throw err;
  }
}

// Reset Password via Email
export async function resetUserPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Sign In with Google
export async function signInWithGoogleAuth(): Promise<UserProfile> {
  try {
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
    } else {
      localStorage.setItem('reviewlens_user_profile', JSON.stringify(profile));
    }

    return profile;
  } catch (err: any) {
    console.warn('Google Sign-In error, checking local fallback:', err);
    const code = err?.code || '';
    const msg = err?.message || '';
    if (code === 'auth/operation-not-allowed' || code === 'auth/unauthorized-domain' || msg.includes('operation-not-allowed') || msg.includes('unauthorized-domain')) {
      const savedUserStr = localStorage.getItem('reviewlens_user_profile');
      if (savedUserStr) {
        return JSON.parse(savedUserStr);
      }
      const fallbackProfile: UserProfile = {
        id: `google_${Date.now()}`,
        email: 'google_user@store.com',
        storeName: 'My E-Commerce Store',
        planTier: 'Growth',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('reviewlens_user_profile', JSON.stringify(fallbackProfile));
      return fallbackProfile;
    }
    throw err;
  }
}

// Sign Out
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Signout error:', err);
  }
  localStorage.removeItem('reviewlens_user_profile');
  localStorage.removeItem('reviewlens_products');
}

// Firestore Products Realtime Listener
export function subscribeToUserProducts(
  uid: string, 
  onProductsUpdated: (products: Product[]) => void
) {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    onProductsUpdated([]);
    return () => {};
  }

  try {
    const q = query(collection(db, 'products'), where('userId', '==', uid));
    return onSnapshot(q, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      localStorage.setItem('reviewlens_products', JSON.stringify(products));
      onProductsUpdated(products);
    }, (error) => {
      console.warn('Products snapshot notice:', error.message);
      onProductsUpdated([]);
    });
  } catch (err) {
    console.warn('Failed to set up products listener:', err);
    onProductsUpdated([]);
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
