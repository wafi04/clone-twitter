import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "./useUser";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { Messages } from "@/components/features/messages/types";

export function useMessages() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const deleteMessages = useMutation(api.messages.deleteMessages);
  const generateUploadUrl = useMutation(api.status.generateUploadUrl);
  const editMessages = useMutation(api.messages.editMessages);

  const handleDeleteMessages = useCallback(
    async (message: Id<"messages">) => {
      try {
        await deleteMessages({
          messageId: message,
        });
      } catch (error) {
        toast({
          description: "Something Went Wrong",
        });
      }
    },
    [deleteMessages, toast]
  );
  const conversationId = searchParams.get(
    "conversation"
  ) as Id<"conversations"> | null;

  const conversation = useQuery(
    api.conversations.getConversationById,
    conversationId ? { conversationId } : "skip"
  );

  const {
    isLoading: isPaginatedLoading,
    loadMore,
    results,
  } = usePaginatedQuery(
    api.messages.getAllMessages,
    conversationId ? { conversationId } : "skip",
    {
      initialNumItems: 10,
    }
  );

  const sendMessage = useMutation(api.messages.sendTextMessage);

  const loadMessagesForConversation = useCallback(
    (conversationId: string) => {
      router.push(`?conversation=${conversationId}`);
    },
    [router]
  );

  const handleSendMessage = useCallback(
    async (
      content: string,
      selectedImage: File | undefined,
      edit?: Id<"messages">,
      reply?: Id<"messages">
    ) => {
      if (!conversationId) return;

      let storageId = undefined;
      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const { storageId: uploadedStorageId } = await result.json();
        storageId = uploadedStorageId;
      }
      if (edit) {
        try {
          await editMessages({
            messages: {
              messageId: edit,
              body: content,
              image: storageId,
            },
          });
        } catch (err) {
          setError("Failed to send message");
          console.error(err);
        }
      } else {
        setError(null);
        try {
          await sendMessage({
            content,
            conversation: conversationId,
            image: storageId,
            parentMessageId: reply,
          });
        } catch (err) {
          setError("Failed to send message");
          console.error(err);
        }
      }
    },
    [sendMessage, conversationId, user, editMessages, generateUploadUrl]
  );
  useEffect(() => {
    setIsLoading(
      isPaginatedLoading || results === undefined || conversation === undefined
    );
  }, [isPaginatedLoading, results, conversation]);

  const messages = useMemo(() => results || [], [results]);
  const participants = useMemo(() => {
    if (conversation) {
      return conversation.isGroup
        ? conversation.participants
        : conversation.participants;
    }
    return [];
  }, [conversation]);
  return {
    messages,
    deleteMessages: handleDeleteMessages,
    participants,
    conversationId,
    conversation,
    isGroup: conversation?.isGroup ?? false,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    loadMessagesForConversation,
    loadMore,
  };
}

type MessagesProps = {
  edit: Messages | null;
  setEdit: (edit: Messages) => void;
  cancelEdit: () => void;
  reply: Messages | null;
  setReply: (edit: Messages) => void;
  cancelReply: () => void;
};

export const useEditMessages = create<MessagesProps>((set) => ({
  edit: null,
  setEdit: (edit: Messages) => set({ edit }),
  cancelEdit: () => set({ edit: null }),
  reply: null,
  setReply: (reply: Messages) => set({ reply }),
  cancelReply: () => set({ reply: null }),
}));
