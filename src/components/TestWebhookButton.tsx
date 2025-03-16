
import React, { useState } from 'react';
import { Button } from './ui/button';
import { N8nWorkflowData } from "../types";
import { toast } from './ui/use-toast';
import { getConfiguredWebhookUrl } from '../utils/n8nWorkflow';

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
        body: JSON.stringify(testData)
      });
      
      // Handle different response types
      let resultMessage = "";
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }
      
      // Try to parse JSON response, but handle non-JSON responses gracefully
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        resultMessage = typeof result === 'object' ? JSON.stringify(result) : result.toString();
        console.log("Webhook test successful! Response:", result);
      } else {
        const textResult = await response.text();
        resultMessage = textResult || "Received non-JSON response";
        console.log("Webhook test successful! Text response:", textResult);
      }
      
      toast({
        title: "Webhook Test Successful",
        description: `Response: ${resultMessage.substring(0, 200)}${resultMessage.length > 200 ? '...' : ''}`,
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
