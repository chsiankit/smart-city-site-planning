import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  isFirebaseConfigured,
  AppUser,
  firebaseSignIn,
  firebaseSignUp,
  firebaseGoogleSignIn,
  firebaseSignOut,
  firebaseResetPassword,
  getCurrentLocalUser,
  setLocalUser,
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<AppUser>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Urban Planner',
            photoURL: fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
            role: 'Urban Planner / Architect',
            createdAt: fbUser.metadata.creationTime,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Load fallback local session
      const local = getCurrentLocalUser();
      setUser(local);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const u = await firebaseSignIn(email, pass);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const u = await firebaseSignUp(email, pass, name);
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const u = await firebaseGoogleSignIn();
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await firebaseResetPassword(email);
  };

  const updateProfileData = async (updates: Partial<AppUser>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setLocalUser(updatedUser);
  };

  const deleteAccount = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfileData,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
