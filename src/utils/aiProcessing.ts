
import { FormData, Priority } from "../types";

// This is a mock implementation that would be replaced with actual AI processing
export const reformulateIssue = (description: string): string => {
  // In a real implementation, this would call an AI model API
  // For now, we'll do a simple transformation to demonstrate the concept
  
  const technicalTerms: Record<string, string> = {
    "not working": "non-functional",
    "broken": "malfunctioning",
    "frozen": "unresponsive",
    "slow": "performance degradation",
    "crashed": "application failure",
    "error": "exception",
    "blue screen": "BSOD (Blue Screen of Death)",
    "wifi": "wireless network",
    "internet": "network connectivity",
    "printing": "print service",
    "won't start": "boot failure",
    "black screen": "display failure"
  };
  
  let technicalDescription = description;
  
  // Replace common terms with more technical ones
  Object.entries(technicalTerms).forEach(([term, technical]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    technicalDescription = technicalDescription.replace(regex, technical);
  });
  
  // Add a more structured format
  return `Technical Issue Report: ${technicalDescription}`;
};

export const determineCategory = (description: string): string => {
  // This would use NLP in a real implementation
  const categories = [
    { name: "Hardware", keywords: ["computer", "monitor", "printer", "keyboard", "mouse", "device"] },
    { name: "Software", keywords: ["program", "application", "windows", "software", "install", "update"] },
    { name: "Network", keywords: ["internet", "wifi", "wireless", "connection", "network", "ethernet"] },
    { name: "Access", keywords: ["login", "password", "account", "permission", "access"] },
    { name: "Email", keywords: ["email", "outlook", "mail", "message"] }
  ];
  
  const lowerDesc = description.toLowerCase();
  
  for (const category of categories) {
    if (category.keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category.name;
    }
  }
  
  return "General";
};

export const shouldEscalate = (formData: FormData): boolean => {
  const criticalKeywords = [
    "urgent", "emergency", "critical", "down", "outage", "patient", "immediate", 
    "security", "breach", "virus", "malware", "ransomware", "data loss"
  ];
  
  const isPriorityCritical = formData.priority === "critical" || formData.priority === "high";
  const containsCriticalKeywords = criticalKeywords.some(keyword => 
    formData.description.toLowerCase().includes(keyword)
  );
  
  return isPriorityCritical || containsCriticalKeywords;
};

export const suggestPriority = (description: string): Priority => {
  const criticalKeywords = ["urgent", "emergency", "critical", "patients", "safety"];
  const highKeywords = ["down", "not working", "broken", "outage", "multiple users"];
  const mediumKeywords = ["slow", "issue", "problem", "error", "single user"];
  
  const lowerDesc = description.toLowerCase();
  
  if (criticalKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return "critical";
  } else if (highKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return "high";
  } else if (mediumKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return "medium";
  }
  
  return "low";
};

export const sanitizeData = (formData: FormData): FormData => {
  // In a real implementation, this would sanitize inputs more thoroughly
  // For now, we'll just trim strings
  return {
    ...formData,
    floor: formData.floor.trim(),
    room: formData.room.trim(),
    phone: formData.phone.trim(),
    description: formData.description.trim()
  };
};
