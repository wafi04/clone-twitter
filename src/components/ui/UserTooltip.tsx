"use client";

import Link from "next/link";
import { PropsWithChildren } from "react";

import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { useUser } from "@/hooks/useUser";
import { UserData } from "@/lib/types";
import UserAvatar from "./UserAvatar";
import { FollowButton } from "./FollowButton";
import FollowerCount from "./FollowerCount";
import FollowingCount from "./FollowingCount";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: me, loading } = useUser();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col bg-background gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/${user?.name}`}>
                <UserAvatar size={70} avatarUrl={user.image} name={user.name} />
              </Link>
              {me?._id !== user._id && <FollowButton user={user._id} />}
            </div>
            <div>
              <Link href={`/${user.name}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.name}
                </div>
                <div className="text-muted-foreground">
                  @{user.displayName || user.name}
                </div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <div className="flex gap-2">
              <span className="hover:underline">
                <FollowerCount userId={user._id} name={user.name as string} />
              </span>
              <span className="hover:underline">
                <FollowingCount userId={user._id} name={user.name as string} />
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
