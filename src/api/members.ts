import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DojoMember } from "@/types";

export const getMembers = async (): Promise<DojoMember[]> => {
  const q = query(collection(db, "members"), orderBy("joinDate", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as DojoMember[];
};

export const createMember = async (memberData: Omit<DojoMember, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "members"), memberData);
  return docRef.id;
};

export const updateMember = async (id: string, memberData: Partial<DojoMember>): Promise<void> => {
  await updateDoc(doc(db, "members", id), memberData);
};

export const deleteMember = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "members", id));
};
