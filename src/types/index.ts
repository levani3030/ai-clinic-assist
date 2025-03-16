
export type ClinicId = "northside" | "westview" | "central" | "eastside";

export interface Clinic {
  id: ClinicId;
  name: string;
  color: "blue" | "green" | "purple" | "pink";
  departments: string[];
}

export type Priority = "low" | "medium" | "high" | "critical";

export interface PriorityOption {
  value: Priority;
  label: string;
  description: string;
  color: string;
}

export type MessageRole = "user" | "system" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  step?: FormStep; // Add step property to track which form step the message belongs to
}

export interface FormData {
  clinic: ClinicId | null;
  department: string | null;
  floor: string;
  room: string;
  phone: string;
  priority: Priority | null;
  description: string;
}

export type FormStep = 
  | "clinic"
  | "department"
  | "location"
  | "contact"
  | "priority"
  | "description"
  | "confirmation";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface N8nWorkflowData {
  ticketId: string;
  clinicName: string;
  department: string;
  location: string;
  phone: string;
  priority: string;
  description: string;
  category: string;
  timestamp: string;
  needsEscalation: boolean;
}
