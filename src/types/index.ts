export type EventType =
  | "Competition"
  | "Fundraising"
  | "Ceremony"
  | "Seminar"
  | "Competición"
  | "Donación"
  | "Ceremonia"
  | "Seminario";

export interface EventLangMap {
  title: string;
  description: string;
  eventType: EventType;
}

export interface DojoEvent {
  id: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  en: EventLangMap;
  es: EventLangMap;
  sourceLang?: string;
}

export interface MemberLangMap {
  rank: string;
}

export interface DojoMember {
  id: string;
  name: string;
  joinDate: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  en: MemberLangMap;
  es: MemberLangMap;
  sourceLang?: string;
}

export interface BoardLangMap {
  role: string;
  bio: string;
  belt: string;
}

export interface PresidentData {
  name: string;
  imageUrl?: string;
  sourceLang?: string;
  updatedAt?: string;
  en: BoardLangMap;
  es: BoardLangMap;
}

export interface BoardMember {
  id: string;
  name: string;
  imageUrl: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  en: BoardLangMap;
  es: BoardLangMap;
  sourceLang?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  order: number; // 1 to 8
  createdAt?: string;
  updatedAt?: string;
}

