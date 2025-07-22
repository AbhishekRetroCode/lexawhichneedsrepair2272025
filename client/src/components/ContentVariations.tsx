import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContentVariationsProps {
  content: string | null;
  originalTopic: string;
  contentType: string;
  onVariationGenerated: (content: string, contentType: string, style: string) => void;
}

const ContentVariations: React.FC<ContentVariationsProps> = ({ 
  content, 
  originalTopic, 
  contentType,
  onVariationGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const variations = [
    {
      id: "shorter",
      label: "Shorter Version",
      icon: "📝",
      style: "concise",
      description: "Create a more concise version"
    },
    {
      id: "longer",
      label: "Detailed Version",
      icon: "📚",
      style: "detailed",
      description: "Add more depth and examples"
    },
    {
      id: "different-angle",
      label: "Different Angle",
      icon: "🔄",
      style: "alternative",
      description: "Approach from a new perspective"
    },
    {
      id: "engaging",
      label: "More Engaging",
      icon: "✨",
      style: "engaging",
      description: "Make it more captivating"
    }
  ];

  const generateVariation = async (variation: typeof variations[0]) => {
    if (!originalTopic) {
      toast({
        title: "No topic available",
        description: "Generate content first to create variations",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    let prompt = originalTopic;
    switch (variation.id) {
      case "shorter":
        prompt = `Create a shorter, more concise version of this content while keeping the key points: ${originalTopic}`;
        break;
      case "longer":
        prompt = `Create a more detailed, comprehensive version with examples and deeper insights: ${originalTopic}`;
        break;
      case "different-angle":
        prompt = `Approach this topic from a completely different perspective or angle: ${originalTopic}`;
        break;
      case "engaging":
        prompt = `Make this content more engaging, interesting, and captivating for readers: ${originalTopic}`;
        break;
    }

    try {
      const response = await apiRequest("POST", "/api/generate", {
        contentType,
        writingStyle: variation.style,
        contentLength: variation.id === "shorter" ? "short" : variation.id === "longer" ? "long" : "medium",
        topic: prompt
      });

      const data = await response.json();
      onVariationGenerated(data.generatedContent, contentType, variation.style);
      
      toast({
        title: "Variation created",
        description: `Generated ${variation.label.toLowerCase()}`
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">🎯</span>
              Content Variations
            </div>
            {isGenerating && (
              <Badge variant="secondary" className="animate-pulse">
                Generating...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!content || !originalTopic ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Generate content to create variations
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {variations.map((variation, index) => (
                <motion.div
                  key={variation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => generateVariation(variation)}
                    disabled={isGenerating}
                    className="w-full p-4 flex items-center justify-start space-x-3 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all h-auto"
                  >
                    <span className="text-2xl">{variation.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {variation.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {variation.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentVariations;