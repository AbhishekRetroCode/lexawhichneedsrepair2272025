import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { contentLengths } from "@/lib/constants";
import { extendedContentTypes, extendedWritingStyles } from "@/lib/extended-options";

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
  // State for content types and writing styles with custom options
  const [contentTypes, setContentTypes] = useState(extendedContentTypes);
  const [writingStyles, setWritingStyles] = useState(extendedWritingStyles);
  
  // Basic configuration state
  const [contentType, setContentType] = useState("paragraph");
  const [writingStyle, setWritingStyle] = useState("professional");
  const [contentLength, setContentLength] = useState("medium");
  const [customLength, setCustomLength] = useState("");
  const [topic, setTopic] = useState("");
  
  // Dropdown search and display state
  const [contentTypeSearch, setContentTypeSearch] = useState("");
  const [writingStyleSearch, setWritingStyleSearch] = useState("");
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const [showWritingStyleDropdown, setShowWritingStyleDropdown] = useState(false);
  
  // Custom type/style input state
  const [customContentTypeName, setCustomContentTypeName] = useState("");
  const [customWritingStyleName, setCustomWritingStyleName] = useState("");
  
  // Refs for detecting clicks outside dropdowns
  const contentTypeRef = useRef<HTMLDivElement>(null);
  const writingStyleRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentTypeRef.current && !contentTypeRef.current.contains(event.target as Node)) {
        setShowContentTypeDropdown(false);
      }
      
      if (writingStyleRef.current && !writingStyleRef.current.contains(event.target as Node)) {
        setShowWritingStyleDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle content generation
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a topic or content details.",
        variant: "destructive",
      });
      return;
    }

    // Handle custom length if selected
    let finalContentLength = contentLength;
    if (contentLength === "custom" && customLength.trim()) {
      finalContentLength = customLength.trim();
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest("POST", "/api/generate", {
        contentType,
        writingStyle,
        contentLength: finalContentLength,
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

  // Handle prompt enhancement
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
  
  // Filter content types based on search
  const filteredContentTypes = contentTypeSearch.toLowerCase() === "add custom" || contentTypeSearch.toLowerCase() === "custom"
    ? [...contentTypes, { value: "custom_new", label: "➕ Add Custom Content Type" }]
    : contentTypes.filter((type) => 
        type.label.toLowerCase().includes(contentTypeSearch.toLowerCase())
      );

  // Filter writing styles based on search
  const filteredWritingStyles = writingStyleSearch.toLowerCase() === "add custom" || writingStyleSearch.toLowerCase() === "custom"
    ? [...writingStyles, { value: "custom_new", label: "➕ Add Custom Writing Style" }]
    : writingStyles.filter((style) => 
        style.label.toLowerCase().includes(writingStyleSearch.toLowerCase())
      );

  // Get current content type label for display
  const getCurrentContentTypeLabel = () => {
    const type = contentTypes.find((t) => t.value === contentType);
    return type ? type.label : "Select content type";
  };

  // Get current writing style label for display
  const getCurrentWritingStyleLabel = () => {
    const style = writingStyles.find((s) => s.value === writingStyle);
    return style ? style.label : "Select writing style";
  };
  
  // Handle adding a custom content type
  const handleAddCustomContentType = () => {
    if (customContentTypeName.trim()) {
      const newValue = customContentTypeName.toLowerCase().replace(/\s+/g, "");
      if (!contentTypes.some((t) => t.value === newValue)) {
        setContentTypes((prev) => [...prev, { value: newValue, label: customContentTypeName.trim() }]);
        setContentType(newValue);
        setShowContentTypeDropdown(false);
        setContentTypeSearch("");
        setCustomContentTypeName("");
        toast({
          title: "Content type added",
          description: `Added "${customContentTypeName.trim()}" to content types.`,
        });
      }
    }
  };
  
  // Handle adding a custom writing style
  const handleAddCustomWritingStyle = () => {
    if (customWritingStyleName.trim()) {
      const newValue = customWritingStyleName.toLowerCase().replace(/\s+/g, "");
      if (!writingStyles.some((s) => s.value === newValue)) {
        setWritingStyles((prev) => [...prev, { value: newValue, label: customWritingStyleName.trim() }]);
        setWritingStyle(newValue);
        setShowWritingStyleDropdown(false);
        setWritingStyleSearch("");
        setCustomWritingStyleName("");
        toast({
          title: "Writing style added",
          description: `Added "${customWritingStyleName.trim()}" to writing styles.`,
        });
      }
    }
  };

  // Handle selecting a content type or custom option
  const handleContentTypeSelect = (type: { value: string, label: string }) => {
    if (type.value === "custom_new" || type.value === "customType") {
      setShowContentTypeDropdown(false);
      setContentTypeSearch("");
      
      // Show input modal for custom type
      const customName = window.prompt("Enter name for your custom content type:");
      if (customName && customName.trim()) {
        setCustomContentTypeName(customName.trim());
        handleAddCustomContentType();
      }
    } else {
      setContentType(type.value);
      setShowContentTypeDropdown(false);
      setContentTypeSearch("");
    }
  };

  // Handle selecting a writing style or custom option
  const handleWritingStyleSelect = (style: { value: string, label: string }) => {
    if (style.value === "custom_new" || style.value === "customStyle") {
      setShowWritingStyleDropdown(false);
      setWritingStyleSearch("");
      
      // Show input modal for custom style
      const customName = window.prompt("Enter name for your custom writing style:");
      if (customName && customName.trim()) {
        setCustomWritingStyleName(customName.trim());
        handleAddCustomWritingStyle();
      }
    } else {
      setWritingStyle(style.value);
      setShowWritingStyleDropdown(false);
      setWritingStyleSearch("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 w-full config-panel">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration</h2>
      
      <div className="mb-6">
        <Label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-2">Content Type</Label>
        <div className="search-select-container" ref={contentTypeRef}>
          <div 
            className="w-full p-2.5 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center"
            onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
          >
            <span>{getCurrentContentTypeLabel()}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {showContentTypeDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="p-2 border-b border-gray-200">
                <Input 
                  type="text" 
                  placeholder="Search content type or type 'custom'..." 
                  value={contentTypeSearch}
                  onChange={(e) => setContentTypeSearch(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredContentTypes.length > 0 ? (
                  filteredContentTypes.map((type) => (
                    <div 
                      key={type.value} 
                      className={`p-2.5 cursor-pointer hover:bg-gray-100 ${contentType === type.value ? 'bg-primary/10 text-primary' : ''} ${type.value === 'custom_new' ? 'font-medium text-primary' : ''}`}
                      onClick={() => handleContentTypeSelect(type)}
                    >
                      {type.label}
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 text-center text-gray-500">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="writing-style" className="block text-sm font-medium text-gray-700 mb-2">Writing Style / Tone</Label>
        <div className="search-select-container" ref={writingStyleRef}>
          <div 
            className="w-full p-2.5 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center"
            onClick={() => setShowWritingStyleDropdown(!showWritingStyleDropdown)}
          >
            <span>{getCurrentWritingStyleLabel()}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {showWritingStyleDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="p-2 border-b border-gray-200">
                <Input 
                  type="text" 
                  placeholder="Search writing style or type 'custom'..." 
                  value={writingStyleSearch}
                  onChange={(e) => setWritingStyleSearch(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredWritingStyles.length > 0 ? (
                  filteredWritingStyles.map((style) => (
                    <div 
                      key={style.value} 
                      className={`p-2.5 cursor-pointer hover:bg-gray-100 ${writingStyle === style.value ? 'bg-primary/10 text-primary' : ''} ${style.value === 'custom_new' ? 'font-medium text-primary' : ''}`}
                      onClick={() => handleWritingStyleSelect(style)}
                    >
                      {style.label}
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 text-center text-gray-500">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <Label htmlFor="content-length" className="block text-sm font-medium text-gray-700 mb-2">Content Length</Label>
        <div className="flex flex-wrap gap-2">
          {contentLengths.map((length) => (
            <button
              key={length.value}
              type="button"
              className={`content-length-btn ${contentLength === length.value ? 'active' : ''}`}
              onClick={() => setContentLength(length.value)}
              disabled={isGenerating}
            >
              {length.label}
            </button>
          ))}
        </div>
        
        {contentLength === "custom" && (
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Enter custom length (e.g., 500words, 3paragraphs)"
              value={customLength}
              onChange={(e) => setCustomLength(e.target.value)}
              disabled={isGenerating}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
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
