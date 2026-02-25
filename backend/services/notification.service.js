import fs from "fs";

const FILE = "data/notifications.json";
const OUTFIT_FILE = "data/outfit_recommendation.json";

function ensureFile() {
  if (!fs.existsSync("data")) fs.mkdirSync("data");
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
}

export function createNotificationFromOutfit() {
  ensureFile();

  if (!fs.existsSync(OUTFIT_FILE)) {
    throw new Error("outfit_recommendation.json not found");
  }

  const outfitData = JSON.parse(fs.readFileSync(OUTFIT_FILE, "utf-8"));

  const message = `Today's Outfit: ${outfitData.outfit.top}, ${outfitData.outfit.bottom}, ${outfitData.outfit.layer}. ${outfitData.reason}`;

  const list = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  const newNote = {
    id: Date.now(),
    message,
    read: false,
    time: new Date().toISOString()
  };

  list.push(newNote);
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));

  return newNote;
}

export function getNotifications() {
  ensureFile();
  const notifications = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  // return only the "message" from each notification
  return notifications.map(n => n.message);
}

export function markAsRead(id) {
  ensureFile();
  let list = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  list = list.map(n =>
    n.id == id ? { ...n, read: true } : n
  );
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}