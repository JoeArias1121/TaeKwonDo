import { onDocumentWritten } from "firebase-functions/v2/firestore";
import axios, { AxiosError } from "axios";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

// 1. Helper to poke GitHub Actions
const pokeGitHub = async () => {
  // USE EXACT CASING: JoeArias1121 / TaeKwonDo
  const repoOwner = "JoeArias1121";
  const repoName = "TaeKwonDo";
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.error(
      "GITHUB_TOKEN is missing. Make sure you added it to the Firebase Secret Manager.",
    );
    return;
  }

  try {
    await axios.post(
      `https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`,
      { event_type: "firestore_update" },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Firebase-Cloud-Function",
        },
      },
    );
    console.log("Successfully poked GitHub for a rebuild!");
  } catch (err) {
    const error = err as AxiosError;
    console.error("GitHub Poke Failed:", error.response?.data || error.message);
  }
};

// 2. Helper to translate text using Google Cloud Translation REST API
const translateText = async (
  text: string,
  targetLang: string = "es",
): Promise<string | null> => {
  const apiKey = process.env.TRANSLATION_API_KEY;
  if (!apiKey) {
    console.error(
      "TRANSLATION_API_KEY is missing. Add it to Firebase Secret Manager.",
    );
    return null;
  }

  if (!text) return text;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLang,
        format: "html", // Safe for both plain text and HTML
      },
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(
      "Translation failed:",
      (error as AxiosError).response?.data || (error as Error).message,
    );
    return null;
  }
};

// 3. Helper to handle document translation and triggering
const handleTranslationAndPoke = async (
  event: any,
  fieldsToTranslate: string[],
  usedLang: string = "en",
) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  // If document was deleted, just trigger build
  if (!after) {
    await pokeGitHub();
    return;
  }

  const lang = "en" === usedLang ? "es" : "en";

  // Create the updates object using the target language 'lang' (e.g. 'es' or 'en')
  const updates: Record<string, any> = {};
  updates[lang] = {};

  for (const field of fieldsToTranslate) {
    // Check if the source language field has changed (supporting both flat and nested objects safely)
    const beforeVal = before && before[usedLang] ? before[usedLang][field] : (before ? before[field] : undefined);
    const afterVal = after[usedLang] ? after[usedLang][field] : after[field];

    const isChanged = !before || beforeVal !== afterVal;

    // Check if the target translation is currently missing (Self-Healing for network errors)
    const isTargetMissing = !after[lang] || !after[lang][field];

    if ((isChanged || isTargetMissing) && afterVal) {
      const translated = await translateText(afterVal, lang);
      if (translated) {
        updates[lang][field] = translated;
      }
    } else if (isChanged && !afterVal) {
      // Clean up target translation if the source is cleared (Out-of-Sync Deletion)
      updates[lang][field] = admin.firestore.FieldValue.delete();
    }
  }

  // Check if we actually found any translations to update
  if (Object.keys(updates[lang]).length > 0) {
    console.log(`Translating fields to ${lang}:`, Object.keys(updates[lang]));
    await event.data?.after.ref.update(updates);
  } else {
    // Only poke github if we didn't just update the document
    await pokeGitHub();
  }
};

// 4. Trigger on Events changes
export const triggerBuildOnEvents = onDocumentWritten(
  {
    document: "events/{docId}",
    secrets: ["GITHUB_TOKEN", "TRANSLATION_API_KEY"],
  },
  async (event) => {
    const after = event.data?.after.data();
    const sourceLang = after?.sourceLang || "en";
    await handleTranslationAndPoke(event, ["title", "description"], sourceLang);
  },
);

// 5. Trigger on Members changes
export const triggerBuildOnMembers = onDocumentWritten(
  {
    document: "members/{docId}",
    secrets: ["GITHUB_TOKEN", "TRANSLATION_API_KEY"],
  },
  async (event) => {
    const after = event.data?.after.data();
    const sourceLang = after?.sourceLang || "en";
    await handleTranslationAndPoke(event, ["name", "rank"], sourceLang);
  },
);

// 6. Trigger on Settings (About Me) changes
export const triggerBuildOnSettings = onDocumentWritten(
  {
    document: "settings/{docId}",
    secrets: ["GITHUB_TOKEN", "TRANSLATION_API_KEY"],
  },
  async (event) => {
    const after = event.data?.after.data();
    const sourceLang = after?.sourceLang || "en";
    await handleTranslationAndPoke(event, ["title", "role", "bio"], sourceLang);
  },
);
