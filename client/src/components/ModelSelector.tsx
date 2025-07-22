import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { openRouterModels, openRouterProviders } from "@/lib/openrouter-config";

interface ModelSelectorProps {
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedProvider, 
  selectedModel, 
  onProviderChange, 
  onModelChange 
}) => {
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [providerSearch, setProviderSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  const providerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  const providers = [
    {
      id: "gemini",
      name: "Google Gemini",
      models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"]
    },
    {
      id: "openai", 
      name: "OpenAI",
      models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]
    },
    ...openRouterProviders
  ];

  const currentProvider = providers.find(p => p.id === selectedProvider);
  const availableModels = currentProvider?.models || [];

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const filteredModels = availableModels.filter((model) => {
    if (!modelSearch.trim()) return true;
    const searchTerm = modelSearch.toLowerCase();
    return (
      model.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (providerRef.current && !providerRef.current.contains(event.target as Node)) {
        setShowProviderDropdown(false);
      }
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProviderSelect = (providerId: string) => {
    onProviderChange(providerId);
    setShowProviderDropdown(false);
    setProviderSearch("");

    // Auto-select first model when provider changes
    const provider = providers.find(p => p.id === providerId);
    if (provider && provider.models.length > 0) {
      onModelChange(provider.models[0]);
    }
  };

  const handleModelSelect = (model: string) => {
    onModelChange(model);
    setShowModelDropdown(false);
    setModelSearch("");
  };

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <span className="mr-2">⚡</span>
          AI Model Configuration
          <Badge variant="secondary" className="ml-auto text-xs">
            Multimodal
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Provider Selection */}
        <div>
          <Label className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2 block">
            AI Provider
          </Label>
          <div className="relative" ref={providerRef}>
            <Button
              variant="outline"
              onClick={() => setShowProviderDropdown(!showProviderDropdown)}
              className="w-full justify-between border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600"
            >
              <span className="flex items-center">
                {currentProvider?.icon} {currentProvider?.name || "Select Provider"}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            <AnimatePresence>
              {showProviderDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl"
                >
                  <div className="p-2 border-b border-amber-200 dark:border-amber-700">
                    <Input
                      type="text"
                      placeholder="Search providers..."
                      value={providerSearch}
                      onChange={(e) => setProviderSearch(e.target.value)}
                      className="border-amber-300 dark:border-amber-700"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider.id)}
                        className={`w-full p-3 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center space-x-2 ${
                          selectedProvider === provider.id ? 'bg-amber-100 dark:bg-amber-900/30' : ''
                        }`}
                      >
                        <span className="text-lg">{provider.icon}</span>
                        <span className="font-medium">{provider.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Separator className="bg-amber-200 dark:bg-amber-800" />

        {/* Model Selection */}
        <div>
          <Label className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2 block">
            Model
          </Label>
          <div className="relative" ref={modelRef}>
            <Button
              variant="outline"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              disabled={!currentProvider}
              className="w-full justify-between border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600 disabled:opacity-50"
            >
              <span className="truncate">
                {selectedModel || "Select Model"}
              </span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            <AnimatePresence>
              {showModelDropdown && currentProvider && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl"
                >
                  <div className="p-2 border-b border-amber-200 dark:border-amber-700">
                    <Input
                      type="text"
                      placeholder="Search models..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="border-amber-300 dark:border-amber-700"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => handleModelSelect(model)}
                        className={`w-full p-3 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 ${
                          selectedModel === model ? 'bg-amber-100 dark:bg-amber-900/30' : ''
                        }`}
                      >
                        <div className="font-mono text-sm">{model}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Model Info */}
        {selectedModel && (
          <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 p-2 rounded">
            <strong>Selected:</strong> {currentProvider?.name} • {selectedModel}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelSelector;