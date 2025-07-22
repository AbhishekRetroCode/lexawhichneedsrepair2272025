import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateContent, enhancePrompt } from "./gemini";
import { generateWithProvider } from "./providers";
import { GenerateContentRequest, EnhancePromptRequest } from "@shared/schema";

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


  const httpServer = createServer(app);
  return httpServer;
}