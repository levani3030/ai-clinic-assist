
import { FormData, ValidationResult } from "../types";

export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  
  if (!phone.trim()) {
    return {
      isValid: false,
      message: "Phone number is required"
    };
  }
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      message: "Please enter a valid phone number"
    };
  }
  
  return { isValid: true };
};

export const validateFloor = (floor: string): ValidationResult => {
  if (!floor.trim()) {
    return {
      isValid: false,
      message: "Floor is required"
    };
  }
  
  return { isValid: true };
};

export const validateRoom = (room: string): ValidationResult => {
  if (!room.trim()) {
    return {
      isValid: false,
      message: "Room number is required"
    };
  }
  
  return { isValid: true };
};

export const validateDescription = (description: string): ValidationResult => {
  if (!description.trim()) {
    return {
      isValid: false,
      message: "Please describe the issue"
    };
  }
  
  if (description.trim().length < 10) {
    return {
      isValid: false,
      message: "Please provide more details about the issue"
    };
  }
  
  return { isValid: true };
};

export const validateFormStep = (
  formData: FormData,
  step: string
): ValidationResult => {
  switch (step) {
    case "clinic":
      return formData.clinic
        ? { isValid: true }
        : { isValid: false, message: "Please select a clinic" };

    case "department":
      return formData.department
        ? { isValid: true }
        : { isValid: false, message: "Please select a department" };

    case "location":
      const floorValidation = validateFloor(formData.floor);
      if (!floorValidation.isValid) return floorValidation;
      
      return validateRoom(formData.room);

    case "contact":
      return validatePhone(formData.phone);

    case "priority":
      return formData.priority
        ? { isValid: true }
        : { isValid: false, message: "Please select a priority level" };

    case "description":
      return validateDescription(formData.description);

    default:
      return { isValid: true };
  }
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};
