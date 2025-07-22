import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ContentStatsProps {
  content: string | null;
}

const ContentStats: React.FC<ContentStatsProps> = ({ content }) => {
  if (!content) return null;

  const wordCount = content.trim().split(/\s+/).length;
  const charCount = content.length;
  const charCountNoSpaces = content.replace(/\s/g, '').length;
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphCount = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

  const stats = [
    { label: "Words", value: wordCount, icon: "📝" },
    { label: "Characters", value: charCount, icon: "🔤" },
    { label: "Sentences", value: sentenceCount, icon: "📄" },
    { label: "Paragraphs", value: paragraphCount, icon: "📋" },
    { label: "Reading Time", value: `${readingTime} min`, icon: "⏱️" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Content Statistics</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{stat.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContentStats;