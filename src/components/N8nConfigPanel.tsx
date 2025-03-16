
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from './ui/use-toast';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ExternalLink, Info } from 'lucide-react';
import TestWebhookButton from './TestWebhookButton';
import { getConfiguredWebhookUrl } from '../utils/n8nWorkflow';

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
  const [activeTab, setActiveTab] = useState<string>('config');
  
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

  const getCurrentUrl = () => {
    return getConfiguredWebhookUrl();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>n8n Workflow Configuration</CardTitle>
        <CardDescription>
          Configure the connection to your n8n instance for AI-powered ticket handling
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Webhook Config</TabsTrigger>
          <TabsTrigger value="test">Test Connection</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-4">
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
              
              <div className="pt-2">
                <p className="text-sm">
                  <strong>Currently Active URL:</strong> {getCurrentUrl()}
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
        </TabsContent>
        
        <TabsContent value="test">
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Webhook Test</h3>
                <p className="text-sm mb-4">
                  Click the button below to send a test ticket to your configured n8n webhook.
                  This will verify if your n8n instance is correctly set up and can receive data.
                </p>
                
                <TestWebhookButton />
                
                <p className="text-xs text-muted-foreground mt-2">
                  Note: This will send a sample ticket to the currently configured URL: {getCurrentUrl()}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Troubleshooting Tips</h3>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Make sure your n8n instance is running</li>
                  <li>Check that the webhook path is set to "/medical-it-support"</li>
                  <li>Verify CORS is configured to allow requests from this domain</li>
                  <li>Check n8n logs for detailed error information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="help">
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-medium">n8n Workflow Setup Guide</h3>
              <p className="text-sm">
                For detailed instructions on setting up your n8n workflow with AI integration,
                please visit the Workflow Documentation page.
              </p>
              
              <div className="flex justify-center my-4">
                <Button asChild>
                  <a href="/workflow-docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Open Workflow Documentation
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
              
              <Separator />
              
              <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3">
                <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">What is n8n?</h4>
                  <p className="text-sm">
                    n8n is a workflow automation tool that allows you to connect various services
                    and automate tasks. In this application, it's used to process IT support tickets,
                    send notifications, and update tracking spreadsheets.
                  </p>
                  <p className="text-sm mt-2">
                    <a 
                      href="https://n8n.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Learn more about n8n →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default N8nConfigPanel;
