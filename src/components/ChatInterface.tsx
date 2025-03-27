
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { InvitationPreview } from "./InvitationPreview";
import { processUserMessage } from "@/utils/chatUtils";

type ChatInterfaceProps = {
  onClose: () => void;
};

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello! I'm your AI event planner assistant. I'll help you create an amazing event!
      
To get started, please tell me:
• What type of event are you planning? (birthday, wedding, corporate, etc.)
• Who is it for? (name, age if relevant)
• When will it take place? (date and time)
• How many guests do you expect?
• Do you have a specific theme or style in mind?
• Any food preferences or dietary restrictions?
• What's your approximate budget?
• Any special requests or must-have features?

The more details you share, the better I can help you plan!`,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitationText, setInvitationText] = useState("");
  const [theme, setTheme] = useState("Party");
  const [partyPlan, setPartyPlan] = useState<any>(null);
  
  const { toast } = useToast();

  const handleSend = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      try {
        const { response, partyPlan: newPartyPlan } = await processUserMessage(input);
        
        if (newPartyPlan) {
          setPartyPlan(newPartyPlan);
          const selectedTheme = newPartyPlan.plans[0].theme;
          setTheme(selectedTheme);
          setInvitationText(newPartyPlan.invitationText);
        }

        const aiMessage: Message = {
          id: Date.now().toString(),
          content: response,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate a response. Please try again.",
          variant: "destructive",
        });
        console.error("Error generating response:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const showInvitationPreview = () => {
    setShowInvitation(true);
  };

  const downloadPlan = () => {
    if (!partyPlan) return;
    
    const selectedPlan = partyPlan.plans[0];
    const planText = `
# ${selectedPlan.title}

## Description
${selectedPlan.description}

## Theme
${selectedPlan.theme}

## Activities
${selectedPlan.activities.map((a: string) => `- ${a}`).join('\n')}

## Food Ideas
${selectedPlan.foodIdeas.map((f: string) => `- ${f}`).join('\n')}

## Drink Ideas
${selectedPlan.drinkIdeas ? selectedPlan.drinkIdeas.map((d: string) => `- ${d}`).join('\n') : "- Based on your preferences"}

## Decorations
${selectedPlan.decorations ? selectedPlan.decorations.map((d: string) => `- ${d}`).join('\n') : "- Themed decorations"}

## Venue Suggestions
${selectedPlan.venues ? selectedPlan.venues.map((v: string) => `- ${v}`).join('\n') : "- Based on your location preferences"}

## Budget
Estimated Cost: ${selectedPlan.estimatedCost}

## Invitation
${partyPlan.invitationText}
`;

    const element = document.createElement("a");
    const file = new Blob([planText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedPlan.theme}_Event_Plan.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Success",
      description: "Event plan downloaded successfully!",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Event Planning Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <MessageList 
        messages={messages}
        isLoading={isLoading}
        partyPlan={partyPlan}
        showInvitationPreview={showInvitationPreview}
        downloadPlan={downloadPlan}
      />

      {showInvitation && (
        <div className="mb-4 bg-gray-800 rounded-lg p-4">
          <InvitationPreview invitationText={invitationText} theme={theme} />
          <Button 
            variant="ghost"
            className="mt-2 text-gray-400 hover:text-white"
            onClick={() => setShowInvitation(false)}
          >
            Close Preview
          </Button>
        </div>
      )}

      <ChatInput isLoading={isLoading} onSendMessage={handleSend} />
    </div>
  );
}
