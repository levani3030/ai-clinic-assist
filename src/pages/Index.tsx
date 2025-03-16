import React, { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Stethoscope, FileText, Webhook, ChevronDown, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import TestWebhookButton from "@/components/TestWebhookButton";
import N8nConfigPanel from "@/components/N8nConfigPanel";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [showAdminTools, setShowAdminTools] = useState(false);
  
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
        
        <div className="flex items-center gap-2">
          <Link to="/workflow">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Workflow Documentation
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Admin
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowAdminTools(!showAdminTools)}>
                {showAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="http://localhost:5678" target="_blank" rel="noopener noreferrer">
                  Open n8n Dashboard
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      {/* Admin Tools Section */}
      {showAdminTools && (
        <div className="bg-slate-100 p-4 border-b">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-sm font-semibold mb-3">Admin Tools</h3>
            
            <Tabs defaultValue="test">
              <TabsList className="mb-4">
                <TabsTrigger value="test">Test Tools</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="test" className="space-y-4">
                <div className="flex flex-col gap-2">
                  <TestWebhookButton />
                  <p className="text-xs text-muted-foreground">
                    Run a test to verify connectivity with your n8n webhook.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="config">
                <N8nConfigPanel />
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center mt-4 pt-2 border-t border-gray-200">
              <Webhook className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Make sure your n8n instance is running and properly configured.
              </p>
            </div>
          </div>
        </div>
      )}
      
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
