import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
  onSwitchProvider?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onDismiss,
  onSwitchProvider 
}) => {
  if (!error) return null;

  const isApiKeyError = error.includes('API key not configured') || error.includes('OpenRouter');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-4"
      >
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <svg className="h-4 w-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <AlertTitle className="text-red-800 dark:text-red-200">
            {isApiKeyError ? 'API Configuration Required' : 'Generation Error'}
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300 mt-2">
            {error}
          </AlertDescription>
          
          <div className="flex gap-2 mt-3">
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
              className="text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              Dismiss
            </Button>
            {isApiKeyError && onSwitchProvider && (
              <Button
                onClick={onSwitchProvider}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Switch to Gemini
              </Button>
            )}
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorAlert;