
import React from "react";
import { Message } from "../types";
import { cn } from "@/lib/utils";
import { Stethoscope, User } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  hide?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, hide = false }) => {
  const isUser = message.role === "user";
  
  if (hide) return null;
  
  return (
    <div
      className={cn(
        "flex items-start gap-2 mb-4 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary" : "bg-secondary"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Stethoscope className="h-5 w-5 text-primary" />
        )}
      </div>
      
      <div
        className={cn(
          "px-4 py-3 rounded-2xl max-w-[80%]",
          isUser 
            ? "chat-bubble-user rounded-tr-none" 
            : "chat-bubble-system rounded-tl-none"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
