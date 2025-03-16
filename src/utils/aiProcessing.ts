import { FormData, Priority } from "../types";

/**
 * Reformulates the user's issue description into a more structured format
 * In a production environment, this would call an AI service API
 */
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
    "black screen": "display failure",
    "can't log in": "authentication failure",
    "access denied": "permission error",
    "missing files": "file system corruption",
    "virus": "malware infection"
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

/**
 * Determines the appropriate category for a support ticket based on description
 * Would be replaced with actual AI categorization in production
 */
export const determineCategory = (description: string): string => {
  // This would use NLP in a real implementation
  const categories = [
    { 
      name: "Hardware", 
      keywords: ["computer", "monitor", "printer", "keyboard", "mouse", "device", "scanner", "headset", "camera", "microphone", "battery", "power", "charging", "display", "screen", "hardware", "physical", "equipment", "broken", "damaged", "usb", "hdmi", "port", "cable", "adapter"] 
    },
    { 
      name: "Software", 
      keywords: ["program", "application", "windows", "software", "install", "update", "upgrade", "download", "license", "activation", "error message", "crash", "freeze", "unresponsive", "restart", "reboot", "hang", "slow", "performance", "memory", "startup", "boot", "exit", "close", "system", "operating system", "app"] 
    },
    { 
      name: "Network", 
      keywords: ["internet", "wifi", "wireless", "connection", "network", "ethernet", "router", "modem", "connectivity", "vpn", "proxy", "firewall", "dns", "ip address", "offline", "online", "disconnected", "reconnect", "slow connection", "bandwidth", "latency", "packet loss", "server"] 
    },
    { 
      name: "Access", 
      keywords: ["login", "password", "account", "permission", "access", "credentials", "authentication", "authorization", "user", "username", "reset", "forgot", "denied", "restricted", "role", "security", "sign in", "sign out", "session", "timeout", "mfa", "two-factor", "verification"] 
    },
    { 
      name: "Email", 
      keywords: ["email", "outlook", "mail", "message", "inbox", "outbox", "sent", "received", "attachment", "calendar", "invite", "signature", "filter", "rule", "folder", "archive", "mailbox", "exchange", "smtp", "bounce", "spam", "junk", "phishing"] 
    },
    {
      name: "Clinical Software",
      keywords: ["ehr", "emr", "electronic health record", "epic", "cerner", "allscripts", "athena", "meditech", "nextgen", "patient portal", "medical record", "charting", "billing", "scheduling", "appointment", "imaging", "pacs", "radiology", "lab", "laboratory", "results", "pharmacy", "medication", "prescription", "vitals"]
    },
    {
      name: "Security",
      keywords: ["security", "breach", "virus", "malware", "ransomware", "phishing", "suspicious", "unauthorized", "privacy", "compliance", "hipaa", "data protection", "encrypted", "compromised", "threat", "vulnerability", "antivirus", "backup", "data loss", "leak"]
    }
  ];
  
  const lowerDesc = description.toLowerCase();
  
  // Count matching keywords per category
  const categoryMatches = categories.map(category => {
    const matchCount = category.keywords.filter(keyword => lowerDesc.includes(keyword)).length;
    return { name: category.name, matchCount };
  });
  
  // Sort by match count (highest first)
  categoryMatches.sort((a, b) => b.matchCount - a.matchCount);
  
  // If we have matches, return the top category
  if (categoryMatches[0].matchCount > 0) {
    return categoryMatches[0].name;
  }
  
  // Default if no matches
  return "General IT Support";
};

/**
 * Determines if a ticket should be escalated based on certain criteria
 */
export const shouldEscalate = (formData: FormData): boolean => {
  // Automatically escalate high and critical priority tickets
  if (formData.priority === "critical" || formData.priority === "high") {
    return true;
  }
  
  const criticalKeywords = [
    "urgent", "emergency", "immediately", "critical", "crashed", "down", "breach", 
    "security", "hipaa", "patient", "data loss", "ransomware", "virus", "malware",
    "exposed", "compliance", "legal", "lawsuit", "cannot work", "completely broken"
  ];
  
  const description = formData.description.toLowerCase();
  return criticalKeywords.some(keyword => description.includes(keyword));
};

/**
 * Suggests an appropriate priority level based on the issue description
 */
export const suggestPriority = (description: string): Priority => {
  const lowerDesc = description.toLowerCase();
  
  const criticalPatterns = [
    /\b(urgent|emergency|immediately|asap|critical)\b/,
    /\b(complete|total|entire|all)\s+(failure|outage|down)\b/,
    /\bsecurity breach\b/,
    /\b(ransomware|virus|malware)\b/,
    /\bpatient\s+(safety|care)\b/,
    /\bprevents\s+(patient|medical|clinical)\s+(care|treatment|diagnosis)\b/,
    /\blife\s+or\s+death\b/
  ];
  
  const highPatterns = [
    /\b(many|multiple|several|group)\s+(users|people|staff|employees)\b/,
    /\bcannot\s+(work|function|complete|perform)\b/,
    /\b(department|clinic|wing)\s+(affected|impacted)\b/,
    /\bpatient\s+data\b/,
    /\b(important|high-priority)\s+(meeting|procedure|operation)\b/
  ];
  
  const lowPatterns = [
    /\b(minor|small|low|trivial)\b/,
    /\b(single|one|individual)\s+user\b/,
    /\bnot\s+urgent\b/,
    /\bwhen\s+convenient\b/,
    /\bnice\s+to\s+have\b/
  ];
  
  // Check if any critical patterns match
  if (criticalPatterns.some(pattern => pattern.test(lowerDesc))) {
    return "critical";
  }
  
  // Check if any high patterns match
  if (highPatterns.some(pattern => pattern.test(lowerDesc))) {
    return "high";
  }
  
  // Check if any low patterns match
  if (lowPatterns.some(pattern => pattern.test(lowerDesc))) {
    return "low";
  }
  
  // Default to medium
  return "medium";
};

/**
 * Sanitizes user input data for security and consistency
 */
export const sanitizeData = (formData: FormData): FormData => {
  const sanitized = { ...formData };
  
  // Trim all string values
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key as keyof FormData];
    if (typeof value === 'string') {
      // @ts-ignore - Type safety is maintained here
      sanitized[key as keyof FormData] = value.trim();
    }
  });
  
  // Additional sanitization could be added here
  
  return sanitized;
};

/**
 * Provides AI suggestions for possible solutions based on the issue description
 */
export const suggestSolution = (description: string, category: string): string => {
  const lowerDesc = description.toLowerCase();
  
  // Simple rule-based suggestion system - would be replaced with AI in production
  if (category === "Hardware") {
    if (lowerDesc.includes("printer") || lowerDesc.includes("print")) {
      return "Try restarting the printer, checking for paper jams, and ensuring it's connected to the network. If problems persist, please have the printer model number ready.";
    }
    if (lowerDesc.includes("monitor") || lowerDesc.includes("display") || lowerDesc.includes("screen")) {
      return "Check all cable connections, try a different video cable if available, and test the monitor with another computer if possible.";
    }
    return "Try turning the device off completely, waiting 30 seconds, and then turning it back on. Check all cable connections are secure.";
  }
  
  if (category === "Software") {
    if (lowerDesc.includes("crash") || lowerDesc.includes("freeze") || lowerDesc.includes("unresponsive")) {
      return "Save your work in other applications, restart the software. If the issue persists, try rebooting your computer and updating the application.";
    }
    if (lowerDesc.includes("update") || lowerDesc.includes("upgrade")) {
      return "Ensure you have a stable internet connection, sufficient disk space, and administrative privileges to complete the update.";
    }
    return "Try closing and reopening the application. If that doesn't work, restart your computer and try again.";
  }
  
  if (category === "Network") {
    if (lowerDesc.includes("wifi") || lowerDesc.includes("wireless")) {
      return "Try disconnecting from the WiFi network and reconnecting. Ensure you're connecting to the correct network, and consider moving closer to the access point.";
    }
    return "Restart your computer's network connection, restart your router/modem if accessible, and verify other devices are able to connect.";
  }
  
  if (category === "Access") {
    if (lowerDesc.includes("password") || lowerDesc.includes("forgot")) {
      return "Use the password reset function if available. If you're still unable to access your account, the IT team will need to verify your identity before resetting credentials.";
    }
    return "Check that you're using the correct username and password. Ensure Caps Lock is not enabled, and your account has not been locked due to multiple failed attempts.";
  }
  
  if (category === "Email") {
    if (lowerDesc.includes("attachment")) {
      return "Check that the attachment isn't too large (over 25MB). Try compressing the file or using a file sharing service instead.";
    }
    return "Try accessing your email through webmail to see if the issue is with your email client or the email service itself.";
  }
  
  if (category === "Clinical Software") {
    return "Please provide the exact error message if available. The IT team will need specific information about which screen/module you were using when the issue occurred.";
  }
  
  if (category === "Security") {
    return "Do not turn off your computer or click on any suspicious links/attachments. Disconnect from the network if possible and contact IT security immediately.";
  }
  
  return "Please provide more details about your issue so we can better assist you. Screenshots or error messages would be helpful.";
};
