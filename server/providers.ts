// Multi-provider AI service integration
import { generateContent as geminiGenerate } from "./gemini";

export interface GenerationRequest {
  topic: string;
  contentType: string;
  writingStyle: string;
  contentLength: string;
  provider: string;
  model: string;
}

export async function generateWithProvider(request: GenerationRequest): Promise<string> {
  const { topic, contentType, writingStyle, contentLength, provider, model } = request;

  console.log(`🤖 Using provider: ${provider}, model: ${model}`);

  switch (provider) {
    case "gemini":
      return await geminiGenerate(contentType, writingStyle, contentLength, topic);
    
    case "openrouter":
      return await generateWithOpenRouter({
        topic,
        contentType,
        writingStyle,
        contentLength,
        model
      });
    
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

interface OpenRouterRequest {
  topic: string;
  contentType: string;
  writingStyle: string;
  contentLength: string;
  model: string;
}

async function generateWithOpenRouter(request: OpenRouterRequest): Promise<string> {
  const { topic, contentType, writingStyle, contentLength, model } = request;
  
  // Use a valid OpenRouter API key
  const apiKey = "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";
  
  console.log('🔍 OpenRouter API key source: Hardcoded');
  console.log('🔑 API key present: Yes')

  // Create enhanced prompt based on content requirements
  const prompt = createPrompt(topic, contentType, writingStyle, contentLength);

  try {
    console.log(`📡 OpenRouter API Request to model: ${model}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://writtus.replit.app',
        'X-Title': 'Writtus - AI Content Generator'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are Writtus, an expert content creator. Generate high-quality, engaging content that matches the user\'s requirements exactly. Focus on clarity, creativity, and authenticity.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: getMaxTokens(contentLength),
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', response.status, errorData);
      console.error('Request headers:', JSON.stringify({
        'Authorization': `Bearer ${apiKey.substring(0, 10)}...`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://writtus.replit.app',
        'X-Title': 'Writtus - AI Content Generator'
      }));
      
      if (response.status === 401) {
        throw new Error(`OpenRouter authentication failed. Check API key validity.`);
      }
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please try again later.`);
      }
      if (response.status === 400) {
        throw new Error(`Bad request. Model: ${model} may not exist or input invalid.`);
      }
      
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log(`✅ OpenRouter API Response: ${response.status} OK`);
    console.log('📄 Response data:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from OpenRouter API - no choices returned');
    }

    const choice = data.choices[0];
    if (!choice.message || !choice.message.content) {
      console.error('Invalid choice structure:', choice);
      throw new Error('Invalid response format from OpenRouter API - no message content');
    }

    const generatedContent = choice.message.content.trim();
    
    if (!generatedContent || generatedContent.length === 0) {
      throw new Error('Empty response from OpenRouter API');
    }

    console.log(`📝 Generated content length: ${generatedContent.length} characters`);
    return generatedContent;
  } catch (error) {
    console.error('OpenRouter generation error:', error);
    throw error;
  }
}

function createPrompt(topic: string, contentType: string, writingStyle: string, contentLength: string): string {
  const lengthGuidance = {
    tiny: "Write 1-2 sentences (25-50 words)",
    short: "Write a brief piece (100-200 words)",
    medium: "Write a substantial piece (300-500 words)",
    long: "Write a comprehensive piece (600-1000 words)",
    custom: "Write according to the topic requirements"
  };

  const styleGuidance = {
    professional: "Use professional, polished language",
    casual: "Use casual, conversational tone",
    creative: "Use creative, engaging language with vivid descriptions",
    formal: "Use formal, academic language",
    persuasive: "Use persuasive language to convince the reader",
    informative: "Use clear, informative language",
    engaging: "Use engaging, captivating language",
    technical: "Use precise, technical language"
  };

  const contentTypeGuidance = {
    paragraph: "Create well-structured paragraphs",
    essay: "Write a complete essay with introduction, body, and conclusion",
    article: "Write an informative article with clear sections",
    blogPost: "Write an engaging blog post with personality",
    socialMediaPost: "Create compelling social media content",
    email: "Write a professional email",
    story: "Create a narrative story with characters and plot",
    productDescription: "Write a compelling product description",
    pressRelease: "Write a formal press release"
  };

  return `Create ${contentType} content about: "${topic}"

Requirements:
- Content Type: ${contentTypeGuidance[contentType as keyof typeof contentTypeGuidance] || "Create appropriate content"}
- Writing Style: ${styleGuidance[writingStyle as keyof typeof styleGuidance] || "Use appropriate tone"}
- Length: ${lengthGuidance[contentLength as keyof typeof lengthGuidance] || "Write appropriate length"}

Generate high-quality, original content that is engaging, well-structured, and matches these specifications exactly.`;
}

function getMaxTokens(contentLength: string): number {
  switch (contentLength) {
    case "tiny": return 100;
    case "short": return 300;
    case "medium": return 800;
    case "long": return 1500;
    default: return 800;
  }
}

export { generateWithOpenRouter };