import { FormData, N8nWorkflowData } from "../types";
import { formatPhoneNumber } from "./validation";
import { determineCategory, reformulateIssue, shouldEscalate } from "./aiProcessing";

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

/**
 * Prepares data for n8n workflow processing
 */
export const prepareWorkflowData = (formData: FormData, clinicName: string): N8nWorkflowData => {
  const ticketId = generateTicketId(formData);
  const category = determineCategory(formData.description);
  const needsEscalation = shouldEscalate(formData);
  
  return {
    ticketId,
    clinicName,
    department: formData.department || "Unknown",
    location: `Floor ${formData.floor}, Room ${formData.room}`,
    phone: formatPhoneNumber(formData.phone),
    priority: formData.priority?.toUpperCase() || "MEDIUM",
    description: reformulateIssue(formData.description),
    category,
    timestamp: new Date().toISOString(),
    needsEscalation
  };
};

/**
 * Generates a unique ticket ID
 */
const generateTicketId = (formData: FormData): string => {
  const clinic = formData.clinic ? formData.clinic.substring(0, 3).toUpperCase() : "UNK";
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-6);
  return `${clinic}-${timestamp}`;
};

/**
 * Function to send data to n8n webhook
 */
export const sendToN8nWebhook = async (data: N8nWorkflowData): Promise<{ success: boolean, message: string }> => {
  try {
    // Get the configured webhook URL
    const webhookUrl = getConfiguredWebhookUrl();
    
    console.log(`Attempting to connect to n8n webhook at: ${webhookUrl}`);
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Add origin header for CORS
        "Origin": window.location.origin
      },
      // Enable credentials for cookies if needed
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("n8n webhook response:", result);
    
    return {
      success: true,
      message: result.message || "Ticket created successfully"
    };
  } catch (error) {
    console.error("Error sending data to n8n webhook:", error);
    console.log("Sending data failed with error:", error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create ticket"
    };
  }
};

/**
 * N8n Workflow Guide Template
 * 
 * This is a template for setting up an n8n workflow that processes IT support tickets
 * from the Medical IT Support application. The workflow should be configured in n8n
 * as described below.
 */
export const N8N_WORKFLOW_GUIDE = `
# Medical IT Support - n8n Workflow Setup Guide

## Overview
This document provides instructions for setting up an n8n workflow that processes IT support tickets submitted through the Medical IT Support application. The workflow handles email notifications, Google Sheets integration, and AI-based ticket processing.

## Prerequisites
1. An n8n installation (cloud or self-hosted)
2. Google account for Sheets integration
3. Email account for sending notifications

## Workflow Components

### 1. Webhook Trigger
- **Node**: Webhook
- **Configuration**:
  - Method: POST
  - Path: /medical-it-support
  - Authentication: None (or appropriate for your environment)
- **Output**: Captures ticket data in JSON format

### 2. Data Transformation
- **Node**: Set
- **Configuration**:
  - Format timestamp to local timezone
  - Prepare data structure for Google Sheets
  - Format data for email template

### 3. AI Processing
- **Node**: Function
- **Configuration**:
  - JavaScript code to process ticket data
  - Determine category
  - Generate analysis
  - Suggest solutions

### 4. Conditional Routing
- **Node**: Switch
- **Configuration**:
  - Route based on priority: Create branches for Critical/High/Medium/Low

### 5. Google Sheets Integration
- **Node**: Google Sheets
- **Configuration**:
  - Authentication: OAuth2
  - Operation: Append to sheet
  - Spreadsheet ID: Your master tracking spreadsheet
  - Sheet: Use different sheets based on clinic
  - Columns: 
    - Ticket ID
    - Clinic
    - Department
    - Location
    - Phone
    - Priority
    - Category
    - Description
    - AI Analysis
    - Suggested Solution
    - Response Time
    - Alert Level
    - Timestamp
    - Status

### 6. Email Notification
- **Node**: Send Email
- **Configuration**:
  - Service: SMTP or integrated email service
  - Template: HTML template with medical theme
  - Recipients: 
    - Dynamic IT support team based on clinic
    - CC additional stakeholders for Critical priority
  - Content:
    - Incident details table
    - AI-generated category
    - Location information
    - Contact details
    - Priority indicator with color coding

## Troubleshooting Webhook Connectivity

If you're having trouble connecting to the n8n webhook:

1. Ensure your n8n instance is running
2. Check the webhook URL in the Admin panel
3. Make sure your n8n instance allows CORS from your web app's domain
4. Confirm the webhook path is correctly set to '/medical-it-support'
5. Check browser console for detailed error messages
`;
