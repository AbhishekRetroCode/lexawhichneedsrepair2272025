import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Generating content...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-amber-200 dark:border-amber-800 border-t-amber-600 dark:border-t-amber-400 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="text-center"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }}
      >
        <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
          {text}
        </div>
        <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
          Powered by AI • Please wait...
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;