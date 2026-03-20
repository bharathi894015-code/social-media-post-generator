import { useState, useCallback } from 'react';
import { db, storage } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveBrandKit = useCallback(async (userId: string, brandKit: any, logoFile?: File) => {
    console.log("[saveBrandKit] Starting save for user:", userId);
    setLoading(true);
    setError(null);
    try {
      let logoURL = brandKit.logoURL || '';
      
      if (logoFile) {
        console.log("[saveBrandKit] Detected logoFile. Uploading to Storage...");
        const logoRef = ref(storage, `logos/${userId}/${Date.now()}_${logoFile.name}`);
        const snapshot = await uploadBytes(logoRef, logoFile);
        console.log("[saveBrandKit] Logo uploaded. Getting download URL...");
        logoURL = await getDownloadURL(snapshot.ref);
        console.log("[saveBrandKit] Logo URL acquired:", logoURL);
      } else {
        console.log("[saveBrandKit] No logoFile provided. Skipping Storage upload.");
      }

      console.log("[saveBrandKit] Executing setDoc for BrandKit...");
      await setDoc(doc(db, "BrandKit", userId), {
        ...brandKit,
        logoURL,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log("[saveBrandKit] setDoc successful.");
      return { success: true, logoURL };
    } catch (err: any) {
      console.error("[saveBrandKit] ERROR caught:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      console.log("[saveBrandKit] Settled.");
      setLoading(false);
    }
  }, []);

  const getBrandKit = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, "BrandKit", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const savePost = useCallback(async (postData: any) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, "Posts"), {
        ...postData,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getPosts = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "Posts"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort client-side to avoid missing composite index error
      posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return posts.slice(0, 10);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveBrandKit, getBrandKit, savePost, getPosts, loading, error };
};
