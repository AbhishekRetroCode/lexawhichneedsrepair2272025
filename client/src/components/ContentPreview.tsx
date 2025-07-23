
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { loadingMessages } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import ContentStats from "./ContentStats";
import LoadingSpinner from "./LoadingSpinner";
import { Palette, Type, Bold, Download, Copy } from "lucide-react";

interface ContentPreviewProps {
  content: string | null;
  isGenerating: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ content, isGenerating }) => {
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [showFontControls, setShowFontControls] = useState(false);
  const { toast } = useToast();

  // Font customization state
  const [fontFamily, setFontFamily] = useState("inter");
  const [fontSize, setFontSize] = useState([16]);
  const [fontWeight, setFontWeight] = useState("400");
  const [textColor, setTextColor] = useState("#374151");
  const [lineHeight, setLineHeight] = useState([1.6]);

  useEffect(() => {
    if (isGenerating) {
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

  const fontFamilies = [
    { value: "inter", label: "Inter", class: "font-sans" },
    { value: "crimson", label: "Crimson Text", class: "font-serif" },
    { value: "playfair", label: "Playfair Display", class: "font-serif" },
    { value: "courier", label: "Courier New", class: "font-mono" },
    { value: "georgia", label: "Georgia", class: "font-serif" },
    { value: "arial", label: "Arial", class: "font-sans" }
  ];

  const fontWeights = [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi Bold" },
    { value: "700", label: "Bold" }
  ];

  const textColors = [
    { value: "#374151", label: "Gray 700", class: "bg-gray-700" },
    { value: "#111827", label: "Gray 900", class: "bg-gray-900" },
    { value: "#1f2937", label: "Gray 800", class: "bg-gray-800" },
    { value: "#4b5563", label: "Gray 600", class: "bg-gray-600" },
    { value: "#dc2626", label: "Red", class: "bg-red-600" },
    { value: "#059669", label: "Green", class: "bg-green-600" },
    { value: "#2563eb", label: "Blue", class: "bg-blue-600" },
    { value: "#7c3aed", label: "Purple", class: "bg-purple-600" },
    { value: "#ea580c", label: "Orange", class: "bg-orange-600" }
  ];

  const getContentStyle = () => {
    const fontClass = fontFamilies.find(f => f.value === fontFamily)?.class || "font-sans";
    return {
      fontFamily: fontFamily === "inter" ? "Inter, sans-serif" :
                 fontFamily === "crimson" ? "Crimson Text, serif" :
                 fontFamily === "playfair" ? "Playfair Display, serif" :
                 fontFamily === "courier" ? "Courier New, monospace" :
                 fontFamily === "georgia" ? "Georgia, serif" :
                 fontFamily === "arial" ? "Arial, sans-serif" : "Inter, sans-serif",
      fontSize: `${fontSize[0]}px`,
      fontWeight: fontWeight,
      color: textColor,
      lineHeight: lineHeight[0]
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full min-h-[400px] flex flex-col transition-colors">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFontControls(!showFontControls)}
              className="text-gray-500 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
            >
              <Type className="h-4 w-4 mr-2" />
              Font Options
            </Button>
          </div>
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!content || isGenerating}
                className="text-gray-500 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                disabled={!content || isGenerating}
                className="text-gray-500 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download content</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Font Controls */}
        {showFontControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-100 dark:border-gray-700 p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-weight">Font Weight</Label>
                <Select value={fontWeight} onValueChange={setFontWeight}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <Select value={textColor} onValueChange={setTextColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {textColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded ${color.class}`}></div>
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={32}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="line-height">Line Height: {lineHeight[0]}</Label>
                <Slider
                  value={lineHeight}
                  onValueChange={setLineHeight}
                  max={2.5}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {!content && !isGenerating && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                id="empty-state" 
                className="flex flex-col items-center justify-center flex-1 text-center py-8"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="rounded-full bg-amber-100 dark:bg-amber-900 p-4 mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  Ready to Generate
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 dark:text-gray-300 max-w-md mb-6"
                >
                  Set your parameters and click "Generate Content" to create professional text using AI.
                </motion.p>
              </motion.div>
            )}
        
            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex items-center justify-center"
              >
                <LoadingSpinner size="lg" text={loadingMessage} />
              </motion.div>
            )}
            
            {content && !isGenerating && (
              <motion.div
                key="content" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 overflow-auto"
              >
                <div 
                  className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert"
                  style={getContentStyle()}
                >
                  {content.split('\n\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={getContentStyle()}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Content Statistics */}
      {content && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ContentStats content={content} />
        </motion.div>
      )}
    </div>
  );
};

export default ContentPreview;
