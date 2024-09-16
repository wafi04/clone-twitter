"use client";
import { usePaginatedQuery, useQuery } from "convex/react";
import React, { Fragment } from "react";
import { api } from "../../../convex/_generated/api";
import { UserData } from "@/lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import SearchField from "../ui/SearchFieldDropdown";
import UserAvatar from "../ui/UserAvatar";
import UserLinkWithTooltip from "../ui/userlInkWithTooltip";
import { FollowButton } from "../ui/FollowButton";

const TrendsSidebar = () => {
  const users = useQuery(api.follow.getUsersToFollows);

  return (
    <div className="sticky top-0 hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <div className="space-y-4 p-3">
        <SearchField />
        {users && users.length > 0 && (
          <div className=" p-4 rounded-xl border-2">
            <h2 className="text-xl font-bold mb-4">As a Freinds?</h2>
            {users.map((user) => (
              <Fragment key={user._id}>
                <Users user={user} />
              </Fragment>
            ))}
            <Link href={"/connect"} className="text-twitter hover:underline">
              See More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsSidebar;

function Users({ user }: { user: UserData }) {
  return (
    <div className="flex items-center p-3 group  ">
      <div className="flex-shrink-0 mr-3">
        <UserAvatar avatarUrl={user.image} size={30} name={user.name} />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <UserLinkWithTooltip username={user.name as string}>
            <div className="truncate">
              <h4 className="font-bold text-sm text-black dark:text-white truncate">
                {user.name}
              </h4>
              <p className="text-sm text-gray-500 truncate">@{user.name}</p>
            </div>
          </UserLinkWithTooltip>
          <div className="flex-shrink-0 ml-3">
            <FollowButton user={user._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
