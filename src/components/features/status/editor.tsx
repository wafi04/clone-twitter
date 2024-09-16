"use client";

import React, { useState, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import Link from "@tiptap/extension-link";
import ProfileUser from "@/components/ui/Profile.User";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "./components/ButtonProgress";
import HandleImageUploads from "./components/ButtonImage";
import { useToast } from "@/components/ui/use-toast";
import ButtonEmoji from "./components/ButtonEmoji";
import Image from "next/image";
import { X } from "lucide-react";

interface StatusEditorProps {
  placeholder?: string;
  onSubmit: (content: string, image: File | null) => Promise<void>;
  maxLength?: number;
  showProfile?: string;
  className?: string;
  size?: string;
  mentionSuggestions?: (
    query: string
  ) => Promise<Array<{ id: string; name: string }>>;
  customButtons?: React.ReactNode;
}

const StatusEditor: React.FC<StatusEditorProps> = ({
  placeholder,
  onSubmit,
  maxLength = 300,
  showProfile = true,
  mentionSuggestions,
  size,
  className,
  customButtons,
}) => {
  const [currentLength, setCurrentLength] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || "What's happening?",
      }),
      Link.configure({
        openOnClick: false,
      }),
      Mention.configure({
        suggestion: {
          items: async ({ query }: { query: string }) => {
            if (mentionSuggestions) {
              return await mentionSuggestions(query);
            }
            return [];
          },
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      const newLength = editor.getText().length;
      if (newLength <= maxLength) {
        setCurrentLength(newLength);
      } else {
        editor.commands.setContent(editor.getText().slice(0, maxLength));
        setCurrentLength(maxLength);
      }
    },
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await onSubmit(input, selectedImage);
      editor?.commands.clearContent();
      setSelectedImage(null);
      setPreviewSrc(null);
      setCurrentLength(0);
    } catch (error) {
      toast({
        description: "Something Went Wrong",
      });
    } finally {
      setLoading(false);
    }
  }, [editor, selectedImage, onSubmit, input, toast]);

  return (
    <div className={cn(`flex flex-col gap-2 border-b-2 p-5`, className)}>
      <div className={cn("flex items-start gap-x-3", showProfile)}>
        <ProfileUser size={size} />
        <div className="w-full flex flex-col max-w-[80%] lg:max-w-[90%]">
          <EditorContent
            editor={editor}
            className={cn(
              "min-h-[50px] max-h-[20rem] min-w-0 overflow-y-auto border-b-2 "
            )}
          />
          {previewSrc && (
            <div className="mt-2 relative w-full h-40">
              <Image
                src={previewSrc}
                alt="Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75"
                onClick={() => {
                  setPreviewSrc(null);
                  setSelectedImage(null);
                }}
              >
                <X size={20} className="text-white" />
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <HandleImageUploads
                disabled={loading}
                setSelectedImage={setSelectedImage}
                setPreviewSrc={setPreviewSrc}
              />
              <ButtonEmoji
                onEmojiSelect={(emojiObject) => {
                  editor
                    ?.chain()
                    .focus()
                    .insertContent(emojiObject.native)
                    .run();
                }}
              />
              {customButtons}
            </div>
            <div className="flex items-center gap-2">
              <Progress currentLength={currentLength} maxLength={maxLength} />
              <Button
                onClick={handleSubmit}
                disabled={
                  (!input.trim() && !selectedImage) ||
                  currentLength > maxLength ||
                  loading
                }
                className="min-w-20 rounded-full"
                variant={"twitter"}
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusEditor;
