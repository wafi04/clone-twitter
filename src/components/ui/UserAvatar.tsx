"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
  name?: string | undefined;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
  name,
}: UserAvatarProps) {
  const { push } = useRouter();
  return (
    <Image
      src={avatarUrl || "/avatar-placeholder.png"}
      alt="User avatar"
      onClick={() => push(`/users/${name}`)}
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className
      )}
    />
  );
}
