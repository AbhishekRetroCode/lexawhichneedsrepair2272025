import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { loadingMessages } from "@/lib/constants";
import { motion } from "framer-motion";

interface ContentPreviewProps {
  content: string | null;
  isGenerating: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content, isGenerating }) => {
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const { toast } = useToast();

  useEffect(() => {
    if (isGenerating) {
      // Set a random loading message
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setLoadingMessage(loadingMessages[randomIndex]);
    }
  }, [isGenerating]);

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "The content has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!content) return;
    
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "generated-content.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "The content has been downloaded as a text file.",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 w-full min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Generated Content</h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            disabled={!content || isGenerating}
            className="text-gray-500 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
            </svg>
            <span className="sr-only">Copy to clipboard</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            disabled={!content || isGenerating}
            className="text-gray-500 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="sr-only">Download content</span>
          </Button>
        </div>
      </div>
      
      {!content && !isGenerating && (
        <div id="empty-state" className="flex flex-col items-center justify-center flex-1 text-center py-8">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
          <p className="text-gray-500 max-w-md mb-6">Set your parameters and click "Generate Content" to create professional text using Gemini AI.</p>
        </div>
      )}
      
      {isGenerating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
        >
          <div className="flex flex-col h-full">
            <div className="mb-4 text-center">
              <p className="text-primary font-medium">{loadingMessage}</p>
            </div>
            
            <div className="space-y-3 flex-1">
              {[...Array(10)].map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-${index % 2 === 0 ? 'full' : (11 - (index % 3)) + '/12'} h-4 bg-gray-100 rounded`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  style={{ 
                    backgroundImage: "linear-gradient(90deg, rgba(249, 250, 251, 0) 0%, rgba(149, 149, 149, 0.1) 50%, rgba(249, 250, 251, 0) 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite linear",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {content && !isGenerating && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-auto"
        >
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none typewriter-font">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContentPreview;
