
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, ThumbsUp, ThumbsDown, Download } from "lucide-react";
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
      content: `Hello! I'm your AI event planner assistant. I'll help you create an amazing event!
      
To get started, please tell me:
• What type of event are you planning? (birthday, wedding, corporate, etc.)
• Who is it for? (name, age if relevant)
• When will it take place? (date and time)
• How many guests do you expect?
• Do you have a specific theme or style in mind?

The more details you share, the better I can help you plan!`,
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
        let followUpQuestion = "";
        const userInput = input.toLowerCase();
        
        // Check if this looks like an event planning request
        if (userInput.includes("plan") || 
            userInput.includes("event") || 
            userInput.includes("party") || 
            userInput.includes("celebration")) {
          
          // Extract information based on message content
          let eventType = "";
          let guestCount = "20";
          let eventDate = "";
          let budget = "500";
          let location = "venue";
          let hasTheme = false;
          
          if (userInput.includes("birthday")) eventType = "birthday";
          else if (userInput.includes("wedding")) eventType = "wedding";
          else if (userInput.includes("corporate")) eventType = "corporate";
          else if (userInput.includes("baby shower")) eventType = "baby shower";
          
          // Extract guest count if mentioned
          const guestMatch = userInput.match(/(\d+)\s*(guests|people)/);
          if (guestMatch) guestCount = guestMatch[1];
          
          // Extract budget if mentioned
          const budgetMatch = userInput.match(/(\d+)\s*(dollars|euros|budget)/);
          if (budgetMatch) budget = budgetMatch[1];
          
          // Check if theme is mentioned
          if (userInput.includes("theme") || userInput.includes("style")) {
            hasTheme = true;
          }
          
          // Create event data object for AI planning
          const eventData = {
            name: eventType || "Event",
            hostName: "",
            guests: guestCount,
            budget: budget,
            interests: input,
            location: location,
            guestType: userInput.includes("kid") ? "children" : "adults",
            date: new Date(),
            additionalDetails: input,
            city: "",
            country: "",
            currency: "USD",
            dietaryRestrictions: "",
            eventType: eventType || "Event",
            foodPreferences: "",
            drinkPreferences: "",
            preferences: ""
          };
          
          const result = await generatePartyPlan(eventData);
          const selectedTheme = result.plans[0].theme;
          setTheme(selectedTheme);
          setInvitationText(result.invitationText);
          
          // Generate personalized response based on extracted information
          aiResponse = `I've created an event plan based on a ${selectedTheme} theme! Here are some ideas:
          
Activities:
${result.plans[0].activities.map((a: string) => `• ${a}`).join('\n')}

Food Ideas:
${result.plans[0].foodIdeas.map((f: string) => `• ${f}`).join('\n')}

Drink Suggestions:
${result.plans[0].drinkIdeas ? result.plans[0].drinkIdeas.map((d: string) => `• ${d}`).join('\n') : "• Based on your preferences"}

Decoration Ideas:
${result.plans[0].decorationIdeas ? result.plans[0].decorationIdeas.map((d: string) => `• ${d}`).join('\n') : "• Themed decorations that match your event style"}

I've also designed a custom invitation for this event!`;

          // Generate appropriate follow-up question
          if (!eventType) {
            followUpQuestion = "\n\nCould you tell me what type of event this is (birthday, wedding, corporate, etc.)?";
          } else if (!hasTheme) {
            followUpQuestion = "\n\nDo you have any specific theme or style preferences for this event?";
          } else {
            followUpQuestion = "\n\nWould you like to see the invitation I've designed, or would you like me to suggest any specific aspects of the event planning (venue, entertainment, etc.)?";
          }
          
          aiResponse += followUpQuestion;
          
        } else {
          // More detailed guidance if not an event planning request
          aiResponse = `I'm your event planning assistant. To help you plan the perfect event, I need some key details:

• Event type (birthday, wedding, anniversary, corporate, etc.)
• Host information (who's organizing or who it's for)
• Date, time, and duration of the event
• Approximate number of guests and guest demographics
• Budget range and preferred currency
• Location (city, country, venue preferences)
• Theme ideas or special interests
• Food and drink preferences
• Any dietary restrictions
• Dress code expectations
• Special requirements (accessibility, entertainment, etc.)

The more details you provide, the better I can tailor my suggestions!`;
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
                  {message.content.includes("plan") && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-gray-700 hover:bg-gray-600" title="Download as PDF">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
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
