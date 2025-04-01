import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateContent, enhancePrompt } from "./gemini";
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
      
      const { contentType, writingStyle, contentLength, topic } = validatedData.data;
      
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

  const httpServer = createServer(app);
  return httpServer;
}
