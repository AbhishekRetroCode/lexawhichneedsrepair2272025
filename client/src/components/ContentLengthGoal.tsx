
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ProgressIndicator } from './ProgressIndicator';
import { Target, TrendingUp, Clock } from 'lucide-react';

interface ContentLengthGoalProps {
  currentWords: number;
  targetWords: number;
  estimatedReadTime?: number;
  className?: string;
}

export function ContentLengthGoal({
  currentWords,
  targetWords,
  estimatedReadTime,
  className
}: ContentLengthGoalProps) {
  const progress = (currentWords / targetWords) * 100;
  const isComplete = currentWords >= targetWords;
  const isNearComplete = progress >= 80;
  
  const getProgressVariant = () => {
    if (isComplete) return 'success';
    if (isNearComplete) return 'warning';
    return 'default';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          Writing Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressIndicator
          current={currentWords}
          target={targetWords}
          label="Word Count"
          variant={getProgressVariant()}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{currentWords > 0 ? '+' : ''}{currentWords} words</span>
          </div>
          
          {estimatedReadTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{estimatedReadTime} min read</span>
            </div>
          )}
        </div>
        
        {isComplete && (
          <div className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 
                         p-2 rounded-lg border border-green-200 dark:border-green-800">
            🎉 Congratulations! You've reached your word count goal.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ProgressIndicator } from './ProgressIndicator';
import { Target, TrendingUp, Clock } from 'lucide-react';

interface ContentLengthGoalProps {
  currentWords: number;
  targetWords: number;
  estimatedReadTime?: number;
  className?: string;
}

export function ContentLengthGoal({
  currentWords,
  targetWords,
  estimatedReadTime,
  className
}: ContentLengthGoalProps) {
  const progress = (currentWords / targetWords) * 100;
  const isComplete = currentWords >= targetWords;
  const isNearComplete = progress >= 80;
  
  const getProgressVariant = () => {
    if (isComplete) return 'success';
    if (isNearComplete) return 'warning';
    return 'default';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4" />
          Writing Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressIndicator
          current={currentWords}
          target={targetWords}
          label="Word Count"
          variant={getProgressVariant()}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{currentWords > 0 ? '+' : ''}{currentWords} words</span>
          </div>
          
          {estimatedReadTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{estimatedReadTime} min read</span>
            </div>
          )}
        </div>
        
        {isComplete && (
          <div className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 
                         p-2 rounded-lg border border-green-200 dark:border-green-800">
            🎉 Congratulations! You've reached your word count goal.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
