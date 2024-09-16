import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { CommentWithReplies } from "@/lib/types";
import { useUser } from "./useUser";

export const useStatus = () => {
  const mutationStatus = useMutation(api.status.addComment);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.status.generateUploadUrl);
  const [replies, setReplies] = useState<CommentWithReplies | null>(null);
  const { user } = useUser();

  const onSubmit = useCallback(
    async (
      content: string,
      selectedImage: File | null,
      statusId?: Id<"status">
    ) => {
      let storageId;

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

      try {
        await mutationStatus({
          content,
          parentStatus: statusId,
          image: storageId,
        });
        toast({
          description: "Status posted successfully!",
        });
      } catch (error) {
        console.error("Error posting status:", error);
        toast({
          description: "Something went wrong while posting the status.",
          variant: "destructive",
        });
      }
    },
    [generateUploadUrl, mutationStatus, toast]
  );

  return {
    onSubmit,
    toast,
  };
};
