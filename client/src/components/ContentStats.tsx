import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ContentStatsProps {
  content: string;
}

const ContentStats: React.FC<ContentStatsProps> = ({ content }) => {
  const stats = useMemo(() => {
    if (!content) return null;

    const words = content.trim().split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const characters = content.length;
    const charactersNoSpaces = content.replace(/\s/g, '').length;
    const readingTimeMinutes = Math.ceil(words / 200);
    const avgWordsPerSentence = Math.round(words / sentences);
    
    // Readability estimates (simplified)
    const fleschScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (words / sentences))));
    const readingLevel = fleschScore > 90 ? "Very Easy" : 
                        fleschScore > 80 ? "Easy" : 
                        fleschScore > 70 ? "Fairly Easy" :
                        fleschScore > 60 ? "Standard" :
                        fleschScore > 50 ? "Fairly Difficult" :
                        fleschScore > 30 ? "Difficult" : "Very Difficult";

    return {
      words,
      sentences,
      paragraphs,
      characters,
      charactersNoSpaces,
      readingTimeMinutes,
      avgWordsPerSentence,
      readingLevel,
      fleschScore: Math.round(fleschScore)
    };
  }, [content]);

  if (!stats) return null;

  const statItems = [
    { label: "Words", value: stats.words, color: "text-blue-600 dark:text-blue-400" },
    { label: "Sentences", value: stats.sentences, color: "text-green-600 dark:text-green-400" },
    { label: "Paragraphs", value: stats.paragraphs, color: "text-purple-600 dark:text-purple-400" },
    { label: "Characters", value: stats.characters, color: "text-orange-600 dark:text-orange-400" },
    { label: "Reading Time", value: `${stats.readingTimeMinutes}m`, color: "text-red-600 dark:text-red-400" },
    { label: "Avg Words/Sentence", value: stats.avgWordsPerSentence, color: "text-indigo-600 dark:text-indigo-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="mt-4">
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
            {statItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-1"
              >
                <div className={`text-lg font-bold ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Reading Level:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.readingLevel} ({stats.fleschScore})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentStats;