import { useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthContext } from "./authContext";
import type { AppUser } from "./types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setAppUser(userDoc.data() as AppUser);
          } else {
            // Document doesn't exist, this is a new signup
            // Default them to unapproved
            const newUser: AppUser = {
              uid: user.uid,
              email: user.email,
              role: "admin", // By default trying to be an admin
              isApproved: false, // Must be approved by superadmin
            };
            // Note: We don't automatically setDoc here during auth state change, 
            // the Signup page should handle database creation so we catch errors there.
            setAppUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, appUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
