import admin from "firebase-admin";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This uses the Secret we injected into the GitHub Action environment
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountKey) {
  console.warn(
    "WARNING: FIREBASE_SERVICE_ACCOUNT not found. Make sure you are passing it in your GitHub Action.",
  );
}

const serviceAccount = serviceAccountKey ? JSON.parse(serviceAccountKey) : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  throw new Error("FIREBASE_SERVICE_ACCOUNT not found");
}

const db = admin.firestore();

async function fetchContent() {
  console.log("--- Fetching Site Content for SSG Build ---");
  const data = {
    events: [],
    members: [],
    president: null,
    boardMembers: [],
    gallery: [],
  };

  try {
    // 1. Fetch Events
    const eventsSnap = await db.collection("events").get();
    eventsSnap.forEach((doc) => {
      data.events.push({ id: doc.id, ...doc.data() });
    });

    // 2. Fetch Members
    const membersSnap = await db.collection("members").get();
    membersSnap.forEach((doc) => {
      data.members.push({ id: doc.id, ...doc.data() });
    });

    // 3. Fetch President Settings
    const presidentSnap = await db.collection("settings").doc("president").get();
    if (presidentSnap.exists) {
      data.president = presidentSnap.data();
    }

    // 4. Fetch Gallery Items (Sorted by order asc)
    const gallerySnap = await db.collection("gallery").orderBy("order", "asc").get();
    gallerySnap.forEach((doc) => {
      data.gallery.push({ id: doc.id, ...doc.data() });
    });

    // 5. Fetch Board Members (Sorted by order asc)
    const boardSnap = await db.collection("boardMembers").orderBy("order", "asc").get();
    boardSnap.forEach((doc) => {
      data.boardMembers.push({ id: doc.id, ...doc.data() });
    });

    // Create the data directory if it doesn't exist
    const dataDir = join(__dirname, "src", "data");
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    // Save the data to a JSON file that Vite can import
    writeFileSync(join(dataDir, "content.json"), JSON.stringify(data, null, 2));

    console.log(
      "--- Content baked into src/data/content.json successfully! ---",
    );
  } catch (error) {
    console.error("Error fetching Firestore data during prebuild:", error);
    process.exit(1);
  }
}

fetchContent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
