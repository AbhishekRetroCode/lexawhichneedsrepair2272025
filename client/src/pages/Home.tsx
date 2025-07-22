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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section: Configuration and Tools Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Configuration Panel - Takes 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center heading-font">
                <span className="mr-2">⚙️</span>
                Configuration
              </h2>
              <ConfigurationPanel 
                onGenerate={handleContentGenerate}
                setIsGenerating={setIsGenerating}
                isGenerating={isGenerating}
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
              />
            </div>
          </div>

          {/* Tools and Analysis Panel - Takes 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center heading-font">
                <span className="mr-2">🛠️</span>
                Tools & Analysis
              </h2>

              <div className="space-y-4">
                <CollapsibleSection
                  title="AI Model Selection"
                  icon="⚡"
                  isExpanded={expandedSections.models}
                  onToggle={(expanded) => toggleSection('models', expanded)}
                  variant="accent"
                >
                  <ModelSelector
                    selectedProvider={selectedProvider}
                    selectedModel={selectedModel}
                    onProviderChange={setSelectedProvider}
                    onModelChange={setSelectedModel}
                  />
                </CollapsibleSection>

                

                {generatedContent && (
                  <>
                    <CollapsibleSection
                      title="Content Analysis"
                      icon="📊"
                      isExpanded={expandedSections.analyzer}
                      onToggle={(expanded) => toggleSection('analyzer', expanded)}
                      variant="secondary"
                    >
                      <ContentAnalyzer content={generatedContent} />
                    </CollapsibleSection>

                    <CollapsibleSection
                      title="Content Enhancement"
                      icon="✨"
                      isExpanded={expandedSections.enhancer}
                      onToggle={(expanded) => toggleSection('enhancer', expanded)}
                      variant="secondary"
                    >
                      <ContentEnhancer 
                        content={generatedContent}
                        onEnhancedContent={(enhancedContent: string) => setGeneratedContent(enhancedContent)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection
                      title="Content Variations"
                      icon="🔄"
                      isExpanded={expandedSections.variations}
                      onToggle={(expanded) => toggleSection('variations', expanded)}
                      variant="secondary"
                    >
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
                    </CollapsibleSection>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Generated Content */}
        <div className="w-full">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center heading-font">
              <span className="mr-2">📄</span>
              Generated Content
            </h2>
            <ContentPreview 
              content={generatedContent}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;