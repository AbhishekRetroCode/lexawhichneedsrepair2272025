
import React from 'react';
import { Button } from './ui/button';
import { 
  Plus, 
  Save, 
  Download, 
  Copy, 
  RefreshCw, 
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsBarProps {
  onNewContent?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onEnhance?: () => void;
  className?: string;
}

export function QuickActionsBar({
  onNewContent,
  onSave,
  onDownload,
  onCopy,
  onRefresh,
  onSettings,
  onEnhance,
  className
}: QuickActionsBarProps) {
  const actions = [
    { icon: Plus, label: 'New', onClick: onNewContent, color: 'bg-green-500 hover:bg-green-600' },
    { icon: Save, label: 'Save', onClick: onSave, color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Download, label: 'Download', onClick: onDownload, color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Copy, label: 'Copy', onClick: onCopy, color: 'bg-amber-500 hover:bg-amber-600' },
    { icon: Zap, label: 'Enhance', onClick: onEnhance, color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: RefreshCw, label: 'Refresh', onClick: onRefresh, color: 'bg-teal-500 hover:bg-teal-600' },
    { icon: Settings, label: 'Settings', onClick: onSettings, color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
      "bg-background/80 backdrop-blur-lg rounded-full p-2",
      "border border-border/50 shadow-lg",
      "flex items-center gap-2",
      "transition-all duration-300 hover:shadow-xl",
      className
    )}>
      {actions.map(({ icon: Icon, label, onClick, color }, index) => (
        onClick && (
          <Button
            key={index}
            size="sm"
            variant="ghost"
            onClick={onClick}
            className={cn(
              "h-10 w-10 rounded-full p-0",
              "transition-all duration-200 hover:scale-110",
              "group relative"
            )}
            title={label}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                          bg-foreground text-background text-xs px-2 py-1 rounded
                          opacity-0 group-hover:opacity-100 transition-opacity
                          pointer-events-none whitespace-nowrap">
              {label}
            </div>
          </Button>
        )
      ))}
    </div>
  );
}
import React from 'react';
import { Button } from './ui/button';
import { 
  Plus, 
  Save, 
  Download, 
  Copy, 
  RefreshCw, 
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsBarProps {
  onNewContent?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onEnhance?: () => void;
  className?: string;
}

export function QuickActionsBar({
  onNewContent,
  onSave,
  onDownload,
  onCopy,
  onRefresh,
  onSettings,
  onEnhance,
  className
}: QuickActionsBarProps) {
  const actions = [
    { icon: Plus, label: 'New', onClick: onNewContent, color: 'bg-green-500 hover:bg-green-600' },
    { icon: Save, label: 'Save', onClick: onSave, color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Download, label: 'Download', onClick: onDownload, color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Copy, label: 'Copy', onClick: onCopy, color: 'bg-amber-500 hover:bg-amber-600' },
    { icon: Zap, label: 'Enhance', onClick: onEnhance, color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: RefreshCw, label: 'Refresh', onClick: onRefresh, color: 'bg-teal-500 hover:bg-teal-600' },
    { icon: Settings, label: 'Settings', onClick: onSettings, color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
      "bg-background/80 backdrop-blur-lg rounded-full p-2",
      "border border-border/50 shadow-lg",
      "flex items-center gap-2",
      "transition-all duration-300 hover:shadow-xl",
      className
    )}>
      {actions.map(({ icon: Icon, label, onClick, color }, index) => (
        onClick && (
          <Button
            key={index}
            size="sm"
            variant="ghost"
            onClick={onClick}
            className={cn(
              "h-10 w-10 rounded-full p-0",
              "transition-all duration-200 hover:scale-110",
              "group relative"
            )}
            title={label}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                          bg-foreground text-background text-xs px-2 py-1 rounded
                          opacity-0 group-hover:opacity-100 transition-opacity
                          pointer-events-none whitespace-nowrap">
              {label}
            </div>
          </Button>
        )
      ))}
    </div>
  );
}
