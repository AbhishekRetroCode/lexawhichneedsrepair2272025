import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { contentTypes, writingStyles, contentLengths } from "@/lib/constants";

interface ConfigurationPanelProps {
  onGenerate: (content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  isGenerating: boolean;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  onGenerate,
  setIsGenerating,
  isGenerating,
}) => {
  const [contentType, setContentType] = useState("paragraph");
  const [writingStyle, setWritingStyle] = useState("professional");
  const [contentLength, setContentLength] = useState("300words");
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a topic or content details.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest("POST", "/api/generate", {
        contentType,
        writingStyle,
        contentLength,
        topic,
      });
      
      const data = await response.json();
      onGenerate(data.generatedContent);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      onGenerate("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!topic.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a topic to enhance.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/enhance-prompt", {
        topic,
      });
      
      const data = await response.json();
      setTopic(data.enhancedPrompt);
      
      toast({
        title: "Prompt enhanced",
        description: "Your prompt has been improved for better results.",
      });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="lg:w-1/3 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Configuration</h2>
      
      <div className="mb-6">
        <Label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-2">Content Type</Label>
        <Select
          value={contentType}
          onValueChange={setContentType}
          disabled={isGenerating}
        >
          <SelectTrigger id="content-type" className="w-full">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="writing-style" className="block text-sm font-medium text-gray-700 mb-2">Writing Style</Label>
        <Select
          value={writingStyle}
          onValueChange={setWritingStyle}
          disabled={isGenerating}
        >
          <SelectTrigger id="writing-style" className="w-full">
            <SelectValue placeholder="Select writing style" />
          </SelectTrigger>
          <SelectContent>
            {writingStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="content-length" className="block text-sm font-medium text-gray-700 mb-2">Content Length</Label>
        <Select
          value={contentLength}
          onValueChange={setContentLength}
          disabled={isGenerating}
        >
          <SelectTrigger id="content-length" className="w-full">
            <SelectValue placeholder="Select content length" />
          </SelectTrigger>
          <SelectContent>
            {contentLengths.map((length) => (
              <SelectItem key={length.value} value={length.value}>
                {length.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="content-topic" className="block text-sm font-medium text-gray-700 mb-2">Content/Topic</Label>
        <div className="relative">
          <Textarea
            id="content-topic"
            rows={4}
            placeholder="Enter your topic or content details here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
          />
          <Button
            id="enhance-prompt"
            className="absolute bottom-3 right-3 text-xs px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium h-auto"
            onClick={handleEnhancePrompt}
            disabled={isGenerating || !topic.trim()}
            variant="ghost"
          >
            Enhance Prompt
          </Button>
        </div>
      </div>
      
      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={isGenerating || !topic.trim()}
      >
        <span>Generate Content</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Button>
    </div>
  );
};

export default ConfigurationPanel;
