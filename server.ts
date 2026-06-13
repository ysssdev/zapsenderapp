import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import axios from "axios";

dotenv.config();

// ==========================================
// Firebase Backend Initialization
// ==========================================
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
let db: any = null;

if (fs.existsSync(configPath)) {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    console.log("Firebase initialized in backend successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase in backend:", error);
  }
}

// ==========================================
// Evolution API Configuration
// ==========================================
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "global-api-key";

// ==========================================
// Queue System (In-Memory for Prototype)
// ==========================================
interface QueueItem {
  campaignId: string;
  contact: any;
  message: string;
  delayMin: number;
  delayMax: number;
  instanceName: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaName?: string;
}

const queue: QueueItem[] = [];
let isProcessing = false;

// In-memory progress tracker
const campaignProgress: Record<string, { sent: number, failed: number, total: number }> = {};

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  console.log(`[Queue] Started processing. Items in queue: ${queue.length}`);

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;

    // Calculate random delay between min and max (in milliseconds)
    const delay = Math.floor(Math.random() * (item.delayMax - item.delayMin + 1) + item.delayMin) * 1000;
    
    console.log(`[Queue] Waiting ${delay / 1000}s before sending to ${item.contact.phone}...`);
    await new Promise(resolve => setTimeout(resolve, delay));

    console.log(`[Queue] 🚀 Sending message to ${item.contact.phone} via instance ${item.instanceName}`);
    
    let success = false;
    try {
      if (item.mediaUrl) {
        console.log(`[Queue] Sending MEDIA message via sendMedia to ${item.contact.phone}`);
        const response = await axios.post(
          `${EVOLUTION_API_URL}/message/sendMedia/${item.instanceName}`,
          {
            number: item.contact.phone,
            options: {
              delay: 1200,
              presence: "composing"
            },
            mediaMessage: {
              mediatype: item.mediaType || "image",
              fileName: item.mediaName || "arquivo",
              caption: item.message,
              media: item.mediaUrl
            }
          },
          {
            headers: {
              'apikey': EVOLUTION_API_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`[Evolution API Media] Success:`, response.data);
      } else {
        // Call actual Evolution API SendText
        const response = await axios.post(
          `${EVOLUTION_API_URL}/message/sendText/${item.instanceName}`,
          {
            number: item.contact.phone,
            options: {
              delay: 1200,
              presence: "composing",
              linkPreview: false
            },
            textMessage: {
              text: item.message
            }
          },
          {
            headers: {
              'apikey': EVOLUTION_API_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log(`[Evolution API Text] Success:`, response.data);
      }
      success = true;
    } catch (error: any) {
      console.error(`[Evolution API] Error sending to ${item.contact.phone}:`, error.response?.data || error.message);
      success = false;
    }

    // Update in-memory progress
    if (!campaignProgress[item.campaignId]) {
      campaignProgress[item.campaignId] = { sent: 0, failed: 0, total: 0 };
    }
    
    if (success) {
      campaignProgress[item.campaignId].sent++;
    } else {
      campaignProgress[item.campaignId].failed++;
    }
    
    console.log(`[Queue] Campaign ${item.campaignId} Progress: ${campaignProgress[item.campaignId].sent} sent, ${campaignProgress[item.campaignId].failed} failed.`);
  }

  console.log(`[Queue] Finished processing all items.`);
  isProcessing = false;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // ==========================================
  // API Routes (Backend)
  // ==========================================
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ZapSender Backend is running!" });
  });

  // Evolution API Proxy Routes
  app.post("/api/instances/create", async (req, res) => {
    try {
      const { instanceName } = req.body;
      const response = await axios.post(
        `${EVOLUTION_API_URL}/instance/create`,
        {
          instanceName,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        },
        {
          headers: { 'apikey': EVOLUTION_API_KEY }
        }
      );
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.get("/api/instances/:instanceName/qrcode", async (req, res) => {
    try {
      const { instanceName } = req.params;
      const response = await axios.get(
        `${EVOLUTION_API_URL}/instance/connect/${instanceName}`,
        {
          headers: { 'apikey': EVOLUTION_API_KEY }
        }
      );
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  app.delete("/api/instances/:instanceName/logout", async (req, res) => {
    try {
      const { instanceName } = req.params;
      const response = await axios.delete(
        `${EVOLUTION_API_URL}/instance/logout/${instanceName}`,
        {
          headers: { 'apikey': EVOLUTION_API_KEY }
        }
      );
      res.json(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return res.json({ success: true, message: "Instance not found or already logged out" });
      }
      res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
    }
  });

  // Start Campaign Endpoint
  app.post("/api/campaigns/start", async (req, res) => {
    const { campaignId, contacts, message, delayMin, delayMax, instanceName, mediaUrl, mediaType, mediaName } = req.body;
    
    if (!campaignId || !contacts || !Array.isArray(contacts) || !instanceName) {
      return res.status(400).json({ error: 'Missing required fields (campaignId, contacts, instanceName)' });
    }

    console.log(`[API] Received request to start campaign ${campaignId} with ${contacts.length} contacts via ${instanceName}.`);

    // Initialize progress
    if (!campaignProgress[campaignId]) {
      campaignProgress[campaignId] = { sent: 0, failed: 0, total: contacts.length };
    } else {
      campaignProgress[campaignId].total += contacts.length;
    }

    // Add all contacts to the queue
    contacts.forEach((contact: any) => {
      queue.push({
        campaignId,
        contact,
        message: message || '',
        delayMin: delayMin || 10,
        delayMax: delayMax || 20,
        instanceName,
        mediaUrl,
        mediaType,
        mediaName
      });
    });

    // Trigger queue processing asynchronously
    processQueue();

    res.json({ 
      success: true, 
      message: `${contacts.length} messages added to the queue.`,
      queueLength: queue.length
    });
  });

  // Get Campaign Progress Endpoint
  app.get("/api/campaigns/:id/progress", (req, res) => {
    const { id } = req.params;
    const progress = campaignProgress[id] || { sent: 0, failed: 0, total: 0 };
    res.json(progress);
  });

  // ==========================================
  // Vite Middleware & SPA Fallback (Frontend)
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    // Development mode: Use Vite's middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve static files from dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Express v5 uses *all instead of *
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
