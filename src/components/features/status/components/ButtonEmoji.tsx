import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface ButtonEmojiProps {
  onEmojiSelect: (emoji: any) => void;
}

const ButtonEmoji: React.FC<ButtonEmojiProps> = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setShowPicker(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePicker}
            className="relative rounded-full hover:bg-transparent"
          >
            <Smile className="size-5 text-twitter" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Emoji picker</p>
        </TooltipContent>
      </Tooltip>
      {showPicker && (
        <div className="absolute bottom-10 left-14 z-10">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
    </TooltipProvider>
  );
};

export default ButtonEmoji;
