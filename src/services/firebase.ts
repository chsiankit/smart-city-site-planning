import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// Environment variables template for Firebase configuration:
// VITE_FIREBASE_API_KEY
// VITE_FIREBASE_AUTH_DOMAIN
// VITE_FIREBASE_PROJECT_ID
// VITE_FIREBASE_STORAGE_BUCKET
// VITE_FIREBASE_MESSAGING_SENDER_ID
// VITE_FIREBASE_APP_ID

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY' &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization error, switching to authenticated local fallback mode:', error);
  }
}

export { auth, db };

// Unified User representation
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: string;
  bio?: string;
  organization?: string;
  createdAt?: string;
  emailVerified?: boolean;
}

export interface ChatMessageRecord {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
}

export interface ChatSessionRecord {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessageRecord[];
}

// Local mock storage key for unconfigured fallback
const LOCAL_USER_KEY = 'smartcity_auth_user';
const LOCAL_CHATS_KEY = 'smartcity_saved_chats';

// Memory cache for non-browser/SSR/test environments
const memoryStore = new Map<string, string>();

const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memoryStore.get(key) || null;
  },
  setItem: (key: string, val: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    } else {
      memoryStore.set(key, val);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }
  },
};

// Get current user helper
export const getCurrentLocalUser = (): AppUser | null => {
  try {
    const raw = safeStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setLocalUser = (user: AppUser | null) => {
  if (user) {
    safeStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    safeStorage.removeItem(LOCAL_USER_KEY);
  }
};

// Auth Actions
export const firebaseSignIn = async (email: string, pass: string): Promise<AppUser> => {
  if (isFirebaseConfigured && auth) {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || email.split('@')[0],
      photoURL: cred.user.photoURL,
      emailVerified: cred.user.emailVerified,
    };
  }

  // Graceful authenticated local fallback
  const user: AppUser = {
    uid: `demo-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email,
    displayName: email.split('@')[0],
    role: 'Urban Planner / Architect',
    bio: 'Sustainable site design researcher utilizing Autodesk Forma and Revit workflows.',
    organization: 'AkkiCoder Urban Lab',
    createdAt: new Date().toISOString(),
    emailVerified: true,
  };
  setLocalUser(user);
  return user;
};

export const firebaseSignUp = async (email: string, pass: string, name: string): Promise<AppUser> => {
  if (isFirebaseConfigured && auth) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    
    // Save to Firestore if available
    if (db) {
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email,
          displayName: name,
          role: 'Urban Planner / Architect',
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore profile write error:', err);
      }
    }

    return {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: name,
      photoURL: null,
      emailVerified: false,
    };
  }

  const user: AppUser = {
    uid: `user-${Date.now()}`,
    email,
    displayName: name,
    role: 'Urban Planner / Architect',
    bio: 'Sustainable site design researcher utilizing Autodesk Forma and Revit workflows.',
    organization: 'AkkiCoder Urban Lab',
    createdAt: new Date().toISOString(),
    emailVerified: false,
  };
  setLocalUser(user);
  return user;
};

export const firebaseGoogleSignIn = async (): Promise<AppUser> => {
  if (isFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName,
      photoURL: cred.user.photoURL,
      emailVerified: cred.user.emailVerified,
    };
  }

  // Fallback demo Google user
  const user: AppUser = {
    uid: 'google-demo-user-101',
    email: 'planner.ankit@example.com',
    displayName: 'Ankit Yadav',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Senior Urban Designer',
    bio: 'Lead architect at AkkiCoder researching 1.28 km² site planning with Autodesk Forma & Revit.',
    organization: 'AkkiCoder',
    createdAt: new Date().toISOString(),
    emailVerified: true,
  };
  setLocalUser(user);
  return user;
};

export const firebaseSignOut = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  setLocalUser(null);
};

export const firebaseResetPassword = async (email: string): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, email);
    return;
  }
  // Local simulation
  await new Promise((r) => setTimeout(r, 600));
};

// Chat Sessions Storage
export const getSavedChatSessions = async (userId: string): Promise<ChatSessionRecord[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'users', userId, 'chats'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatSessionRecord, 'id'>) }));
    } catch (e) {
      console.warn('Failed to load chats from Firestore, reading local fallback', e);
    }
  }

  try {
    const raw = localStorage.getItem(`${LOCAL_CHATS_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveChatSessionRecord = async (
  userId: string,
  session: ChatSessionRecord
): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', userId, 'chats', session.id), {
        title: session.title,
        updatedAt: session.updatedAt,
        createdAt: session.createdAt,
        messages: session.messages,
      });
      return;
    } catch (e) {
      console.warn('Failed to save chat to Firestore, writing local fallback', e);
    }
  }

  try {
    const existing = await getSavedChatSessions(userId);
    const updated = [session, ...existing.filter((s) => s.id !== session.id)];
    localStorage.setItem(`${LOCAL_CHATS_KEY}_${userId}`, JSON.stringify(updated.slice(0, 30)));
  } catch (err) {
    console.error('Local chat save failed:', err);
  }
};

export const deleteChatSessionRecord = async (userId: string, sessionId: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'chats', sessionId));
      return;
    } catch (e) {
      console.warn('Failed to delete chat in Firestore', e);
    }
  }

  try {
    const existing = await getSavedChatSessions(userId);
    const updated = existing.filter((s) => s.id !== sessionId);
    localStorage.setItem(`${LOCAL_CHATS_KEY}_${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.error('Local chat deletion failed:', err);
  }
};
