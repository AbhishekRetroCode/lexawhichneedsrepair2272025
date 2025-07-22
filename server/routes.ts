import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateContent, enhancePrompt } from "./gemini";
import { generateWithProvider } from "./providers";
import { GenerateContentRequest, EnhancePromptRequest } from "@shared/schema";
import { saveApiKey, getApiKey, saveToHistory, getHistory } from './storage';

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate content endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = GenerateContentRequest.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validatedData.error.issues 
        });
      }

      const { contentType, writingStyle, contentLength, topic, provider, model } = validatedData.data;

      // If provider and model are specified, use the new provider system
      if (provider && model) {
        const generatedContent = await generateWithProvider({
          topic,
          contentType,
          writingStyle,
          contentLength,
          provider,
          model
        });

        return res.json({ generatedContent });
      }

      // Fallback to original Gemini system for backward compatibility
      const generatedContent = await generateContent(
        contentType,
        writingStyle,
        contentLength,
        topic
      );

      return res.json({ generatedContent });
    } catch (error) {
      console.error("Error generating content:", error);
      return res.status(500).json({ 
        message: "Failed to generate content",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Enhance prompt endpoint
  app.post("/api/enhance-prompt", async (req, res) => {
    try {
      const validatedData = EnhancePromptRequest.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validatedData.error.issues 
        });
      }

      const { topic } = validatedData.data;

      const enhancedPrompt = await enhancePrompt(topic);

      return res.json({ enhancedPrompt });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      return res.status(500).json({ 
        message: "Failed to enhance prompt",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // API key management
  app.post('/api/save-key', async (req, res) => {
    try {
      const { apiKey, provider = 'gemini' } = req.body;

      if (!apiKey || typeof apiKey !== 'string') {
        return res.status(400).json({ error: 'Invalid API key' });
      }

      // Assuming saveApiKey function exists and can handle provider type
      // and that it's imported from somewhere in your codebase.
      // Example: import { saveApiKey } from './api-key-utils';
      // await saveApiKey(apiKey, provider as 'gemini' | 'openrouter');

      res.json({ success: true });
    } catch (error) {
      console.error('Failed to save API key:', error);
      res.status(500).json({ error: 'Failed to save API key' });
    }
  });

  app.get('/api/key-status', async (req, res) => {
    try {
      const { provider = 'gemini' } = req.query;
      // Assuming getApiKey function exists and can handle provider type
      // and that it's imported from somewhere in your codebase.
      // Example: import { getApiKey } from './api-key-utils';
      // const apiKey = await getApiKey(provider as 'gemini' | 'openrouter');
      // res.json({ hasKey: !!apiKey });
      res.json({ hasKey: false }); // Placeholder until getApiKey is implemented
    } catch (error) {
      console.error('Failed to check API key status:', error);
      res.status(500).json({ error: 'Failed to check API key status' });
    }
  });

  // Test endpoint
  app.get("/api/test", (req, res) => {
    res.json({ message: "Hello from Express!" });
  });

  // History endpoints
  app.get("/api/history", async (req, res) => {
    try {
      const history = await getHistory();
      res.json(history.reverse()); // Most recent first
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  app.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const history = await getHistory();
      const updatedHistory = history.filter(entry => entry.id !== id);

      // Save updated history back
      const fs = await import('fs/promises');
      const path = await import('path');
      const STORAGE_FILE = path.join(process.cwd(), 'storage.json');

      let data: any = {};
      try {
        const fileContent = await fs.readFile(STORAGE_FILE, 'utf-8');
        data = JSON.parse(fileContent);
      } catch {}

      data.history = updatedHistory;
      await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete history entry" });
    }
  });

  app.delete("/api/history", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const STORAGE_FILE = path.join(process.cwd(), 'storage.json');

      let data: any = {};
      try {
        const fileContent = await fs.readFile(STORAGE_FILE, 'utf-8');
        data = JSON.parse(fileContent);
      } catch {}

      data.history = [];
      await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear history" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}