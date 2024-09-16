"use client";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfileUser({ size }: { size?: string }) {
  const { loading, user } = useUser();

  if (loading) {
    return <Loader2 className="animate-spin text-gray-500" />;
  }

  if (!user) {
    return null;
  }

  const { name, image } = user;
  const userInitial = name!.charAt(0).toUpperCase();
  return (
    <Link href={`/${name}`}>
      <Avatar
        className={` transition-opacity hover:opacity-75  ${size ? size : "size-10"}`}
      >
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{userInitial}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
