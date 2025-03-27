
import React, { useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { MessageItem } from "./MessageItem";

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
  partyPlan: any;
  showInvitationPreview: () => void;
  downloadPlan: () => void;
};

export function MessageList({
  messages,
  isLoading,
  partyPlan,
  showInvitationPreview,
  downloadPlan,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          partyPlan={partyPlan} 
          showInvitationPreview={showInvitationPreview}
          downloadPlan={downloadPlan}
        />
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
  );
}
