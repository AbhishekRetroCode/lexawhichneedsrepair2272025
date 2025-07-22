import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import ContentPreview from "@/components/ContentPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const handleContentGenerate = (content: string, contentType: string, writingStyle: string) => {
    setGeneratedContent(content);
    
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="generate" className="text-sm font-medium">
                Generate Content
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm font-medium">
                History ({contentHistory.length})
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-sm font-medium">
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                <div className="xl:col-span-2">
                  <ConfigurationPanel 
                    onGenerate={handleContentGenerate}
                    setIsGenerating={setIsGenerating}
                    isGenerating={isGenerating}
                  />
                </div>
                <div className="xl:col-span-3">
                  <ContentPreview 
                    content={generatedContent}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <ContentHistory 
                history={contentHistory} 
                onSelect={handleSelectFromHistory}
                onClear={() => setContentHistory([])}
              />
            </TabsContent>

            <TabsContent value="templates">
              <ContentTemplates onApplyTemplate={handleContentGenerate} />
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

// Content Templates Component
interface ContentTemplatesProps {
  onApplyTemplate: (content: string, contentType: string, writingStyle: string) => void;
}

const ContentTemplates = ({ onApplyTemplate }: ContentTemplatesProps) => {
  const templates = [
    {
      id: "blog-intro",
      name: "Blog Post Introduction",
      contentType: "blogPost",
      writingStyle: "engaging",
      description: "Create compelling blog post introductions",
      example: "Write an engaging introduction for a blog post about sustainable living"
    },
    {
      id: "product-desc",
      name: "Product Description",
      contentType: "productDescription",
      writingStyle: "persuasive",
      description: "Professional product descriptions that convert",
      example: "Create a compelling product description for eco-friendly water bottle"
    },
    {
      id: "social-media",
      name: "Social Media Post",
      contentType: "socialMediaPost",
      writingStyle: "casual",
      description: "Engaging social media content",
      example: "Write an Instagram post about morning coffee routine"
    },
    {
      id: "email-marketing",
      name: "Marketing Email",
      contentType: "email",
      writingStyle: "professional",
      description: "Professional marketing emails",
      example: "Create a welcome email for new newsletter subscribers"
    },
    {
      id: "press-release",
      name: "Press Release",
      contentType: "pressRelease",
      writingStyle: "formal",
      description: "Official press release format",
      example: "Write a press release for company's new product launch"
    },
    {
      id: "story-creative",
      name: "Creative Story",
      contentType: "story",
      writingStyle: "creative",
      description: "Engaging creative storytelling",
      example: "Write a short story about time travel adventure"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Content Templates</h2>
        <p className="text-gray-600 dark:text-gray-400">Quick start templates for common content types</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{template.name}</h3>
              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                {template.contentType}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{template.description}</p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                "{template.example}"
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onApplyTemplate(template.example, template.contentType, template.writingStyle)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
            >
              Use Template
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
