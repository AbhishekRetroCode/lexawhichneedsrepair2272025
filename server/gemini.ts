import { fetch } from "undici";

// Multiple API keys support with fallback mechanism
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY || "",
  process.env.GEMINI_API_KEY_2 || "",
  process.env.GEMINI_API_KEY_3 || "",
  process.env.API_KEY || "",
].filter(key => key.length > 0); // Remove empty keys

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

if (GEMINI_API_KEYS.length === 0) {
  console.warn("Warning: No Gemini API keys set. Gemini API requests will fail.");
}

// Function to try multiple API keys until one works
async function fetchWithFallbackKeys(url: string, options: any): Promise<any> {
  // Try each API key in sequence until one works
  let lastError: Error | undefined;
  
  console.log(`Starting request with ${GEMINI_API_KEYS.length} available API keys`);
  
  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const apiKey = GEMINI_API_KEYS[i];
    try {
      console.log(`Trying API key #${i+1}...`);
      const modifiedUrl = url.includes('?key=') ? url : `${url}?key=${apiKey}`;
      const response = await fetch(modifiedUrl, options);
      if (response.ok) {
        console.log(`API key #${i+1} succeeded!`);
        return response;
      }
      
      // If we got a response but it's not an auth error, don't try other keys
      if (response.status !== 401 && response.status !== 403) {
        console.log(`API key #${i+1} failed with status ${response.status}, but not trying other keys as it's not an auth error`);
        return response;
      }
      
      // Otherwise, capture the error and try the next key
      const errorText = await response.text();
      lastError = new Error(`Gemini API error (${response.status}): ${errorText}`);
      console.log(`API key #${i+1} failed with error (${response.status}): ${errorText}`);
      console.log('Trying next key...');
    } catch (error) {
      const err = error as Error;
      lastError = err;
      console.log(`API key #${i+1} failed with exception: ${err.message}`);
      console.log('Trying next key...');
    }
  }
  
  // If all keys failed, throw the last error
  console.log('All API keys failed!');
  throw lastError || new Error("All API keys failed");
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
    
    // Make API request with fallback keys
    const response = await fetchWithFallbackKeys(GEMINI_API_URL, {
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
    
    const response = await fetchWithFallbackKeys(GEMINI_API_URL, {
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
