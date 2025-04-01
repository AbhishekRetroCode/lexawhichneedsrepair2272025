import { fetch } from "undici";

// Get API key from environment variables with fallback
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

if (!GEMINI_API_KEY) {
  console.warn("Warning: GEMINI_API_KEY not set. Gemini API requests will fail.");
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
    
    // Make API request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
    const prompt = `Please enhance the following content prompt to make it more detailed and specific so it produces better results when used with an AI text generator: "${topic}".
    Your enhanced version should add relevant specifics, clarify the desired output format and style, and suggest some key points to include.
    Return only the enhanced prompt text without any explanations, prefixes or quotation marks.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
          maxOutputTokens: 1024,
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
  
  // Handle custom input that might still use the old format
  if (contentLength.includes("words")) {
    const wordCount = contentLength.replace("words", "");
    lengthInstruction = `approximately ${wordCount} words`;
  } else if (contentLength.includes("paragraphs")) {
    const paragraphCount = contentLength.replace("paragraphs", "");
    lengthInstruction = `${paragraphCount} paragraphs`;
  } else {
    // Handle new simplified content length options
    switch (contentLength) {
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
        // If a custom value that doesn't match any pattern, use it directly
        if (contentLength && !isNaN(Number(contentLength))) {
          lengthInstruction = `approximately ${contentLength} words`;
        } else {
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
