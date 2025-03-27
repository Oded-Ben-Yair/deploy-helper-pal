
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Eye, Download } from "lucide-react";
import { Message } from "@/types/chat";

type MessageItemProps = {
  message: Message;
  partyPlan: any;
  showInvitationPreview: () => void;
  downloadPlan: () => void;
};

export function MessageItem({
  message,
  partyPlan,
  showInvitationPreview,
  downloadPlan,
}: MessageItemProps) {
  return (
    <div
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
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              className="bg-gray-700 hover:bg-gray-600 text-white border-0"
              onClick={showInvitationPreview}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Invitation
            </Button>
            {partyPlan && (
              <Button 
                variant="outline" 
                className="bg-blue-700 hover:bg-blue-600 text-white border-0"
                onClick={downloadPlan}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Plan
              </Button>
            )}
          </div>
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
  );
}
