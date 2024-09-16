import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LikeStatus {
  getData: boolean;
  getLikeFromStatus: {
    _id: Id<"like">;
    _creationTime: number;
    statusId: Id<"status">;
    like: boolean;
    liker: Id<"users">;
  }[];
}

export function useLike({ statusId }: { statusId: Id<"status"> }) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  const likeStatus = useQuery(api.like.getLikeStatus, { status: statusId });

  useEffect(() => {
    if (likeStatus?.getData !== undefined) {
      setIsLiked(likeStatus.getData);
    }
  }, [likeStatus]);

  const mutationLike = useMutation(api.like.createLike);

  const handleClick = useCallback(async () => {
    try {
      await mutationLike({ statusId: statusId });
      setIsLiked((prev) => !prev); // Optimistically update UI
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error("Error toggling like:", error);
    }
  }, [mutationLike, statusId, toast]);

  const count = likeStatus?.getLikeFromStatus.length ?? 0;

  return {
    isLiked,
    count,
    handleClick,
    isLoading: likeStatus === undefined,
  };
}
