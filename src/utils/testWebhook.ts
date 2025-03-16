
import { N8nWorkflowData } from "../types";
import { getConfiguredWebhookUrl } from "../utils/n8nWorkflow";

/**
 * Test script for n8n webhook connectivity
 * Run this with: npx ts-node src/utils/testWebhook.ts
 */

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

/**
 * Test function to send data to n8n webhook
 */
const testWebhook = async (): Promise<void> => {
  try {
    // Get configured webhook URL
    const webhookUrl = getConfiguredWebhookUrl();
    
    console.log("Sending test data to webhook:", webhookUrl);
    console.log("Test data:", JSON.stringify(testData, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Add origin and CORS headers
        "Origin": typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
      },
      // Do not include credentials for cross-domain requests unless CORS is properly configured
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }
    
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      result = await response.json();
    } else {
      result = await response.text();
    }
    
    console.log("Webhook test successful! Response:", result);
    console.log("\n===== CONNECTIVITY TEST SUCCESSFUL =====");
    console.log("The webhook is correctly configured and accepting connections.");
    console.log("You can now use this webhook endpoint in your application.");
  } catch (error) {
    console.error("===== WEBHOOK TEST FAILED =====");
    console.error("Error details:", error);
    console.error("\nTroubleshooting steps:");
    console.error("1. Verify that your n8n instance is running");
    console.error("2. Check that the webhook URL is correct");
    console.error("3. Ensure CORS is properly configured in your n8n instance");
    console.error("4. Check network connectivity between this application and the n8n server");
    console.error("5. Verify the webhook path is correctly set to '/medical-it-support'");
  }
};

// Run the test
testWebhook();

// Instructions for running this test from command line:
/*
1. Open a terminal in the project root directory
2. Run: npx ts-node src/utils/testWebhook.ts
3. Check the console output for results
*/ 

export default testWebhook;
