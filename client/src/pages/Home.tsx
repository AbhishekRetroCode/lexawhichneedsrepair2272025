import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import ContentPreview from "@/components/ContentPreview";
import ContentAnalyzer from "@/components/ContentAnalyzer";
import ContentEnhancer from "@/components/ContentEnhancer";
import ContentVariations from "@/components/ContentVariations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export interface ContentItem {
  id: string;
  content: string;
  contentType: string;
  writingStyle: string;
  timestamp: Date;
}

const Home = () => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentHistory, setContentHistory] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState("generate");
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentContentType, setCurrentContentType] = useState("paragraph");

  const handleContentGenerate = (content: string, contentType: string, writingStyle: string, topic?: string) => {
    setGeneratedContent(content);
    if (topic) setCurrentTopic(topic);
    setCurrentContentType(contentType);
    
    // Add to history
    if (content.trim()) {
      const newItem: ContentItem = {
        id: Date.now().toString(),
        content,
        contentType,
        writingStyle,
        timestamp: new Date()
      };
      setContentHistory(prev => [newItem, ...prev.slice(0, 9)]); // Keep last 10 items
    }
  };

  const handleSelectFromHistory = (item: ContentItem) => {
    setGeneratedContent(item.content);
    setActiveTab("generate");
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="generate" className="text-sm font-medium">
                Generate Content
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm font-medium">
                History ({contentHistory.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-8">
              <div className="hidden lg:block">
                <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="p-6">
                    <div className="space-y-6 h-full overflow-auto pr-2">
                      <div className="sticky top-0 bg-white dark:bg-gray-900 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <span className="mr-2">⚙️</span>
                          Configuration
                        </h2>
                      </div>
                      <ConfigurationPanel 
                        onGenerate={handleContentGenerate}
                        setIsGenerating={setIsGenerating}
                        isGenerating={isGenerating}
                      />
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle className="w-2 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200" />
                  
                  <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="p-6">
                    <div className="space-y-6 h-full overflow-auto pr-2">
                      <div className="sticky top-0 bg-white dark:bg-gray-900 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <span className="mr-2">🔧</span>
                          Analysis & Tools
                        </h2>
                      </div>
                      <ContentAnalyzer content={generatedContent} />
                      <ContentEnhancer 
                        content={generatedContent} 
                        onEnhancedContent={(content) => handleContentGenerate(content, "enhanced", "improved")}
                      />
                      <ContentVariations
                        content={generatedContent}
                        originalTopic={currentTopic}
                        contentType={currentContentType}
                        onVariationGenerated={(content, type, style) => handleContentGenerate(content, type, style)}
                      />
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle className="w-2 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200" />
                  
                  <ResizablePanel defaultSize={40} minSize={30} className="p-6">
                    <div className="h-full overflow-auto">
                      <div className="sticky top-0 bg-white dark:bg-gray-900 pb-4 border-b border-gray-200 dark:border-gray-700 z-10">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <span className="mr-2">📄</span>
                          Generated Content
                        </h2>
                      </div>
                      <div className="mt-4">
                        <ContentPreview 
                          content={generatedContent}
                          isGenerating={isGenerating}
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
              
              {/* Mobile Layout */}
              <div className="lg:hidden space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-2">⚙️</span>
                      Configuration
                    </h2>
                    <ConfigurationPanel 
                      onGenerate={handleContentGenerate}
                      setIsGenerating={setIsGenerating}
                      isGenerating={isGenerating}
                    />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="mr-2">📄</span>
                      Generated Content
                    </h2>
                    <ContentPreview 
                      content={generatedContent}
                      isGenerating={isGenerating}
                    />
                  </div>
                  
                  {generatedContent && (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <span className="mr-2">🔧</span>
                          Analysis & Tools
                        </h2>
                        <div className="space-y-6">
                          <ContentAnalyzer content={generatedContent} />
                          <ContentEnhancer 
                            content={generatedContent} 
                            onEnhancedContent={(content) => handleContentGenerate(content, "enhanced", "improved")}
                          />
                          <ContentVariations
                            content={generatedContent}
                            originalTopic={currentTopic}
                            contentType={currentContentType}
                            onVariationGenerated={(content, type, style) => handleContentGenerate(content, type, style)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-8">
              <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border border-gray-200 dark:border-gray-700">
                <ResizablePanel defaultSize={100} className="p-6">
                  <div className="h-full overflow-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-900 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content History</h2>
                    </div>
                    <div className="mt-4">
                      <ContentHistory 
                        history={contentHistory} 
                        onSelect={handleSelectFromHistory}
                        onClear={() => setContentHistory([])}
                      />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

// Content History Component
interface ContentHistoryProps {
  history: ContentItem[];
  onSelect: (item: ContentItem) => void;
  onClear: () => void;
}

const ContentHistory = ({ history, onSelect, onClear }: ContentHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No History Yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Your generated content will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Content History</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Clear All
        </motion.button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onSelect(item)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                {item.contentType}
              </span>
              <span className="text-xs text-gray-500">
                {item.timestamp.toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {item.content.slice(0, 120)}...
            </p>
            <div className="mt-2 text-xs text-gray-400">
              Style: {item.writingStyle}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};



export default Home;
