
import React from "react";
import { Priority, PriorityOption } from "../types";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert
} from "lucide-react";

interface PrioritySelectorProps {
  selectedPriority: Priority | null;
  onSelectPriority: (priority: Priority) => void;
  error?: string;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selectedPriority,
  onSelectPriority,
  error
}) => {
  const priorityOptions: PriorityOption[] = [
    {
      value: "low",
      label: "Low",
      description: "Non-urgent issue that does not impact work",
      color: "bg-priority-low"
    },
    {
      value: "medium",
      label: "Medium",
      description: "Issue impacts work but has workarounds",
      color: "bg-priority-medium"
    },
    {
      value: "high",
      label: "High",
      description: "Significant impact with limited workarounds",
      color: "bg-priority-high"
    },
    {
      value: "critical",
      label: "Critical",
      description: "Complete work stoppage, patient care affected",
      color: "bg-priority-critical"
    }
  ];
  
  const getIcon = (priority: Priority) => {
    switch (priority) {
      case "low":
        return <Clock className="h-5 w-5" />;
      case "medium":
        return <CheckCircle2 className="h-5 w-5" />;
      case "high":
        return <AlertTriangle className="h-5 w-5" />;
      case "critical":
        return <ShieldAlert className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center mb-6">Select Issue Priority</h2>
      
      <div className="space-y-3">
        {priorityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelectPriority(option.value)}
            className={cn(
              "w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4",
              selectedPriority === option.value
                ? "border-2 border-primary bg-white shadow-md"
                : "border-border bg-white/50 hover:bg-white hover:shadow-sm"
            )}
          >
            <div 
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-white",
                option.color
              )}
            >
              {getIcon(option.value)}
            </div>
            
            <div className="text-left">
              <h3 className="font-medium">{option.label}</h3>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-destructive text-sm text-center mt-4 animate-fade-in">
          {error}
        </p>
      )}
      
      {selectedPriority === "critical" && (
        <div className="bg-priority-critical/10 border border-priority-critical/20 rounded-lg p-4 mt-4 animate-fade-in">
          <p className="text-sm flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-priority-critical" />
            <span>
              Critical incidents are escalated immediately to senior support staff
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PrioritySelector;
