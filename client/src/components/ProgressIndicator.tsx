
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function ProgressIndicator({
  current,
  target,
  label,
  showPercentage = true,
  variant = 'default',
  className
}: ProgressIndicatorProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'danger':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-primary to-accent';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">{label}</span>
          {showPercentage && (
            <span className="text-muted-foreground">
              {current}/{target} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      
      <div className="progress-bar">
        <div 
          className={cn("progress-fill bg-gradient-to-r", getVariantClasses())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage >= 100 && (
        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
          ✓ Goal achieved!
        </div>
      )}
    </div>
  );
}
