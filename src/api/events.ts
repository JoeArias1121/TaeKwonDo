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
import type { DojoEvent } from "@/types";

export const getEvents = async (): Promise<DojoEvent[]> => {
  const q = query(collection(db, "events"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as DojoEvent[];
};

export const createEvent = async (eventData: Omit<DojoEvent, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "events"), eventData);
  return docRef.id;
};

export const updateEvent = async (id: string, eventData: Partial<DojoEvent>): Promise<void> => {
  await updateDoc(doc(db, "events", id), eventData);
};

export const deleteEvent = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "events", id));
};
