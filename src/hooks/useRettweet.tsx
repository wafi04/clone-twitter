import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LikeStatus {
  getData: boolean;
  getRetweetStatus: {
    _id: Id<"like">;
    _creationTime: number;
    statusId: Id<"status">;
    like: boolean;
    liker: Id<"users">;
  }[];
}

export function useRetweet({ statusId }: { statusId: Id<"status"> }) {
  const { toast } = useToast();
  const [isRetweet, setIsRetweet] = useState(false);

  const rettweetStatus = useQuery(api.retweet.getRetweetStatus, {
    status: statusId,
  });

  useEffect(() => {
    if (rettweetStatus?.getData !== undefined) {
      setIsRetweet(rettweetStatus.getData);
    }
  }, [rettweetStatus]);

  const mutationRetweet = useMutation(api.retweet.createRetweet);

  const handleClick = useCallback(async () => {
    try {
      await mutationRetweet({ status: statusId });
      setIsRetweet((prev) => !prev);
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error("Error toggling like:", error);
    }
  }, [mutationRetweet, statusId, toast]);

  const count = rettweetStatus?.getRetweetFromStatus.length ?? 0;

  return {
    isRetweet,
    count,
    handleClick,
    isLoading: rettweetStatus === undefined,
  };
}
