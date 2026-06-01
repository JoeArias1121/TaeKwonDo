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
import type { GalleryItem } from "@/types";

export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const q = query(collection(db, "gallery"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as GalleryItem[];
};

export const createGalleryItem = async (
  itemData: Omit<GalleryItem, "id">,
): Promise<string> => {
  const docRef = await addDoc(collection(db, "gallery"), itemData);
  return docRef.id;
};

export const updateGalleryItem = async (
  id: string,
  itemData: Partial<GalleryItem>,
): Promise<void> => {
  await updateDoc(doc(db, "gallery", id), itemData);
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "gallery", id));
};
