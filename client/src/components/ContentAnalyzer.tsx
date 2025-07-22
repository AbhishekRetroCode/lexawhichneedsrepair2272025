import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ContentAnalyzerProps {
  content: string | null;
}

const ContentAnalyzer: React.FC<ContentAnalyzerProps> = ({ content }) => {
  const analysis = useMemo(() => {
    if (!content) return null;

    const words = content.trim().split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const avgWordsPerSentence = Math.round(words / sentences);
    const readingTime = Math.ceil(words / 200);
    
    // Content quality metrics
    const readabilityScore = Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 2));
    const lengthScore = words > 50 ? Math.min(100, (words / 500) * 100) : (words / 50) * 60;
    const structureScore = paragraphs > 1 ? Math.min(100, paragraphs * 25) : 50;
    
    return {
      words,
      sentences,
      paragraphs,
      avgWordsPerSentence,
      readingTime,
      readabilityScore: Math.round(readabilityScore),
      lengthScore: Math.round(lengthScore),
      structureScore: Math.round(structureScore),
      overallScore: Math.round((readabilityScore + lengthScore + structureScore) / 3)
    };
  }, [content]);

  if (!analysis) {
    return (
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">📊</span>
            Content Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Generate content to see analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">📊</span>
              Content Analysis
            </div>
            <Badge 
              className={`${getScoreBg(analysis.overallScore)} ${getScoreColor(analysis.overallScore)} border-none`}
            >
              Score: {analysis.overallScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analysis.words}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {analysis.readingTime}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reading Time</div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Readability</span>
                <span className={`text-sm font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}%
                </span>
              </div>
              <Progress value={analysis.readabilityScore} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Content Length</span>
                <span className={`text-sm font-bold ${getScoreColor(analysis.lengthScore)}`}>
                  {analysis.lengthScore}%
                </span>
              </div>
              <Progress value={analysis.lengthScore} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Structure</span>
                <span className={`text-sm font-bold ${getScoreColor(analysis.structureScore)}`}>
                  {analysis.structureScore}%
                </span>
              </div>
              <Progress value={analysis.structureScore} className="h-2" />
            </div>
          </div>

          {/* Additional Details */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div>Sentences: {analysis.sentences}</div>
              <div>Paragraphs: {analysis.paragraphs}</div>
              <div className="col-span-2">Avg words/sentence: {analysis.avgWordsPerSentence}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentAnalyzer;