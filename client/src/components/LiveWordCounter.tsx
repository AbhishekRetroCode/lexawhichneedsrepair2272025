import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface LiveWordCounterProps {
  text: string;
  targetLength?: string;
}

const LiveWordCounter: React.FC<LiveWordCounterProps> = ({ text, targetLength = "medium" }) => {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;

  // Define target ranges based on content length
  const targetRanges = {
    tiny: { min: 10, max: 50, ideal: 25 },
    short: { min: 50, max: 150, ideal: 100 },
    medium: { min: 150, max: 400, ideal: 250 },
    long: { min: 400, max: 800, ideal: 600 },
    custom: { min: 0, max: 1000, ideal: 300 }
  };

  const target = targetRanges[targetLength as keyof typeof targetRanges] || targetRanges.medium;
  const progress = Math.min(100, (wordCount / target.ideal) * 100);
  
  const getProgressColor = () => {
    if (wordCount < target.min) return "bg-red-500";
    if (wordCount > target.max) return "bg-yellow-500";
    if (wordCount >= target.min && wordCount <= target.max) return "bg-green-500";
    return "bg-blue-500";
  };

  const getStatusText = () => {
    if (wordCount < target.min) return `${target.min - wordCount} words short`;
    if (wordCount > target.max) return `${wordCount - target.max} words over`;
    return "Perfect range";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Word Count</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{getStatusText()}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {wordCount} / {target.ideal} words
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{wordCount}</div>
          <div>Words</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{charCount}</div>
          <div>Characters</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-gray-900 dark:text-white">{charCountNoSpaces}</div>
          <div>No Spaces</div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Target: {target.min}-{target.max} words (Ideal: {target.ideal})
        </div>
      </div>
    </motion.div>
  );
};

export default LiveWordCounter;