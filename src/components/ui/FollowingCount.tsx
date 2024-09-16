import React from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

const FollowingCount = ({
  userId,
  name,
}: {
  userId: Id<"users">;
  name: string;
}) => {
  const { following } = useUser();
  return (
    following &&
    following.length > 0 && (
      <Link className="inline-block" href={`/${name}/following`}>
        <strong>{formatNumber(following.length)}</strong> Following
      </Link>
    )
  );
};

export default FollowingCount;
