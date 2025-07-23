import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { useLocation } from 'wouter';

interface Settings {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  autoSave: boolean;
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>({
    fontFamily: 'crimson',
    fontSize: '16',
    fontWeight: '400',
    lineHeight: '1.6',
    autoSave: true,
  });

  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openrouterApiKey, setOpenrouterApiKey] = useState('');

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('writtus-settings');
    if (saved) {
      const loadedSettings = JSON.parse(saved);
      setSettings(loadedSettings);
      applySettings(loadedSettings);
    } else {
      // Apply default settings
      applySettings(settings);
    }
  }, []);

  const applySettings = (newSettings: Settings) => {
    const root = document.documentElement;

    // Apply font family
    switch (newSettings.fontFamily) {
      case 'crimson':
        root.style.setProperty('--font-family', "'Crimson Text', 'Source Serif Pro', Georgia, serif");
        break;
      case 'inter':
        root.style.setProperty('--font-family', "'Inter', -apple-system, BlinkMacSystemFont, sans-serif");
        break;
      case 'playfair':
        root.style.setProperty('--font-family', "'Playfair Display', 'Source Serif Pro', Georgia, serif");
        break;
      case 'courier':
        root.style.setProperty('--font-family', "'Courier New', Courier, monospace");
        break;
      default:
        root.style.setProperty('--font-family', "'Crimson Text', 'Source Serif Pro', Georgia, serif");
    }

    root.style.setProperty('--font-size', `${newSettings.fontSize}px`);
    root.style.setProperty('--font-weight', newSettings.fontWeight);
    root.style.setProperty('--line-height', newSettings.lineHeight);

    // Force a repaint to ensure changes are applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  };

  const handleSettingsChange = (key: keyof Settings, value: string | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('writtus-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const saveApiKey = async (provider: 'gemini' | 'openrouter') => {
    const key = provider === 'gemini' ? geminiApiKey : openrouterApiKey;
    if (!key.trim()) return;

    try {
      const response = await fetch('/api/save-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key, provider }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${provider === 'gemini' ? 'Gemini' : 'OpenRouter'} API key saved successfully`,
        });
        if (provider === 'gemini') setGeminiApiKey('');
        else setOpenrouterApiKey('');
      } else {
        throw new Error('Failed to save API key');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${provider === 'gemini' ? 'Gemini' : 'OpenRouter'} API key`,
        variant: "destructive",
      });
    }
  };

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prevSettings) => {
            const updatedSettings = { ...prevSettings, ...newSettings };
            localStorage.setItem('writtus-settings', JSON.stringify(updatedSettings));
            applySettings(updatedSettings as Settings);
            return updatedSettings;
        });
    };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-font text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Customize your Writtus experience</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) => handleSettingsChange('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crimson">Crimson Text (Serif)</SelectItem>
                  <SelectItem value="inter">Inter (Sans-serif)</SelectItem>
                  <SelectItem value="playfair">Playfair Display (Display)</SelectItem>
                  <SelectItem value="courier">Courier New (Monospace)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value) => handleSettingsChange('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">Small (14px)</SelectItem>
                  <SelectItem value="16">Medium (16px)</SelectItem>
                  <SelectItem value="18">Large (18px)</SelectItem>
                  <SelectItem value="20">Extra Large (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-weight">Font Weight & Boldness</Label>
              <Select value={settings.fontWeight} onValueChange={(value) => updateSettings({ fontWeight: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Regular (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semi Bold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                  <SelectItem value="800">Extra Bold (800)</SelectItem>
                  <SelectItem value="900">Black (900)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Higher values provide more boldness for better readability
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="line-height">Line Height</Label>
              <Select
                value={settings.lineHeight}
                onValueChange={(value) => handleSettingsChange('lineHeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.4">Tight (1.4)</SelectItem>
                  <SelectItem value="1.6">Normal (1.6)</SelectItem>
                  <SelectItem value="1.8">Relaxed (1.8)</SelectItem>
                  <SelectItem value="2.0">Loose (2.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Preview */}
            <div className="space-y-2 mt-6">
              <Label>Font Preview</Label>
              <div className="p-4 border rounded-lg bg-card writing-font content-area">
                <p className="mb-2">
                  This is a sample paragraph showing how your content will look with the selected font settings. 
                  The font family, size, and line height will all be applied to your generated content.
                </p>
                <p className="text-sm text-muted-foreground">
                  Font: {settings.fontFamily === 'crimson' ? 'Crimson Text' : 
                         settings.fontFamily === 'inter' ? 'Inter' :
                         settings.fontFamily === 'playfair' ? 'Playfair Display' : 'Courier New'} | 
                  Size: {settings.fontSize}px | 
                  Weight: {settings.fontWeight} | 
                  Line Height: {settings.lineHeight}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Configure your AI provider API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="gemini-key"
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                />
                <Button onClick={() => saveApiKey('gemini')}>Save</Button>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Editor Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Editor Settings</CardTitle>
            <CardDescription>Configure editor behavior and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto Save</Label>
                <p className="text-sm text-muted-foreground">Automatically save your work</p>
              </div>
              <Switch
                id="auto-save"
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingsChange('autoSave', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}