
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "transition-all duration-200",
          error ? "border-destructive ring-destructive" : "focus:ring-2 focus:ring-primary/20"
        )}
      />
      {error && (
        <p className="text-destructive text-xs animate-fade-in">{error}</p>
      )}
    </div>
  );
};

interface SelectFieldProps {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Select...",
  required = false,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select 
        value={value || ""} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} className={cn(
          "transition-all duration-200",
          error ? "border-destructive ring-destructive" : "focus:ring-2 focus:ring-primary/20"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-destructive text-xs animate-fade-in">{error}</p>
      )}
    </div>
  );
};
