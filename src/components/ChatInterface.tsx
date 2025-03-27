
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePartyPlan } from "@/lib/ai";
import { InvitationPreview } from "./InvitationPreview";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

type ChatInterfaceProps = {
  onClose: () => void;
};

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI event planner assistant. What type of event would you like to plan today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [invitationText, setInvitationText] = useState("");
  const [theme, setTheme] = useState("Party");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      try {
        let aiResponse = "";
        
        // Check if this looks like an event planning request
        if (input.toLowerCase().includes("plan") || 
            input.toLowerCase().includes("event") || 
            input.toLowerCase().includes("party") || 
            input.toLowerCase().includes("celebration")) {
          
          // Extract some basic information from the message
          const eventData = {
            name: "Event",
            age: "",
            guests: "20",
            budget: "500",
            interests: input,
            location: "venue",
            additionalDetails: input
          };
          
          const result = await generatePartyPlan(eventData);
          const selectedTheme = result.plans[0].theme;
          setTheme(selectedTheme);
          setInvitationText(result.invitationText);
          
          aiResponse = `I've created an event plan based on a ${selectedTheme} theme! Here are some ideas:
          
Activities:
${result.plans[0].activities.map((a: string) => `• ${a}`).join('\n')}

Food Ideas:
${result.plans[0].foodIdeas.map((f: string) => `• ${f}`).join('\n')}

Would you like to see the invitation I've designed for this event?`;
          
        } else {
          aiResponse = "I'm your event planning assistant. Please tell me what kind of event you'd like to plan, and include details like the occasion, number of guests, budget, and any special interests!";
        }

        const aiMessage: Message = {
          id: Date.now().toString(),
          content: aiResponse,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showInvitationPreview = () => {
    setShowInvitation(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Event Planning Assistant</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.sender === "ai" && message.content.includes("invitation") && (
                <Button 
                  variant="outline" 
                  className="mt-3 bg-gray-700 hover:bg-gray-600 text-white border-0"
                  onClick={showInvitationPreview}
                >
                  View Invitation
                </Button>
              )}
              {message.sender === "ai" && (
                <div className="flex mt-2 gap-2 justify-end">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-gray-700 hover:bg-gray-600">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-gray-700 hover:bg-gray-600">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white rounded-lg p-4 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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

      <div className="flex gap-2 bg-gray-800 p-2 rounded-lg">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
