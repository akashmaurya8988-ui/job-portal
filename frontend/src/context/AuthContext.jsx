"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid, currentUser = null) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else if (currentUser) {
        // Agar purane user ka Firestore doc nahi hai to starter student profile banayein
        const starterProfile = {
          uid,
          fullName: currentUser.displayName || "JobConnect User",
          email: currentUser.email || "",
          role: "student",
          phone: "",
          skills: [],
          education: "",
          profileImage: currentUser.photoURL || "",
          createdAt: serverTimestamp(),
        };
        await setDoc(docRef, starterProfile);
        setUserData(starterProfile);
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.uid, currentUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);