import { onDocumentWritten } from "firebase-functions/v2/firestore";
import axios, { AxiosError } from "axios";

// 1. We create a single helper function to do the heavy lifting
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

// 2. Trigger on Events changes
export const triggerBuildOnEvents = onDocumentWritten(
  { document: "events/{docId}", secrets: ["GITHUB_TOKEN"] },
  async () => { await pokeGitHub(); }
);

// 3. Trigger on Members changes
export const triggerBuildOnMembers = onDocumentWritten(
  { document: "members/{docId}", secrets: ["GITHUB_TOKEN"] },
  async () => { await pokeGitHub(); }
);

// 4. Trigger on Settings (About Me) changes
export const triggerBuildOnSettings = onDocumentWritten(
  { document: "settings/{docId}", secrets: ["GITHUB_TOKEN"] },
  async () => { await pokeGitHub(); }
);
