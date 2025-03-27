
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PlannerForm } from "@/components/PlannerForm";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white flex flex-col">
      <header className="py-4 px-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">PartyPilot</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
            Help
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {isChatOpen ? (
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        ) : (
          <div className="max-w-3xl w-full mx-auto text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              PartyPilot
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your AI co-pilot for creating unforgettable events - from concept to execution in minutes
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button 
                className="p-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Let's plan together. Chat with me!
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="p-6 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-0 rounded-xl text-white"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    I'm in a rush. Fill a form!
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto bg-[#222] border-gray-800">
                  <SheetHeader className="mb-5">
                    <SheetTitle className="text-white">Event Planner</SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Fill out the details below to get AI-generated event plans with downloadable invitations.
                    </SheetDescription>
                  </SheetHeader>
                  <PlannerForm />
                </SheetContent>
              </Sheet>
            </div>

            <div className="mt-16 text-sm text-gray-300">
              Your personal event planner!
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
