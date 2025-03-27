
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type InvitationPreviewProps = {
  invitationText: string;
  theme: string;
};

export function InvitationPreview({ invitationText, theme }: InvitationPreviewProps) {
  // Get a background color based on the theme
  const getThemeColor = (theme: string): string => {
    const themeMap: Record<string, string> = {
      "superhero": "bg-gradient-to-r from-blue-500 to-purple-600",
      "princess": "bg-gradient-to-r from-pink-300 to-purple-400",
      "sports": "bg-gradient-to-r from-green-500 to-blue-500",
      "space": "bg-gradient-to-r from-indigo-800 to-purple-900",
      "dinosaur": "bg-gradient-to-r from-green-600 to-yellow-500",
      "gaming": "bg-gradient-to-r from-blue-600 to-purple-700",
      "art": "bg-gradient-to-r from-yellow-300 to-red-400",
      "music": "bg-gradient-to-r from-purple-500 to-indigo-600",
      "animals": "bg-gradient-to-r from-green-400 to-teal-500",
      "ocean": "bg-gradient-to-r from-blue-400 to-teal-500",
      "magic": "bg-gradient-to-r from-purple-400 to-pink-500",
      "science": "bg-gradient-to-r from-blue-400 to-green-500",
    };
    
    // Default background if theme doesn't match
    return themeMap[theme.toLowerCase()] || "bg-gradient-to-r from-purple-400 to-pink-500";
  };

  const getThemeEmoji = (theme: string): string => {
    const emojiMap: Record<string, string> = {
      "superhero": "🦸‍♂️",
      "princess": "👸",
      "sports": "🏆",
      "space": "🚀",
      "dinosaur": "🦖",
      "gaming": "🎮",
      "art": "🎨",
      "music": "🎵",
      "animals": "🐾",
      "ocean": "🌊",
      "magic": "✨",
      "science": "🔬",
    };
    
    return emojiMap[theme.toLowerCase()] || "🎉";
  };

  const downloadInvitation = () => {
    const element = document.createElement("a");
    const file = new Blob([invitationText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "birthday_invitation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationText);
    alert("Invitation text copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-purple-800">
        Invitation Preview {getThemeEmoji(theme)}
      </h2>
      
      <Card className="overflow-hidden border-2 border-purple-200 shadow-lg">
        <div className={`${getThemeColor(theme)} p-1`} />
        <CardContent className="p-6">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <AspectRatio ratio={16/9} className="bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">{getThemeEmoji(theme)}</div>
                <p className="text-sm">Invitation Image</p>
                <p className="text-xs">(Add your own image here)</p>
              </div>
            </AspectRatio>
          </div>
          
          <div className="whitespace-pre-wrap font-medium text-center">
            {invitationText}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={copyToClipboard}>
          Copy Text
        </Button>
        <Button variant="outline" className="flex-1" onClick={downloadInvitation}>
          Download Text
        </Button>
      </div>
    </div>
  );
}
