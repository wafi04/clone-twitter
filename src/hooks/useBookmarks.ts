import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BokmarksStatus {
  getData: boolean;
  getLikeFromStatus: {
    _id: Id<"bookmarks">;
    _creationTime: number;
    statusId: Id<"status">;
    save: boolean;
    liker: Id<"users">;
  }[];
}

export function useBookmarks({ statusId }: { statusId: Id<"status"> }) {
  const { toast } = useToast();
  const [isSave, setIsSave] = useState(false);

  const bookmarkStatus = useQuery(api.Bookmarks.getBookmarksStatus, {
    status: statusId,
  });

  useEffect(() => {
    if (bookmarkStatus?.getData !== undefined) {
      setIsSave(bookmarkStatus.getData);
    }
  }, [bookmarkStatus]);

  const mutationLike = useMutation(api.Bookmarks.creteBoookmarks);

  const handleClick = useCallback(async () => {
    try {
      await mutationLike({ status: statusId });
      setIsSave((prev) => !prev); // Optimistically update UI
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error("Error toggling boo.Bookmarks:", error);
    }
  }, [mutationLike, statusId, toast]);

  const count = bookmarkStatus?.getBookmarksStatus.length ?? 0;

  return {
    isSave,
    count,
    handleClick,
    isLoading: bookmarkStatus === undefined,
  };
}
