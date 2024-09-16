"use client";
import Navbar from "@/components/ui/Navbar";
import { usePaginatedQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import { UserData } from "@/lib/types";
import UserAvatar from "@/components/ui/UserAvatar";
import { FollowButton } from "@/components/ui/FollowButton";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";

const Follows = () => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.users.getallUsers,
    {},
    {
      initialNumItems: 10,
    }
  );
  return (
    <>
      <Navbar title="Connect" />
      <InfiniteScrollContainer onBottomReached={() => loadMore(7)} number={7}>
        {results.map((item) => (
          <Users key={item._id} user={item} />
        ))}
      </InfiniteScrollContainer>
    </>
  );
};

export default Follows;

function Users({ user }: { user: UserData }) {
  return (
    <div className="flex items-center p-4 border-b justify-between hover:bg-neutral-900 transition-colors">
      <div className="flex space-x-4">
        <UserLinkWithTooltip username={user.name as string}>
          <div className="flex-shrink-0">
            <UserAvatar avatarUrl={user.image} size={36} />
          </div>
        </UserLinkWithTooltip>
        <UserLinkWithTooltip username={user.name as string}>
          <h2 className="text-sm font-semibold">
            {user.displayName ?? user.name}
          </h2>
          <p className="text-xs text-gray-500">@{user.name}</p>
          {user.bio && <p className="text-sm text-gray-700 mt-1">{user.bio}</p>}
        </UserLinkWithTooltip>
      </div>
      <FollowButton user={user._id} />
    </div>
  );
}
