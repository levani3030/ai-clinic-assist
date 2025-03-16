import React, { useState } from 'react';
import { Button } from './ui/button';
import { N8nWorkflowData } from '../types';
import { toast } from './ui/use-toast';

// Key for storing the webhook URL in localStorage
const N8N_WEBHOOK_URL_KEY = 'n8n_webhook_url';
const N8N_USE_CUSTOM_URL_KEY = 'n8n_use_custom_url';

/**
 * Gets the configured webhook URL
 */
const getConfiguredWebhookUrl = (): string => {
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

const TestWebhookButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const testWebhook = async () => {
    setIsLoading(true);
    
    try {
      // Sample test data matching the expected structure
      const testData: N8nWorkflowData = {
        ticketId: "TEST-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        clinicName: "Test Clinic",
        department: "IT Department",
        location: "Floor 1, Room 101",
        phone: "555-123-4567",
        priority: "MEDIUM",
        description: "This is a test ticket to verify webhook connectivity.",
        category: "Test",
        timestamp: new Date().toISOString(),
        needsEscalation: false,
        suggestedSolution: "This is a test ticket. No solution needed.",
        requesterEmail: "test@example.com",
        status: "Test"
      };
      
      // Get configured webhook URL
      const webhookUrl = getConfiguredWebhookUrl();
      
      console.log("Sending test data to webhook:", webhookUrl);
      console.log("Test data:", JSON.stringify(testData, null, 2));
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify(testData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Webhook test successful! Response:", result);
      
      toast({
        title: "Webhook Test Successful",
        description: `Response: ${JSON.stringify(result)}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Webhook test failed:", error);
      
      toast({
        title: "Webhook Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={testWebhook} 
      disabled={isLoading}
      className="my-2"
    >
      {isLoading ? "Testing..." : "Test n8n Webhook Connection"}
    </Button>
  );
};

export default TestWebhookButton; 