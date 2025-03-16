
import React from "react";
import { Clinic, ClinicId } from "../types";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface ClinicSelectionProps {
  clinics: Clinic[];
  selectedClinic: ClinicId | null;
  onSelectClinic: (clinicId: ClinicId) => void;
  error?: string;
}

const ClinicSelection: React.FC<ClinicSelectionProps> = ({
  clinics,
  selectedClinic,
  onSelectClinic,
  error
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center mb-6">Select Your Clinic</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clinics.map((clinic) => (
          <button
            key={clinic.id}
            onClick={() => onSelectClinic(clinic.id)}
            className={cn(
              "relative p-6 rounded-xl border-2 transition-all duration-300",
              `clinic-${clinic.color}-theme`,
              selectedClinic === clinic.id
                ? "bg-white shadow-lg"
                : "bg-white/50 hover:bg-white hover:shadow-md"
            )}
          >
            {selectedClinic === clinic.id && (
              <div className="absolute top-3 right-3 text-primary animate-fade-in">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
            
            <h3 className={cn(
              "text-lg font-medium mb-2",
              `text-clinic-${clinic.color}`
            )}>
              {clinic.name}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              {clinic.departments.length} departments
            </p>
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-destructive text-sm text-center mt-4 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default ClinicSelection;
