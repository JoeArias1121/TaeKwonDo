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
      console.error("GITHUB_TOKEN is missing. Make sure you added it to the Firebase Secret Manager.");
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
        }
      );
      console.log("Successfully poked GitHub for a rebuild!");
    } catch (err) {
      const error = err as AxiosError;
      console.error("GitHub Poke Failed:", error.response?.data || error.message);
    }
};

// 2. Helper to translate text using Google Cloud Translation REST API
const translateText = async (text: string, targetLang: string = "es"): Promise<string | null> => {
  const apiKey = process.env.TRANSLATION_API_KEY;
  if (!apiKey) {
    console.error("TRANSLATION_API_KEY is missing. Add it to Firebase Secret Manager.");
    return null;
  }
  
  if (!text) return text;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: targetLang,
        format: "html" // Safe for both plain text and HTML
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation failed:", (error as AxiosError).response?.data || (error as Error).message);
    return null;
  }
};

// 3. Helper to handle document translation and triggering
const handleTranslationAndPoke = async (event: any, fieldsToTranslate: string[]) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  // If document was deleted, just trigger build
  if (!after) {
    await pokeGitHub();
    return;
  }

  const updates: Record<string, string> = {};

  for (const field of fieldsToTranslate) {
    const isChanged = !before || before[field] !== after[field];
    if (isChanged && after[field]) {
      const translated = await translateText(after[field], "es");
      if (translated) {
        updates[`${field}_es`] = translated;
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    // This will trigger onDocumentWritten again, but next time fields won't have changed.
    console.log("Translating fields:", Object.keys(updates));
    await event.data?.after.ref.update(updates);
  } else {
    // Only poke github if we didn't just update the document
    await pokeGitHub();
  }
};

// 4. Trigger on Events changes
export const triggerBuildOnEvents = onDocumentWritten(
  { document: "events/{docId}", secrets: ["GITHUB_TOKEN", "TRANSLATION_API_KEY"] },
  async (event) => { await handleTranslationAndPoke(event, ["title", "description"]); }
);

// 5. Trigger on Members changes
export const triggerBuildOnMembers = onDocumentWritten(
  { document: "members/{docId}", secrets: ["GITHUB_TOKEN", "TRANSLATION_API_KEY"] },
  async (event) => { await handleTranslationAndPoke(event, ["name", "rank", "bio"]); }
);

// 6. Trigger on Settings (About Me) changes
export const triggerBuildOnSettings = onDocumentWritten(
  { document: "settings/{docId}", secrets: ["GITHUB_TOKEN", "TRANSLATION_API_KEY"] },
  async (event) => { await handleTranslationAndPoke(event, ["title", "role", "bio"]); }
);

