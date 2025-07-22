import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContentEnhancerProps {
  content: string | null;
  onEnhancedContent: (content: string) => void;
}

const ContentEnhancer: React.FC<ContentEnhancerProps> = ({ content, onEnhancedContent }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const enhancements = [
    {
      id: "expand",
      label: "Expand Content",
      description: "Add more detail and depth",
      icon: "📝",
      prompt: "Expand this content with more details, examples, and depth while maintaining the original tone and style:"
    },
    {
      id: "summarize",
      label: "Summarize",
      description: "Create a concise summary",
      icon: "📄",
      prompt: "Create a concise, well-structured summary of this content:"
    },
    {
      id: "improve",
      label: "Improve Flow",
      description: "Enhance readability and flow",
      icon: "✨",
      prompt: "Improve the flow, readability, and overall structure of this content while keeping the same meaning:"
    },
    {
      id: "formal",
      label: "Make Formal",
      description: "Convert to formal tone",
      icon: "👔",
      prompt: "Rewrite this content in a more formal, professional tone:"
    },
    {
      id: "casual",
      label: "Make Casual",
      description: "Convert to casual tone",
      icon: "😊",
      prompt: "Rewrite this content in a more casual, conversational tone:"
    },
    {
      id: "bullet",
      label: "Bullet Points",
      description: "Convert to bullet format",
      icon: "📋",
      prompt: "Convert this content into well-organized bullet points:"
    }
  ];

  const handleEnhance = async (enhancement: typeof enhancements[0]) => {
    if (!content) {
      toast({
        title: "No content",
        description: "Generate content first before enhancing",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);

    try {
      const response = await apiRequest("POST", "/api/generate", {
        contentType: "paragraph",
        writingStyle: "professional",
        contentLength: "medium",
        topic: `${enhancement.prompt}\n\n${content}`
      });

      const data = await response.json();
      onEnhancedContent(data.generatedContent);
      
      toast({
        title: "Content enhanced",
        description: `Successfully applied "${enhancement.label}" enhancement`
      });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">🚀</span>
              Content Enhancer
            </div>
            {isEnhancing && (
              <Badge variant="secondary" className="animate-pulse">
                Processing...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!content ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Generate content to access enhancement tools
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {enhancements.map((enhancement, index) => (
                <motion.div
                  key={enhancement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => handleEnhance(enhancement)}
                    disabled={isEnhancing}
                    className="w-full h-auto p-3 flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-center"
                  >
                    <span className="text-2xl">{enhancement.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {enhancement.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {enhancement.description}
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

export default ContentEnhancer;