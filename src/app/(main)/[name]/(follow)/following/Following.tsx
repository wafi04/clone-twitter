"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import FollowsAndfollowing from "../components/FolowsAndfollowing";
import { Loader2 } from "lucide-react";
import { UserData } from "@/lib/types";

const Following = ({ name }: { name: string }) => {
  const following = useQuery(api.follow.getFollowing, {
    name,
  });

  if (following === undefined || !following) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }
  const validFollowing =
    following?.filter((follower): follower is UserData => follower !== null) ??
    [];
  return (
    <FollowsAndfollowing
      title="Following"
      name={name}
      follow={validFollowing}
    />
  );
};

export default Following;
