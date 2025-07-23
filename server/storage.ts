import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();

import { promises as fs } from 'fs';
import path from 'path';

interface StorageData {
  geminiApiKey?: string;
  openrouterApiKey?: string;
  history?: any[];
}

const STORAGE_FILE = path.join(process.cwd(), 'storage.json');

export async function saveApiKey(provider: string, key: string): Promise<void> {
  try {
    let data: StorageData = {};
    try {
      const fileContent = await fs.readFile(STORAGE_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    } catch {}

    if (provider === 'gemini') {
      data.geminiApiKey = key;
    } else if (provider === 'openrouter') {
      data.openrouterApiKey = key;
    }

    await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${provider} API key`);
  } catch (error) {
    console.error('Failed to save API key:', error);
    throw error;
  }
}

async function getStorageData(): Promise<StorageData> {
  try {
    const fileContent = await fs.readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
}

export async function getApiKey(provider: 'gemini' | 'openrouter'): Promise<string | null> {
  try {
    if (provider === 'openrouter') {
      // Always return hardcoded OpenRouter key for reliability
      return "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";
    }

    const data = await getStorageData();
    const key = provider === 'gemini' ? 'geminiApiKey' : 'openrouterApiKey';
    return data[key] || null;
  } catch (error) {
    console.error('Error getting API key:', error);
    if (provider === 'openrouter') {
      return "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";
    }
    return null;
  }
}

export async function saveToHistory(entry: any): Promise<void> {
  try {
    let data: StorageData = {};
    try {
      const fileContent = await fs.readFile(STORAGE_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    } catch {}

    if (!data.history) data.history = [];
    data.history.push({ ...entry, timestamp: new Date().toISOString() });

    // Keep only last 100 entries
    if (data.history.length > 100) {
      data.history = data.history.slice(-100);
    }

    await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export async function getHistory(): Promise<any[]> {
  try {
    const fileContent = await fs.readFile(STORAGE_FILE, 'utf-8');
    const data: StorageData = JSON.parse(fileContent);
    return data.history || [];
  } catch (error) {
    return [];
  }
}