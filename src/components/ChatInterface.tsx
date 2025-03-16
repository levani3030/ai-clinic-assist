import React, { useState, useRef, useEffect } from "react";
import { 
  Clinic, 
  ClinicId, 
  FormData, 
  FormStep, 
  Message, 
  MessageRole, 
  Priority,
  N8nWorkflowData
} from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2, Send, AlertCircle } from "lucide-react";
import { 
  validateFormStep, 
  validateDescription, 
  validateFloor, 
  validatePhone, 
  validateRoom,
  formatPhoneNumber
} from "../utils/validation";
import { 
  reformulateIssue, 
  determineCategory, 
  suggestPriority, 
  sanitizeData, 
  shouldEscalate 
} from "../utils/aiProcessing";
import { prepareWorkflowData, sendToN8nWebhook } from "../utils/n8nWorkflow";
import MessageBubble from "./MessageBubble";
import ClinicSelection from "./ClinicSelection";
import PrioritySelector from "./PrioritySelector";
import { InputField, SelectField } from "./FormFields";
import { useToast } from "@/hooks/use-toast";

// Clinic data
const clinics: Clinic[] = [
  {
    id: "northside",
    name: "Northside Medical Center",
    color: "blue",
    departments: ["Administration", "Radiology", "Emergency", "Laboratory", "Cardiology"]
  },
  {
    id: "westview",
    name: "Westview Health Clinic",
    color: "green",
    departments: ["General Practice", "Pediatrics", "Physical Therapy", "Pharmacy"]
  },
  {
    id: "central",
    name: "Central Hospital",
    color: "purple",
    departments: ["Surgery", "ICU", "Oncology", "Neurology", "Orthopedics"]
  },
  {
    id: "eastside",
    name: "Eastside Family Practice",
    color: "pink",
    departments: ["Family Medicine", "OB/GYN", "Mental Health", "Nutrition"]
  }
];

const ChatInterface: React.FC = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "Welcome to Medical IT Support! I'll guide you through reporting your technical issue. Let's start by selecting your clinic.",
      timestamp: new Date()
    }
  ]);
  
  const [formData, setFormData] = useState<FormData>({
    clinic: null,
    department: null,
    floor: "",
    room: "",
    phone: "",
    priority: null,
    description: ""
  });
  
  const [currentStep, setCurrentStep] = useState<FormStep>("clinic");
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  
  // Update selected clinic when the clinic ID changes
  useEffect(() => {
    if (formData.clinic) {
      const clinic = clinics.find(c => c.id === formData.clinic);
      if (clinic) {
        setSelectedClinic(clinic);
      }
    } else {
      setSelectedClinic(null);
    }
  }, [formData.clinic]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const addMessage = (content: string, role: MessageRole = "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      step: currentStep // Track which step this message belongs to
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleUserMessage = (content: string) => {
    addMessage(content, "user");
  };
  
  const handleClinicSelect = (clinicId: ClinicId) => {
    setFormData(prev => ({
      ...prev,
      clinic: clinicId,
      department: null // Reset department when clinic changes
    }));
    
    setErrors(prev => ({ ...prev, clinic: "" }));
  };
  
  const handleDepartmentSelect = (department: string) => {
    setFormData(prev => ({
      ...prev,
      department
    }));
    
    setErrors(prev => ({ ...prev, department: "" }));
  };
  
  const validateCurrentStep = (): boolean => {
    const validation = validateFormStep(formData, currentStep);
    
    if (!validation.isValid && validation.message) {
      setErrors(prev => ({ ...prev, [currentStep]: validation.message }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, [currentStep]: "" }));
    return true;
  };
  
  const moveToNextStep = () => {
    if (!validateCurrentStep()) return;
    
    const steps: FormStep[] = [
      "clinic",
      "department",
      "location",
      "contact",
      "priority",
      "description",
      "confirmation"
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      
      // Add appropriate system message based on the next step
      switch (nextStep) {
        case "department":
          addMessage(`Great! You've selected ${selectedClinic?.name}. Now, please select your department.`);
          break;
        case "location":
          addMessage(`Thanks! Now I need to know your location. Please enter the floor and room number.`);
          break;
        case "contact":
          addMessage(`Please provide your contact phone number so the IT team can reach you if needed.`);
          break;
        case "priority":
          addMessage(`How would you categorize the priority of this issue?`);
          break;
        case "description":
          addMessage(`Please describe the technical issue you're experiencing. Provide as much detail as possible.`);
          break;
        case "confirmation":
          const reformulatedIssue = reformulateIssue(formData.description);
          const category = determineCategory(formData.description);
          const needsEscalation = shouldEscalate(formData);
          
          let confirmationMessage = `
**Technical Issue Summary**

**Clinic:** ${selectedClinic?.name}
**Department:** ${formData.department}
**Location:** Floor ${formData.floor}, Room ${formData.room}
**Contact:** ${formatPhoneNumber(formData.phone)}
**Priority:** ${formData.priority?.toUpperCase()}
**Category:** ${category}

**Description:**
${reformulatedIssue}

${needsEscalation ? "⚠️ This issue has been flagged for immediate escalation based on its description and priority." : ""}

Is this information correct? Your ticket will be created and routed to the appropriate IT support team.`;
          
          addMessage(confirmationMessage);
          break;
      }
    }
  };
  
  const handleInputChange = (
    field: keyof FormData,
    value: string | ClinicId | Priority | null
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for the field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const handleTextareaSubmit = () => {
    if (!inputText.trim()) return;
    
    if (currentStep === "description") {
      // For description step, we validate and then process
      const validation = validateDescription(inputText);
      if (!validation.isValid && validation.message) {
        setErrors(prev => ({ ...prev, description: validation.message }));
        return;
      }
      
      setErrors(prev => ({ ...prev, description: "" }));
      handleUserMessage(inputText);
      handleInputChange("description", inputText);
      setInputText("");
      
      // Process with a slight delay to simulate AI thinking
      setIsProcessing(true);
      setTimeout(() => {
        moveToNextStep();
        setIsProcessing(false);
      }, 1000);
    } else {
      // For other free-text inputs or follow-up questions
      handleUserMessage(inputText);
      setInputText("");
      
      // Simulate AI processing
      setIsProcessing(true);
      setTimeout(() => {
        // This would be replaced with actual AI responses
        addMessage("Thank you for providing that information. I'll update your ticket accordingly.");
        setIsProcessing(false);
      }, 1000);
    }
  };
  
  const handleSubmitTicket = () => {
    setIsProcessing(true);
    
    // Prepare data for n8n workflow
    const workflowData = prepareWorkflowData(formData, selectedClinic?.name || "Unknown Clinic");
    
    // In production, this would call an actual API endpoint
    sendToN8nWebhook(workflowData)
      .then(response => {
        if (response.success) {
          // Success notification
          toast({
            title: "Support Ticket Created",
            description: `Ticket ${workflowData.ticketId} has been submitted to ${selectedClinic?.name} IT support team.`,
          });
          
          addMessage(`Thank you! Your IT support ticket (${workflowData.ticketId}) has been created successfully. The support team will contact you soon at ${formatPhoneNumber(formData.phone)}. You can close this chat or submit another issue.`);
          
          // Reset the form for a new ticket
          setFormData({
            clinic: null,
            department: null,
            floor: "",
            room: "",
            phone: "",
            priority: null,
            description: ""
          });
          
          setCurrentStep("clinic");
        } else {
          toast({
            title: "Error",
            description: "There was a problem creating your ticket. Please try again.",
            variant: "destructive"
          });
        }
        setIsProcessing(false);
      })
      .catch(error => {
        console.error("Error submitting ticket:", error);
        toast({
          title: "Error",
          description: "There was a problem creating your ticket. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
      });
  };
  
  const renderFormStep = () => {
    switch (currentStep) {
      case "clinic":
        return (
          <ClinicSelection
            clinics={clinics}
            selectedClinic={formData.clinic}
            onSelectClinic={handleClinicSelect}
            error={errors.clinic}
          />
        );
        
      case "department":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center mb-6">Select Your Department</h2>
            
            {selectedClinic && (
              <SelectField
                id="department"
                label="Department"
                value={formData.department}
                onChange={(value) => handleDepartmentSelect(value)}
                options={selectedClinic.departments.map(dept => ({
                  value: dept,
                  label: dept
                }))}
                error={errors.department}
                placeholder="Select department"
                required
              />
            )}
          </div>
        );
        
      case "location":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center mb-6">Enter Your Location</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id="floor"
                label="Floor"
                value={formData.floor}
                onChange={(value) => handleInputChange("floor", value)}
                error={errors.floor}
                placeholder="e.g., 3"
                required
              />
              
              <InputField
                id="room"
                label="Room"
                value={formData.room}
                onChange={(value) => handleInputChange("room", value)}
                error={errors.room}
                placeholder="e.g., 302B"
                required
              />
            </div>
          </div>
        );
        
      case "contact":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center mb-6">Contact Information</h2>
            
            <InputField
              id="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
              error={errors.phone}
              placeholder="(123) 456-7890"
              required
            />
          </div>
        );
        
      case "priority":
        return (
          <PrioritySelector
            selectedPriority={formData.priority}
            onSelectPriority={(priority) => handleInputChange("priority", priority)}
            error={errors.priority}
          />
        );
        
      case "description":
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center mb-6">Describe Your Issue</h2>
            
            <div className="space-y-2">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Please describe the technical issue in detail..."
                className={cn(
                  "min-h-32 resize-none transition-all duration-200",
                  errors.description ? "border-destructive ring-destructive" : "focus:ring-2 focus:ring-primary/20"
                )}
              />
              
              {errors.description && (
                <p className="text-destructive text-xs animate-fade-in">{errors.description}</p>
              )}
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleTextareaSubmit}
                  className="flex items-center gap-2"
                  disabled={isProcessing || !inputText.trim()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "confirmation":
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-center">Confirm Ticket Submission</h2>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("description")}
                disabled={isProcessing}
              >
                Edit Details
              </Button>
              
              <Button 
                onClick={handleSubmitTicket}
                className="flex items-center gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Ticket
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
            {formData.priority === "critical" && (
              <div className="bg-priority-critical/10 border border-priority-critical/20 rounded-lg p-4 mt-4">
                <p className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-priority-critical" />
                  <span>
                    Critical tickets receive immediate attention and will be escalated to senior IT staff.
                  </span>
                </p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <Card className="flex-1 flex flex-col overflow-hidden glass-panel">
        <CardContent className="flex-1 flex flex-col p-4 h-full">
          {/* Messages area - now with filtering */}
          <div className="flex-1 overflow-y-auto mb-4 px-2">
            <div className="py-4">
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  hide={message.step !== undefined && message.step !== currentStep}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Form area */}
          <div 
            className={cn(
              "bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-border animate-scale-in",
              selectedClinic && `border-clinic-${selectedClinic.color} ring-1 ring-clinic-${selectedClinic.color}/20`
            )}
          >
            {renderFormStep()}
            
            {/* Next button for steps that don't have their own submission mechanism */}
            {(currentStep === "clinic" || 
              currentStep === "department" || 
              currentStep === "location" || 
              currentStep === "contact" || 
              currentStep === "priority") && (
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={moveToNextStep}
                  className="flex items-center gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
