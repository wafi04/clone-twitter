"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { api } from "../../../convex/_generated/api";
import UserTooltip from "./UserTooltip";
import { useUser } from "@/hooks/useUser";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  children,
  username,
}: UserLinkWithTooltipProps) {
  const user = useQuery(api.users.getUserByname, {
    name: username,
  });

  if (!user) {
    return (
      <Link href={`/${username}`} className=" hover:underline">
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={user}>
      <Link href={`/${username}`} className=" hover:underline">
        {children}
      </Link>
    </UserTooltip>
  );
}
