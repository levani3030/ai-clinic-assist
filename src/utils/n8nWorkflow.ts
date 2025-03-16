
import { FormData, N8nWorkflowData } from "../types";
import { formatPhoneNumber } from "./validation";
import { determineCategory, reformulateIssue, shouldEscalate } from "./aiProcessing";

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
 * Mock function to send data to n8n webhook
 * In production, this would be replaced with an actual API call
 */
export const sendToN8nWebhook = async (data: N8nWorkflowData): Promise<{ success: boolean, message: string }> => {
  // In production, replace with actual API call to n8n webhook
  console.log("Sending data to n8n webhook:", data);
  
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Ticket ${data.ticketId} created successfully and sent to IT support team.`
      });
    }, 1000);
  });
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
  - Authentication: Basic Auth or Bearer Token (recommended)
- **Output**: Captures ticket data in JSON format

### 2. Data Transformation
- **Node**: Set
- **Configuration**:
  - Format timestamp to local timezone
  - Prepare data structure for Google Sheets
  - Format data for email template

### 3. AI Processing
- **Node**: HTTP Request (to LLM API)
- **Configuration**:
  - Endpoint: Your AI service endpoint
  - Method: POST
  - Payload: Ticket description and context
  - Action: Analyze issue, categorize, provide suggested resolution steps

### 4. Conditional Routing
- **Node**: Switch
- **Configuration**:
  - Route based on clinic: Create branches for each clinic
  - Route based on priority: Create additional handling for Critical/High priority

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
    - Description
    - Category (from AI)
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

### 7. Critical Issue Handling
- **Node**: Execute after Switch for Critical issues
- **Configuration**:
  - SMS notification node (optional)
  - Additional escalation procedures
  - Create urgent calendar invite

## HTML Email Template

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #e6f7ff; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .footer { background-color: #ffe6f2; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table th { background-color: #e6f7ff; padding: 10px; text-align: left; }
    .table td { padding: 10px; border-bottom: 1px solid #ddd; }
    .priority-critical { background-color: #ffebeb; color: #d90000; font-weight: bold; }
    .priority-high { background-color: #fff5e6; color: #cc6600; font-weight: bold; }
    .priority-medium { background-color: #fffde6; color: #999900; }
    .priority-low { background-color: #f2ffe6; color: #336600; }
    .logo { width: 100px; height: auto; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://yourdomain.com/medical-logo.png" alt="Medical IT Support" class="logo">
      <h2>IT Support Ticket Notification</h2>
    </div>
    
    <div class="content">
      <p>A new IT support ticket has been created:</p>
      
      <table class="table">
        <tr>
          <th colspan="2">Ticket Information</th>
        </tr>
        <tr>
          <td><strong>Ticket ID:</strong></td>
          <td>{{$json.ticketId}}</td>
        </tr>
        <tr>
          <td><strong>Clinic:</strong></td>
          <td>{{$json.clinicName}}</td>
        </tr>
        <tr>
          <td><strong>Department:</strong></td>
          <td>{{$json.department}}</td>
        </tr>
        <tr>
          <td><strong>Location:</strong></td>
          <td>{{$json.location}}</td>
        </tr>
        <tr>
          <td><strong>Contact:</strong></td>
          <td>{{$json.phone}}</td>
        </tr>
        <tr>
          <td><strong>Priority:</strong></td>
          <td class="priority-{{$json.priority.toLowerCase()}}">{{$json.priority}}</td>
        </tr>
        <tr>
          <td><strong>Category:</strong></td>
          <td>{{$json.category}}</td>
        </tr>
        <tr>
          <td><strong>Reported:</strong></td>
          <td>{{$json.timestamp}}</td>
        </tr>
      </table>
      
      <h3>Issue Description:</h3>
      <p>{{$json.description}}</p>
      
      {{#if $json.needsEscalation}}
      <div style="background-color: #ffebeb; padding: 10px; border-left: 4px solid #d90000; margin: 20px 0;">
        <p><strong>ESCALATION NOTICE:</strong> This issue has been flagged for immediate attention based on priority and content.</p>
      </div>
      {{/if}}
      
      <p>Please respond to this ticket according to your department's SLA guidelines.</p>
    </div>
    
    <div class="footer">
      <p>This is an automated notification from the Medical IT Support System. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
\`\`\`

## Google Sheets Structure

Set up a Google Sheet with the following structure:

1. **Main Dashboard** (first sheet)
   - Overview of all tickets across clinics
   - Summary stats and priority counts
   - Last updated timestamp

2. **Clinic-specific sheets** (one per clinic)
   - All ticket details in columns as described above
   - Conditional formatting:
     - Critical: Light red background
     - High: Light orange background
     - Medium: Light yellow background
     - Low: Light green background

3. **Archived** sheet
   - For resolved tickets
   - Keep same structure as main ticket sheets

## AI Conversation Flow

The n8n workflow should facilitate a conversation between the user and an AI assistant through webhook responses:

1. User submits initial ticket
2. AI processes ticket and may:
   - Ask follow-up questions for clarification
   - Suggest potential solutions
   - Provide estimated response time
   - Log all interactions in the Google Sheet

## Implementation Steps

1. Create n8n workflow using the components above
2. Set up Google Sheets with the described structure
3. Create email templates
4. Configure webhook URL in your application
5. Test end-to-end flow
6. Monitor and refine

## Conclusion

This n8n workflow creates a complete system for handling IT support tickets from submission to resolution, with appropriate routing, notifications, and data storage.
`;
