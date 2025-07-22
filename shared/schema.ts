import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Schemas for API requests
export const GenerateContentRequest = z.object({
  contentType: z.string(),
  writingStyle: z.string(),
  contentLength: z.string(),
  topic: z.string().min(1, "Topic is required"),
  provider: z.string().optional(),
  model: z.string().optional(),
});

export const EnhancePromptRequest = z.object({
  topic: z.string().min(1, "Topic is required"),
});

export type GenerateContentRequestType = z.infer<typeof GenerateContentRequest>;
export type EnhancePromptRequestType = z.infer<typeof EnhancePromptRequest>;
