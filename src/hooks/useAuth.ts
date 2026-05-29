import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      const localUserStr = localStorage.getItem('cakeurban_local_user');
      let localUserObj: any = null;
      if (localUserStr) {
        try {
          localUserObj = JSON.parse(localUserStr);
        } catch (e) {}
      }

      if (u) {
        setUser(u);
        const docRef = doc(db, 'users', u.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      } else if (localUserObj) {
        // Safe partial mock of User of Firebase for local-only account to prevent errors
        setUser({
          uid: localUserObj.uid,
          email: localUserObj.email,
          displayName: localUserObj.displayName,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => '',
          getIdTokenResult: async () => ({} as any),
          toJSON: () => ({})
        } as any);

        const docRef = doc(db, 'users', localUserObj.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          setProfile({
            uid: localUserObj.uid,
            displayName: localUserObj.displayName,
            email: localUserObj.email,
            role: localUserObj.role || 'customer'
          });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { 
    user, 
    profile, 
    loading, 
    isAdmin: user?.email === 'abhibroomies@gmail.com' 
  };
}
