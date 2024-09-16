import React from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

const FollowerCount = ({
  userId,
  name,
}: {
  userId: Id<"users">;
  name: string;
}) => {
  const { followers } = useUser();

  return (
    followers &&
    followers.length > 0 && (
      <Link href={`/${name}/followers`} className="inline-block ">
        <strong>{formatNumber(followers.length)}</strong> Followers
      </Link>
    )
  );
};

export default FollowerCount;
