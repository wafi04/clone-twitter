import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Smile, Send, Image as ImageIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EnhancedChatInputProps {
  onSendMessage: (message: string, image?: File) => void;
  initialMessage: string;
  onMessageChange: (message: string) => void;
  croppedImage?: File;
  setCroppedImage: (image?: File) => void;
  className?: string;
}

interface EmojiData {
  native: string;
}

const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  initialMessage,
  onMessageChange,
  croppedImage,
  setCroppedImage,
  className,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onMessageChange(initialMessage);
  }, [initialMessage, onMessageChange]);

  const handleSendMessage = () => {
    if (initialMessage.trim() || croppedImage) {
      onSendMessage(initialMessage, croppedImage);
      onMessageChange("");
      setCroppedImage(undefined);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: EmojiData) => {
    onMessageChange(initialMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCroppedImage(file);
    }
  };

  return (
    <div className={`${className} flex w-full gap-3 items-center`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="relative rounded-full hover:bg-transparent"
            >
              <Smile className="size-5 text-twitter" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Emoji picker</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              className="relative rounded-full hover:bg-transparent"
            >
              <ImageIcon className="size-5 text-twitter" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload image</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
      <Input
        value={initialMessage}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onMessageChange(e.target.value)
        }
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-grow border-none"
      />
      <Button onClick={handleSendMessage} size="icon" className="text-white">
        <Send className="h-5 w-5" />
      </Button>
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 z-10">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
    </div>
  );
};

export default EnhancedChatInput;
