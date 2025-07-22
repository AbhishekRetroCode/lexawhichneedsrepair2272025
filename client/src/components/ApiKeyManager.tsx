import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const ApiKeyManager: React.FC = () => {
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleSaveKey = async () => {
    if (!openRouterKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenRouter API key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/save-key", {
        provider: "openrouter",
        apiKey: openRouterKey.trim(),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      toast({
        title: "API Key Saved",
        description: "OpenRouter API key has been securely saved.",
      });
      
      setOpenRouterKey(""); // Clear the input for security
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <span className="mr-2">🔑</span>
          API Key Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div>
          <Label className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2 block">
            OpenRouter API Key
          </Label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your OpenRouter API key..."
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="border-amber-300 dark:border-amber-700 flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSaveKey}
              disabled={!openRouterKey.trim() || isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <AlertDescription className="text-green-700 dark:text-green-300">
                  ✅ API key saved successfully! You can now use OpenRouter models.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 p-2 rounded">
          <strong>Note:</strong> Your API key is stored securely on the server and never exposed to the client.
          Get your free API key at <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;