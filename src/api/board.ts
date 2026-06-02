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
import type { BoardMember } from "@/types";

export const getBoardMembers = async (): Promise<BoardMember[]> => {
  const q = query(collection(db, "boardMembers"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as BoardMember[];
};

export const createBoardMember = async (
  memberData: Omit<BoardMember, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "boardMembers"), memberData);
  return docRef.id;
};

export const updateBoardMember = async (
  id: string,
  memberData: Partial<BoardMember>
): Promise<void> => {
  await updateDoc(doc(db, "boardMembers", id), memberData);
};

export const deleteBoardMember = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "boardMembers", id));
};
