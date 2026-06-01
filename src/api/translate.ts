import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

interface TranslateRequest {
  text: string;
  targetLang: string;
}

interface TranslateResponse {
  translatedText: string;
}

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text.trim()) return "";
  try {
    const translateCallable = httpsCallable<TranslateRequest, TranslateResponse>(
      functions,
      "translateTextSecure"
    );
    const result = await translateCallable({ text, targetLang });
    return result.data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to translate text.");
  }
};
