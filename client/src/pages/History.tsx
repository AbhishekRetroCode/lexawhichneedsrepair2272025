
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { Label } from '../components/ui/label';
import { Trash2, Copy, Calendar, FileText, User, Zap } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { useLocation } from 'wouter';

interface HistoryEntry {
  id: string;
  content: string;
  topic: string;
  contentType: string;
  writingStyle: string;
  contentLength: string;
  provider: string;
  model: string;
  timestamp: string;
  wordCount: number;
}

export default function History() {
  const [, setLocation] = useLocation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setHistory(prev => prev.filter(entry => entry.id !== id));
        if (selectedEntry?.id === id) {
          setSelectedEntry(null);
        }
        toast({
          title: "Entry deleted",
          description: "History entry has been removed successfully.",
        });
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete history entry.",
        variant: "destructive",
      });
    }
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const clearAllHistory = async () => {
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setHistory([]);
        setSelectedEntry(null);
        toast({
          title: "History cleared",
          description: "All history entries have been removed.",
        });
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast({
        title: "Error",
        description: "Failed to clear history.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-font text-foreground mb-2">History</h1>
          <p className="text-muted-foreground">View and manage your generated content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation('/')}>
            Back to Home
          </Button>
          {history.length > 0 && (
            <Button variant="destructive" onClick={clearAllHistory}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start generating content to see your history here.
            </p>
            <Button onClick={() => setLocation('/')}>
              Generate Content
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated Content ({history.length})
                </CardTitle>
                <CardDescription>
                  Click on any entry to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedEntry?.id === entry.id
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {entry.topic || 'Untitled'}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEntry(entry.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {entry.contentType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {entry.wordCount} words
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Content Detail */}
          <div className="lg:col-span-2">
            {selectedEntry ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-2">
                        {selectedEntry.topic || 'Untitled Content'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedEntry.timestamp)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyContent(selectedEntry.content)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Content Type</Label>
                      <Badge variant="secondary" className="mt-1">
                        {selectedEntry.contentType}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Writing Style</Label>
                      <Badge variant="outline" className="mt-1">
                        {selectedEntry.writingStyle}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Length</Label>
                      <Badge variant="outline" className="mt-1">
                        {selectedEntry.contentLength}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Word Count</Label>
                      <Badge variant="secondary" className="mt-1">
                        {selectedEntry.wordCount} words
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        AI Provider
                      </Label>
                      <Badge variant="outline" className="mt-1">
                        {selectedEntry.provider}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Model
                      </Label>
                      <Badge variant="outline" className="mt-1">
                        {selectedEntry.model}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Generated Content</Label>
                    <Textarea
                      value={selectedEntry.content}
                      readOnly
                      className="min-h-[400px] font-serif text-sm leading-relaxed resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select an Entry</h3>
                  <p className="text-muted-foreground">
                    Choose a history entry from the list to view its details and content.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
