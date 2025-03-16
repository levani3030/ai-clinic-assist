
import React from "react";
import { Stethoscope, Workflow, Mail, Table, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { N8N_WORKFLOW_GUIDE } from "../utils/n8nWorkflow";
import { Separator } from "@/components/ui/separator";

const WorkflowDocs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="p-6 flex justify-center items-center border-b bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-primary">Medical IT Support</h1>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-medium mb-3 text-gray-800">
            n8n Workflow Documentation
          </h2>
          <p className="text-muted-foreground">
            Complete guide for setting up the n8n workflow to process IT support tickets
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Workflow className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Automated Workflow</h3>
                <p className="text-sm text-muted-foreground">
                  Complete end-to-end automation for processing support tickets
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Branded HTML templates with medical-themed styling
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Table className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Google Sheets Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Automated tracking with priority-based conditional formatting
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white/80 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-medium">AI-Powered Workflow</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              The workflow incorporates AI processing for issue categorization, priority suggestion, 
              and automated escalation based on content analysis. The AI assistant guides users through 
              the support process and provides contextual help.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Key AI Features</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Natural language processing for issue categorization</li>
                <li>Automatic priority suggestion based on description analysis</li>
                <li>Intelligent escalation rules for critical issues</li>
                <li>Conversational guidance throughout the support process</li>
                <li>Contextual follow-up questions when details are unclear</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Complete Workflow Guide</h3>
            <Separator className="mb-4" />
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-xs overflow-auto bg-gray-50 p-4 rounded-lg">
                {N8N_WORKFLOW_GUIDE}
              </pre>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-sm text-muted-foreground">
        <p>© 2023 Medical IT Support Network</p>
      </footer>
    </div>
  );
};

export default WorkflowDocs;
