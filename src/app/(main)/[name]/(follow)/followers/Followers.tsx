"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import FollowsAndfollowing from "../components/FolowsAndfollowing";
import { Loader2 } from "lucide-react";
import { UserData } from "@/lib/types";

const Followers = ({ name }: { name: string }) => {
  const followers = useQuery(api.follow.getFollowers, {
    name,
  });

  if (followers === undefined || !followers) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }
  const validFollowers =
    followers?.filter((follower): follower is UserData => follower !== null) ??
    [];

  return (
    <FollowsAndfollowing
      title="Followers"
      name={name}
      follow={validFollowers}
    />
  );
};

export default Followers;
