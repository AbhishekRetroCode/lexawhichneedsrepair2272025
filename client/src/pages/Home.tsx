import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import ContentPreview from "@/components/ContentPreview";
import ContentAnalyzer from "@/components/ContentAnalyzer";
import ContentEnhancer from "@/components/ContentEnhancer";
import ContentVariations from "@/components/ContentVariations";
import CollapsibleSection from "@/components/CollapsibleSection";
import ModelSelector from "@/components/ModelSelector";
import ApiKeyManager from "@/components/ApiKeyManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface ContentItem {
  id: string;
  content: string;
  contentType: string;
  writingStyle: string;
  timestamp: Date;
}

const Home = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState("paragraph");
  const [writingStyle, setWritingStyle] = useState("professional");
  const [currentTopic, setCurrentTopic] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");

  const [expandedSections, setExpandedSections] = useState({
    models: true,
    quickActions: true,
    analyzer: false,
    enhancer: false,
    variations: false,
  });

  const toggleSection = (section: keyof typeof expandedSections, expanded: boolean) => {
    setExpandedSections(prev => ({ ...prev, [section]: expanded }));
  };

  const handleContentGenerate = (content: string, type: string, style: string, topic?: string) => {
    setGeneratedContent(content);
    setContentType(type);
    setWritingStyle(style);
    if (topic) setCurrentTopic(topic);
  };

  const handleQuickAction = (action: { contentType: string; writingStyle: string; prompt: string }) => {
    setContentType(action.contentType);
    setWritingStyle(action.writingStyle);
    setCurrentTopic(action.prompt);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-4xl font-bold heading-font heading-gradient mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Writtus
          </motion.h1>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create professional, engaging content with AI-powered tools and advanced customization
          </motion.p>
        </div>

        <div className="space-y-6">
          {/* Configuration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Content Configuration
                </CardTitle>
                <CardDescription>Configure your content generation settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
              <ConfigurationPanel 
                onGenerate={handleContentGenerate}
                setIsGenerating={setIsGenerating}
                isGenerating={isGenerating}
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                onProviderChange={setSelectedProvider}
                onModelChange={setSelectedModel}
              />
            </CardContent>
          </Card>
          </motion.div>

          {/* AI Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle>AI Model Selection</CardTitle>
              <CardDescription>Choose your preferred AI provider and model</CardDescription>
            </CardHeader>
            <CardContent>
              <ModelSelector
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                onProviderChange={setSelectedProvider}
                onModelChange={setSelectedModel}
              />
            </CardContent>
          </Card>

          {/* API Key Management (show only when OpenRouter is selected) */}
          {selectedProvider === 'openrouter' && (
            <Card>
              <CardHeader>
                <CardTitle>OpenRouter API Key Configuration</CardTitle>
                <CardDescription>Configure your OpenRouter API key to enable content generation</CardDescription>
              </CardHeader>
              <CardContent>
                <ApiKeyManager />
              </CardContent>
            </Card>
          )}

          {/* Generated Content */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>Your AI-generated content will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentPreview 
                content={generatedContent}
                isGenerating={isGenerating}
              />
            </CardContent>
          </Card>

          {/* Content Analysis Tools */}
          {generatedContent && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Content Analysis</CardTitle>
                  <CardDescription>Analyze your generated content for insights and improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentAnalyzer content={generatedContent} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Enhancement</CardTitle>
                  <CardDescription>Enhance and improve your content with AI suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentEnhancer 
                    content={generatedContent}
                    onEnhancedContent={(enhancedContent: string) => setGeneratedContent(enhancedContent)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Variations</CardTitle>
                  <CardDescription>Generate different variations of your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentVariations 
                    content={generatedContent}
                    originalTopic={currentTopic}
                    contentType={contentType}
                    onVariationGenerated={(variation: string, type: string, style: string) => {
                      setGeneratedContent(variation);
                      setContentType(type);
                      setWritingStyle(style);
                    }}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;