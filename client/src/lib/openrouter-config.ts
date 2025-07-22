
// OpenRouter Models Configuration
export const openRouterModels = [
  // OpenAI Models
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "openai/gpt-4-turbo",
  "openai/gpt-3.5-turbo",
  "openai/gpt-4",
  
  // Anthropic Models
  "anthropic/claude-3.5-sonnet",
  "anthropic/claude-3-opus",
  "anthropic/claude-3-sonnet",
  "anthropic/claude-3-haiku",
  "anthropic/claude-2.1",
  "anthropic/claude-2",
  "anthropic/claude-instant-1",
  
  // Google Models
  "google/gemini-pro-1.5",
  "google/gemini-pro",
  "google/gemma-2-9b-it",
  "google/gemma-7b-it",
  
  // Meta Models
  "meta-llama/llama-3.1-405b-instruct",
  "meta-llama/llama-3.1-70b-instruct",
  "meta-llama/llama-3.1-8b-instruct",
  "meta-llama/llama-3-70b-instruct",
  "meta-llama/llama-3-8b-instruct",
  "meta-llama/codellama-34b-instruct",
  
  // Mistral Models
  "mistralai/mistral-large",
  "mistralai/mistral-medium",
  "mistralai/mistral-small",
  "mistralai/mixtral-8x7b-instruct",
  "mistralai/mixtral-8x22b-instruct",
  "mistralai/mistral-7b-instruct",
  
  // Cohere Models
  "cohere/command-r-plus",
  "cohere/command-r",
  "cohere/command",
  "cohere/command-light",
  
  // Other Popular Models
  "perplexity/llama-3.1-sonar-large-128k-online",
  "perplexity/llama-3.1-sonar-small-128k-online",
  "nvidia/nemotron-4-340b-instruct",
  "databricks/dbrx-instruct",
  "01-ai/yi-large",
  "qwen/qwen-2-72b-instruct",
  "microsoft/phi-3-medium-4k-instruct",
  "huggingfaceh4/zephyr-7b-beta"
];

export const openRouterProviders = [
  {
    id: "openrouter",
    name: "OpenRouter",
    models: openRouterModels
  }
];

// OpenRouter API Configuration
export const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";
export const OPENROUTER_SITE_URL = import.meta.env.VITE_SITE_URL || "https://writtus.replit.app";
export const OPENROUTER_APP_NAME = "Writtus";

// Default model selection
export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini";
