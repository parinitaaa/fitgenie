import express from "express";
const router = express.Router();
import { 
  createNotificationFromOutfit,
  getNotifications,
  markAsRead    
} from "../services/notification.service.js";



router.get("/", (req, res) => {
  const notes = getNotifications();
  res.json(notes);
});

router.post("/generate", (req, res) => {
  try {
    const note = createNotificationFromOutfit();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/read/:id", (req, res) => {
  markAsRead(req.params.id);
  res.json({ success: true });
});

export default router;