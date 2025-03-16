import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from './ui/use-toast';
import { Checkbox } from './ui/checkbox';

// Key for storing the webhook URL in localStorage
const N8N_WEBHOOK_URL_KEY = 'n8n_webhook_url';
const N8N_USE_CUSTOM_URL_KEY = 'n8n_use_custom_url';

const N8nConfigPanel: React.FC = () => {
  // Get default URL based on hostname
  const getDefaultUrl = (): string => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return "http://localhost:5678/webhook/medical-it-support";
    } else {
      return `https://${hostname}/webhook/medical-it-support`;
    }
  };

  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [useCustomUrl, setUseCustomUrl] = useState<boolean>(false);
  
  // Load saved settings on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem(N8N_WEBHOOK_URL_KEY);
    const savedUseCustom = localStorage.getItem(N8N_USE_CUSTOM_URL_KEY);
    
    if (savedUseCustom === 'true') {
      setUseCustomUrl(true);
    }
    
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    } else {
      setWebhookUrl(getDefaultUrl());
    }
  }, []);
  
  // Save settings
  const saveSettings = () => {
    try {
      // Validate URL format
      new URL(webhookUrl);
      
      localStorage.setItem(N8N_WEBHOOK_URL_KEY, webhookUrl);
      localStorage.setItem(N8N_USE_CUSTOM_URL_KEY, useCustomUrl.toString());
      
      toast({
        title: "Configuration Saved",
        description: "n8n webhook URL has been updated",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL for the n8n webhook",
        variant: "destructive",
      });
    }
  };
  
  // Reset to default
  const resetToDefault = () => {
    const defaultUrl = getDefaultUrl();
    setWebhookUrl(defaultUrl);
    setUseCustomUrl(false);
    localStorage.setItem(N8N_WEBHOOK_URL_KEY, defaultUrl);
    localStorage.setItem(N8N_USE_CUSTOM_URL_KEY, 'false');
    
    toast({
      title: "Configuration Reset",
      description: "n8n webhook URL has been reset to default",
      variant: "default",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>n8n Webhook Configuration</CardTitle>
        <CardDescription>
          Configure the connection to your n8n instance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="useCustomUrl" 
              checked={useCustomUrl} 
              onCheckedChange={(checked) => setUseCustomUrl(checked as boolean)}
            />
            <Label htmlFor="useCustomUrl">Use custom webhook URL</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input 
              id="webhookUrl" 
              value={webhookUrl} 
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={!useCustomUrl}
              placeholder="Enter your n8n webhook URL"
            />
            <p className="text-xs text-muted-foreground">
              {useCustomUrl ? 
                "Enter the full URL to your n8n webhook endpoint" : 
                `Using default URL: ${getDefaultUrl()}`}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetToDefault}>
          Reset to Default
        </Button>
        <Button onClick={saveSettings}>
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
};

// Utility function to get the current webhook URL based on settings
export const getConfiguredWebhookUrl = (): string => {
  const useCustom = localStorage.getItem(N8N_USE_CUSTOM_URL_KEY) === 'true';
  
  if (useCustom) {
    const savedUrl = localStorage.getItem(N8N_WEBHOOK_URL_KEY);
    if (savedUrl) {
      return savedUrl;
    }
  }
  
  // Default URL logic
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return "http://localhost:5678/webhook/medical-it-support";
  } else {
    return `https://${hostname}/webhook/medical-it-support`;
  }
};

export default N8nConfigPanel; 