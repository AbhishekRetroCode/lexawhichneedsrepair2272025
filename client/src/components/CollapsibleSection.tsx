import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  children: React.ReactNode;
  variant?: "default" | "secondary" | "accent";
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isExpanded = false,
  onToggle,
  children,
  variant = "default"
}) => {
  const [internalExpanded, setInternalExpanded] = useState(isExpanded);
  const expanded = onToggle ? isExpanded : internalExpanded;
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle(!expanded);
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          container: "bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 border-slate-200 dark:border-slate-700",
          header: "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100",
          content: "bg-slate-50/50 dark:bg-slate-800/50"
        };
      case "accent":
        return {
          container: "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800",
          header: "text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100",
          content: "bg-amber-50/50 dark:bg-amber-900/10"
        };
      default:
        return {
          container: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
          header: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
          content: "bg-gray-50/50 dark:bg-gray-800/50"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      layout
      className={`rounded-lg border transition-all duration-200 ${styles.container} ${
        expanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'
      }`}
    >
      <Button
        variant="ghost"
        onClick={handleToggle}
        className={`w-full p-4 justify-between text-left font-medium transition-all duration-200 ${styles.header} h-auto`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{icon}</span>
          <span>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </Button>
      
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={`p-4 pt-0 border-t border-gray-200 dark:border-gray-700 ${styles.content}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CollapsibleSection;