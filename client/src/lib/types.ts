export interface GenerateContentRequest {
  contentType: string;
  writingStyle: string;
  contentLength: string;
  topic: string;
}

export interface GenerateContentResponse {
  generatedContent: string;
}

export interface EnhancePromptRequest {
  topic: string;
}

export interface EnhancePromptResponse {
  enhancedPrompt: string;
}
