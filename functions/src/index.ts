import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import axios, { AxiosError } from "axios";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

// 1. Helper to poke GitHub Actions for static site rebuild
const pokeGitHub = async () => {
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

// 2. HTTPS Callable function to securely translate text from the frontend
export const translateTextSecure = onCall(
  {
    secrets: ["TRANSLATION_API_KEY"],
    enforceAppCheck: false,
    concurrency: 10,
  },
  async (request) => {
    // Basic auth check (only authenticated users of our web app should be able to call this)
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    const text = request.data?.text;
    const targetLang = request.data?.targetLang || "es";

    if (!text) {
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with a 'text' argument.",
      );
    }

    const apiKey = process.env.TRANSLATION_API_KEY;
    if (!apiKey) {
      throw new HttpsError(
        "failed-precondition",
        "TRANSLATION_API_KEY secret is missing on the server.",
      );
    }

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          q: text,
          target: targetLang,
          format: "text",
        },
      );
      const translatedText = response.data.data.translations[0].translatedText;
      return { translatedText };
    } catch (error) {
      console.error(
        "Translation API error:",
        (error as AxiosError).response?.data || (error as Error).message,
      );
      throw new HttpsError(
        "internal",
        "Failed to translate the text successfully.",
      );
    }
  },
);

// 3. Simplified build triggers: Just poke GitHub once on any write event (no double-writes!)
export const triggerBuildOnEvents = onDocumentWritten(
  {
    document: "events/{docId}",
    secrets: ["GITHUB_TOKEN"],
  },
  async () => {
    await pokeGitHub();
  },
);

export const triggerBuildOnMembers = onDocumentWritten(
  {
    document: "members/{docId}",
    secrets: ["GITHUB_TOKEN"],
  },
  async () => {
    await pokeGitHub();
  },
);

export const triggerBuildOnSettings = onDocumentWritten(
  {
    document: "settings/{docId}",
    secrets: ["GITHUB_TOKEN"],
  },
  async () => {
    await pokeGitHub();
  },
);
