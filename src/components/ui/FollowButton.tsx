import React, { useCallback, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "./button";
import { api } from "../../../convex/_generated/api";
import { useToast } from "./use-toast";
import { useUser } from "@/hooks/useUser";

interface ButtonFollowProps {
  user: Id<"users">;
}

export function FollowButton({ user }: ButtonFollowProps) {
  const { user: currentUser } = useUser();
  const toggleFollow = useMutation(api.follow.toggleFollow);
  const followStatus = useQuery(api.follow.checkFollowStatus, {
    followerId: user,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (followStatus !== undefined) {
      setIsFollowing(followStatus.isFollowing);
    }
  }, [followStatus]);

  const handleClick = useCallback(async () => {
    try {
      const result = await toggleFollow({ followerId: user });
      setIsFollowing(result.isFollowing);
      toast({
        description: `Successfully ${result.action} user`,
      });
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }, [user, toggleFollow, toast]);

  if (followStatus === undefined) {
    return;
  }
  if (currentUser?._id === user) {
    return null;
  }
  return (
    <Button
      className="size-fit rounded-full px-4 py-2 bg-twitter text-white hover:bg-twitter/70"
      onClick={handleClick}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
