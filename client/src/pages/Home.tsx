import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import ContentPreview from "@/components/ContentPreview";

const Home = () => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          <ConfigurationPanel 
            onGenerate={(content) => setGeneratedContent(content)}
            setIsGenerating={setIsGenerating}
            isGenerating={isGenerating}
          />
          <ContentPreview 
            content={generatedContent}
            isGenerating={isGenerating}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
