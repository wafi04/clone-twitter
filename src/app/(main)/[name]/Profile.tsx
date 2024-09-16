"use client";
import Navbar from "@/components/ui/Navbar";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Calendar, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserAvatar from "@/components/ui/UserAvatar";
import { getTime } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import ToggleEditProfile from "@/components/features/profile/ToggleEditProfile";
import { FollowButton } from "@/components/ui/FollowButton";
import { Id } from "../../../../convex/_generated/dataModel";

const Profile = ({ name }: { name: string }) => {
  const router = useRouter();
  const { user: currentUser, loading, followers, following } = useUser();
  const userQuery = useQuery(api.users.getUserByname, { name });

  const user = userQuery || null;

  if (loading || user === undefined || user === null) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="animate-spin text-twitter" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto bg-background">
      {/* Header */}
      <div className="relative">
        {user.backgorundImage ? (
          <Image
            src={user.backgorundImage as string}
            alt="Background Image"
            width={500}
            height={500}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="h-48 bg-blue-500" />
        )}
      </div>
      <div className="px-4 py-3 relative">
        <div className="absolute -top-16 left-4">
          <UserAvatar avatarUrl={user.image} className="size-32" />
        </div>
        <div className="flex justify-end mb-4 gap-4">
          {currentUser?._id === user._id ? (
            <ToggleEditProfile user={user} />
          ) : (
            <FollowButton user={user._id} />
          )}
        </div>
        <div className="mt-8">
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-gray-500">@{user.displayName || user.name}</p>
        </div>

        {user.bio && <p className="mt-3">{user.bio}</p>}

        <div className="flex items-center mt-3 text-gray-500 text-sm">
          <Calendar size={16} className="mr-1" />
          <span>Joined {getTime(user._creationTime)}</span>
        </div>

        <div className="flex mt-3 text-sm">
          {following && following.length > 0 && (
            <Link href={`/${user.name}/following`} className="hover:underline">
              <span className="mr-4">
                <strong>{following.length}</strong> Following
              </span>
            </Link>
          )}
          {followers && followers.length > 0 && (
            <Link href={`/${user.name}/followers`} className="hover:underline">
              <span className="mr-4">
                <strong>{followers.length}</strong> Followers
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
