
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type ChatInputProps = {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
};

export function ChatInput({ isLoading, onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
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
  );
}
