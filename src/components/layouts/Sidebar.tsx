"use client";
import {
  Bookmark,
  Hash,
  Home,
  Mail,
  User,
  Bell,
  LucideIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useUser } from "@/hooks/useUser";
import ButtonProfile from "../ui/ButtonProfiles";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DialogStatus from "./DialogStatus";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  count?: number;
}

const Sidebar = () => {
  const { user, loading } = useUser();
  const jumlahNotif = useQuery(api.notifications.checkNotificationsExist);
  const jumlahMessages = useQuery(
    api.conversations.getConversationsWithUnreadCount
  );

  return (
    <div className="sticky top-0 h-screen flex flex-col justify-between p-4  border-r  w-20 lg:w-64">
      <div className="flex flex-col items-center lg:items-start">
        <Link href="/home" className="mb-6 block">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-blue-400 fill-current"
          >
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </g>
          </svg>
        </Link>
        {/* Twitter Logo */}

        {/* Navigation Items */}
        <nav className="space-y-4 w-full">
          <SidebarItem href="/" icon={Home} label="Home" />
          {/* <SidebarItem href="/explore" icon={Hash} label="Explore" /> */}
          <SidebarItem
            href="/notifications"
            icon={Bell}
            count={jumlahNotif?.userNotifications}
            label="Notifications"
          />
          <SidebarItem
            href="/messages"
            icon={Mail}
            label="Messages"
            count={jumlahMessages?.unreadCount}
          />
          <SidebarItem href="/bookmarks" icon={Bookmark} label="Bookmarks" />
        </nav>

        {/* Tweet Button */}
        <DialogStatus />
      </div>

      <div className="flex flex-col items-center lg:flex-row lg:items-start lg:space-x-2 w-full p-2">
        <ButtonProfile />
        {user && (
          <div className="hidden lg:block text-sm cursor-pointer">
            <p>{user.name}</p>
            <p className="hover:underline">@{user.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SidebarItem = ({ href, icon: Icon, label, count }: SidebarItemProps) => (
  <Link href={href} className="block relative">
    {count && count > 0 && (
      <span className="absolute text-xs rounded-full size-4 flex items-center justify-center left-8 bg-twitter top-0">
        {count}
      </span>
    )}
    <Button
      className="w-full flex items-center justify-center lg:justify-start space-x-4 px-4 py-3 hover:bg-neutral-200  dark:hover:bg-neutral-800 rounded-full transition-colors duration-200"
      variant="ghost"
    >
      <Icon className="h-6 w-6" />
      <span className="hidden lg:inline">{label}</span>
    </Button>
  </Link>
);

export default Sidebar;
