
import React from "react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Stethoscope, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-primary">Medical IT Support</h1>
        </div>
        
        <Link to="/workflow">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Workflow Documentation
          </Button>
        </Link>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 flex flex-col">
        <div className="max-w-3xl mx-auto text-center mb-8 animate-fade-in">
          <h2 className="text-xl md:text-2xl font-medium mb-3 text-gray-800">
            Welcome to the Medical Clinic IT Support Portal
          </h2>
          <p className="text-muted-foreground">
            Please use the chat interface below to report any technical issues. 
            Our AI assistant will guide you through the process.
          </p>
        </div>
        
        <div className="flex-1 flex">
          <ChatInterface />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
        <p>© 2023 Medical IT Support Network</p>
      </footer>
    </div>
  );
};

export default Index;
