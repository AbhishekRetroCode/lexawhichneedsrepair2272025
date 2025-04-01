import { fetch, type Response } from "undici";
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Setup for local development
// Load environment variables from .env file if it exists (for local development)
try {
  // Check if a .env file exists in the project root
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    console.log('📁 Loading environment variables from .env file');
    dotenv.config({ path: envPath });
  }
} catch (err) {
  // Ignore error if .env file doesn't exist
}

// Hardcoded API key (only used as a last resort)
const HARDCODED_API_KEY = "AIzaSyDpOi0ubjgPZZ4SNP2Op4nJj0o1RlHIsa8"; 

// Priority order: 
// 1. GEMINI_API_KEY from environment variables
// 2. GEMINI_API_KEY_2 from environment variables
// 3. GEMINI_API_KEY_3 from environment variables
// 4. Hardcoded key as last resort
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 
                      process.env.GEMINI_API_KEY_2 || 
                      process.env.GEMINI_API_KEY_3 || 
                      HARDCODED_API_KEY;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Determine which source provided the API key
const apiKeySource = process.env.GEMINI_API_KEY 
  ? "GEMINI_API_KEY" 
  : process.env.GEMINI_API_KEY_2 
    ? "GEMINI_API_KEY_2" 
    : process.env.GEMINI_API_KEY_3 
      ? "GEMINI_API_KEY_3" 
      : "Hardcoded fallback";

// Log API key information for troubleshooting
console.log("🔑 Using API key source:", apiKeySource);
console.log("🔑 API key present:", GEMINI_API_KEY ? "Yes (length: " + GEMINI_API_KEY.length + ")" : "No");

if (!GEMINI_API_KEY) {
  console.warn("⚠️ Warning: No Gemini API key set. Gemini API requests will fail.");
}

/**
 * Enhanced fetch function with better error handling for API requests
 * @param url The API endpoint URL
 * @param options Fetch options including method, headers, and body
 * @returns Promise with the API response
 */
async function fetchWithApiKey(url: string, options: any): Promise<any> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error(
        "No API key available. Please set GEMINI_API_KEY in your environment variables or .env file."
      );
    }

    // Append API key to URL
    const modifiedUrl = url.includes('?key=') ? url : `${url}?key=${GEMINI_API_KEY}`;
    
    // Log request (for debugging, without showing the full API key)
    const keyPreview = GEMINI_API_KEY.substring(0, 4) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4);
    console.log(`🔄 API Request to: ${url.split('?')[0]} (using key: ${keyPreview})`);
    
    // Make the API request
    const response = await fetch(modifiedUrl, options);
    
    // Basic response logging
    console.log(`📡 API Response: ${response.status} ${response.statusText}`);
    
    return response;
  } catch (error) {
    // Enhanced error logging
    if (error instanceof Error) {
      console.error(`❌ API Request Error: ${error.message}`);
      if (error.stack) {
        console.debug(`Stack trace: ${error.stack}`);
      }
    } else {
      console.error("❌ Unknown API error:", error);
    }
    throw error;
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

/**
 * Generate content using the Gemini API
 */
export async function generateContent(
  contentType: string,
  writingStyle: string,
  contentLength: string,
  topic: string
): Promise<string> {
  try {
    // Prepare the prompt with all configuration parameters
    const prompt = constructGenerationPrompt(contentType, writingStyle, contentLength, topic);
    
    // Make API request with single API key
    const response = await fetchWithApiKey(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    
    // Check for content filtering
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content was blocked: ${data.promptFeedback.blockReason}`);
    }
    
    // Extract the generated text
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No content generated.");
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (error) {
    console.error("Error in generateContent:", error);
    throw error;
  }
}

/**
 * Enhance a user's prompt using the Gemini API
 */
export async function enhancePrompt(topic: string): Promise<string> {
  try {
    const prompt = `Slightly improve this content prompt to make it clearer: "${topic}".
    Add 1-2 relevant details while keeping it brief and simple.
    Make minimal changes - don't expand it significantly.
    Return only the enhanced prompt text without explanations or quotes.`;
    
    const response = await fetchWithApiKey(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content was blocked: ${data.promptFeedback.blockReason}`);
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No enhancement generated.");
    }
    
    const enhancedText = data.candidates[0].content.parts[0].text;
    return enhancedText;
  } catch (error) {
    console.error("Error in enhancePrompt:", error);
    throw error;
  }
}

/**
 * Construct a detailed prompt for the Gemini API
 */
function constructGenerationPrompt(
  contentType: string,
  writingStyle: string,
  contentLength: string,
  topic: string
): string {
  // Convert contentLength to appropriate format instructions
  let lengthInstruction = "";
  
  // Normalize the custom input - trim whitespace and convert to lowercase
  const normalizedLength = contentLength.trim().toLowerCase();
  
  // Match patterns like "500 words", "500words", "500 word", "500word"
  const wordMatch = normalizedLength.match(/(\d+)\s*(words?|word)/);
  // Match patterns like "3 paragraphs", "3paragraphs", "3 paragraph", "3paragraph"
  const paragraphMatch = normalizedLength.match(/(\d+)\s*(paragraphs?|paragraph)/);
  // Match patterns for sentences
  const sentenceMatch = normalizedLength.match(/(\d+)\s*(sentences?|sentence)/);
  
  if (wordMatch) {
    // Extract the number of words
    const wordCount = wordMatch[1];
    lengthInstruction = `approximately ${wordCount} words`;
  } else if (paragraphMatch) {
    // Extract the number of paragraphs
    const paragraphCount = paragraphMatch[1];
    lengthInstruction = `${paragraphCount} paragraphs`;
  } else if (sentenceMatch) {
    // Extract the number of sentences
    const sentenceCount = sentenceMatch[1];
    lengthInstruction = `${sentenceCount} sentences`;
  } else {
    // Handle standard content length options
    switch (normalizedLength) {
      case "tiny":
        lengthInstruction = "very brief and concise (around 50-100 words)";
        break;
      case "short":
        lengthInstruction = "brief and concise (around 150-250 words)";
        break;
      case "medium":
        lengthInstruction = "moderately detailed (around 300-500 words)";
        break;
      case "long":
        lengthInstruction = "comprehensive and detailed (around 700-1000 words)";
        break;
      default:
        // If custom value is just a number, assume it's the word count
        if (normalizedLength && !isNaN(Number(normalizedLength))) {
          lengthInstruction = `approximately ${normalizedLength} words`;
        } else {
          // If custom value doesn't match any pattern, use a moderate length
          lengthInstruction = "moderately detailed (around 300-500 words)";
        }
    }
  }

  let contentTypeDescription = "";
  
  // Map content type to description
  switch (contentType) {
    case "paragraph":
      contentTypeDescription = "a well-structured paragraph";
      break;
    case "email":
      contentTypeDescription = "a professional email";
      break;
    case "article":
      contentTypeDescription = "an informative article";
      break;
    case "blogPost":
      contentTypeDescription = "an engaging blog post";
      break;
    case "socialMediaPost":
      contentTypeDescription = "a captivating social media post";
      break;
    case "productDescription":
      contentTypeDescription = "a compelling product description";
      break;
    case "essay":
      contentTypeDescription = "a well-researched essay";
      break;
    case "story":
      contentTypeDescription = "an interesting story";
      break;
    default:
      contentTypeDescription = `a ${contentType}`;
  }

  // Construct the full prompt
  return `Create ${contentTypeDescription} about "${topic}" in a ${writingStyle} writing style with ${lengthInstruction}. 
  Make it engaging, well-structured, and appropriate for the selected content type and style.`;
}
