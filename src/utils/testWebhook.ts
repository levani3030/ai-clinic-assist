import { N8nWorkflowData } from "../types";

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
    // Update this URL to your actual n8n webhook URL
    const webhookUrl = "http://localhost:5678/webhook/medical-it-support";
    
    console.log("Sending test data to webhook:", webhookUrl);
    console.log("Test data:", JSON.stringify(testData, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Webhook test successful! Response:", result);
  } catch (error) {
    console.error("Webhook test failed:", error);
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