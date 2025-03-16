
import { N8nWorkflowData } from "../types";

// Local storage keys
const N8N_WEBHOOK_URL_KEY = 'n8n_webhook_url';
const N8N_USE_CUSTOM_URL_KEY = 'n8n_use_custom_url';

/**
 * Get the configured webhook URL from localStorage or use default
 */
export const getConfiguredWebhookUrl = (): string => {
  // Check if running in browser environment
  if (typeof window === 'undefined') {
    return 'http://localhost:5678/webhook/medical-it-support';
  }
  
  const useCustomUrl = localStorage.getItem(N8N_USE_CUSTOM_URL_KEY) === 'true';
  
  if (useCustomUrl) {
    const customUrl = localStorage.getItem(N8N_WEBHOOK_URL_KEY);
    if (customUrl) {
      return customUrl;
    }
  }
  
  // Default URL based on hostname
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return "http://localhost:5678/webhook/medical-it-support";
  } else {
    return `https://${hostname}/webhook/medical-it-support`;
  }
};

/**
 * Prepare data for n8n workflow
 */
export const prepareWorkflowData = (formData: any, clinicName: string): N8nWorkflowData => {
  // Generate random ticket ID
  const ticketId = "TKT-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  // Format location
  const location = `Floor ${formData.floor}, Room ${formData.room}`;
  
  // Ensure priority is uppercase for consistency
  const priority = formData.priority ? formData.priority.toUpperCase() : 'MEDIUM';
  
  // Prepare data object
  return {
    ticketId,
    clinicName,
    department: formData.department || '',
    location,
    phone: formData.phone || '',
    priority,
    description: formData.description || '',
    timestamp: new Date().toISOString(),
    needsEscalation: priority === 'CRITICAL',
    category: '',  // Will be filled by AI processing
    suggestedSolution: '', // Will be filled by AI processing
    requesterEmail: '',
    status: 'New'
  };
};

/**
 * Send data to n8n webhook
 */
export const sendToN8nWebhook = async (data: N8nWorkflowData): Promise<{ success: boolean; message: string }> => {
  try {
    const webhookUrl = getConfiguredWebhookUrl();
    
    console.log("Sending data to webhook:", webhookUrl);
    console.log("Data:", JSON.stringify(data, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": window.location.origin
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }
    
    // Process response
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }
    
    return { 
      success: true, 
      message: typeof result === 'object' ? 'Ticket created successfully' : result 
    };
  } catch (error) {
    console.error("Error sending data to webhook:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

// Documentation for the n8n workflow
export const N8N_WORKFLOW_GUIDE = {
  title: "Medical IT Support Workflow",
  description: "This workflow processes IT support tickets from medical clinics, analyzes them with AI, and routes them to the appropriate support channels.",
  requirements: [
    "n8n instance running on your server",
    "SMTP email account for sending notifications",
    "Google Sheets account with API access",
    "Optional: OpenAI API key for enhanced AI processing"
  ],
  mainNodes: [
    {
      name: "Webhook Trigger",
      description: "Receives ticket data from the web application",
      path: "/medical-it-support",
      method: "POST"
    },
    {
      name: "AI Processing",
      description: "Analyzes ticket content to determine category and suggest solutions",
      aiFeatures: ["Category detection", "Priority validation", "Solution suggestion"]
    },
    {
      name: "Email Notification",
      description: "Sends branded HTML emails to IT support and requester",
      templates: ["Support Team Notification", "Requester Confirmation"]
    },
    {
      name: "Google Sheets",
      description: "Logs ticket data in a structured spreadsheet",
      columns: ["Ticket ID", "Clinic", "Department", "Priority", "Status", "Timestamp"]
    }
  ],
  setupInstructions: [
    "Import the provided n8n.json file into your n8n instance",
    "Configure your SMTP credentials for email notifications",
    "Connect your Google Sheets account",
    "Create a Google Sheet with the required columns",
    "Optional: Add your OpenAI API key for enhanced AI capabilities",
    "Test the workflow using the built-in webhook testing tool"
  ]
};
