import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuickAction {
  id: string;
  label: string;
  contentType: string;
  writingStyle: string;
  prompt: string;
  icon: string;
}

interface QuickActionsProps {
  onQuickAction: (action: QuickAction) => void;
}

const quickActions: QuickAction[] = [
  {
    id: "blog-outline",
    label: "Blog Outline",
    contentType: "article",
    writingStyle: "informative",
    prompt: "Create a comprehensive blog post outline about artificial intelligence in healthcare",
    icon: "📝"
  },
  {
    id: "social-caption",
    label: "Social Caption",
    contentType: "socialMediaPost",
    writingStyle: "engaging",
    prompt: "Write an engaging Instagram caption for a sunset photo",
    icon: "📸"
  },
  {
    id: "email-template",
    label: "Email Template",
    contentType: "email",
    writingStyle: "professional",
    prompt: "Create a professional follow-up email template after a business meeting",
    icon: "📧"
  },
  {
    id: "product-copy",
    label: "Product Copy",
    contentType: "productDescription",
    writingStyle: "persuasive",
    prompt: "Write compelling product copy for a wireless bluetooth headphones",
    icon: "🎧"
  },
  {
    id: "creative-story",
    label: "Short Story",
    contentType: "story",
    writingStyle: "creative",
    prompt: "Write a short mystery story set in a coffee shop",
    icon: "📚"
  },
  {
    id: "press-release",
    label: "Press Release",
    contentType: "pressRelease",
    writingStyle: "formal",
    prompt: "Write a press release announcing a new sustainable technology startup",
    icon: "📰"
  }
];

const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
        <Badge variant="secondary" className="text-xs">
          {quickActions.length} templates
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              onClick={() => onQuickAction(action)}
              className="w-full h-auto p-3 flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;