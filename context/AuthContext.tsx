import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signupWithEmail: (e: string, p: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateProfile: (name: string, avatarUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserWithFirestore(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserWithFirestore = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      let userSnap;
      try {
        userSnap = await getDoc(userRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        return;
      }
      
      if (userSnap && userSnap.exists()) {
        setUser(userSnap.data() as User);
      } else {
        // Create new user profile
        const newUser: User = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          company: '',
          plan: 'STARTER',
          credits: 0, // Initial credits for testing
          creditsUsedToday: 0,
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(userRef, newUser);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
          return;
        }
        setUser(newUser);
      }

      // Check if there are any contacts uploaded with their email address as the userId fallback
      if (firebaseUser.email) {
        try {
          const contactsRef = collection(db, 'contacts');
          const q = query(contactsRef, where('userId', '==', firebaseUser.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            console.log(`Mapping ${querySnapshot.size} contacts from fallback email ID to real UID: ${firebaseUser.uid}`);
            for (const contactDoc of querySnapshot.docs) {
              await updateDoc(doc(db, 'contacts', contactDoc.id), {
                userId: firebaseUser.uid
              });
            }
          }
        } catch (e) {
          console.error("Error migrating contacts:", e);
        }
      }
    } catch (error) {
      console.error("Error syncing user with Firestore:", error);
      // Fallback for UI if DB fails initially
      setUser({
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'Usuário',
        email: firebaseUser.email || '',
        company: '',
        plan: 'STARTER',
        credits: 0,
        creditsUsedToday: 0,
        createdAt: new Date().toISOString()
      } as User);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // We need to set the display name manually in our user object creation 
      // since createUserWithEmailAndPassword doesn't take a name parameter directly
      // The syncUserWithFirestore function will handle creating the document
      // Let's pass the name to syncUserWithFirestore by updating the user object temporarily
      // or we can just let syncUserWithFirestore use the email prefix if displayName is null
      
      // Update the user document directly here to ensure the name is saved
      const userRef = doc(db, 'users', userCredential.user.uid);
      const newUser: User = {
        id: userCredential.user.uid,
        uid: userCredential.user.uid,
        name: name || email.split('@')[0],
        email: email,
        company: '',
        plan: 'STARTER',
        credits: 0,
        creditsUsedToday: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, newUser);
      setUser(newUser);
    } catch (error) {
      console.error("Email signup failed:", error);
      throw error;
    }
  };

  const updateProfile = async (name: string, avatarUrl: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.id);
    try {
      const updatedData = {
        name,
        avatarUrl
      };
      await updateDoc(userRef, updatedData);
      setUser(prev => prev ? { ...prev, ...updatedData } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      loginWithEmail,
      signupWithEmail,
      logout,
      loading,
      updateProfile
    }}>
      {!loading && children}
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