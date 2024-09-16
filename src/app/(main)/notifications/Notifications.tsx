"use client";

import { useMutation, usePaginatedQuery } from "convex/react";
import React, { useCallback, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import { Id } from "../../../../convex/_generated/dataModel";
import { Heart, Repeat, MessageCircle, UserPlus } from "lucide-react";
import { getTime } from "@/lib/utils";
import Navbar from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type NotificationType = "follow" | "like" | "quote" | "retweet" | "reply";

interface Notification {
  _id: Id<"notifications">;
  _creationTime: number;
  content?: string;
  statusId?: Id<"status">;
  type: NotificationType;
  recipientId: Id<"users">;
  recepientName?: string;
  actorId: Id<"users">;
  isRead: boolean;
}

const notificationIcons: Record<NotificationType, JSX.Element> = {
  like: <Heart className="text-red-500" />,
  retweet: <Repeat className="text-green-500" />,
  reply: <MessageCircle className="text-blue-500" />,
  quote: <MessageCircle className="text-blue-500" />,
  follow: <UserPlus className="text-purple-500" />,
};

const Notifications: React.FC = () => {
  const { results, loadMore } = usePaginatedQuery(
    api.notifications.getMyNotifications,
    {},
    { initialNumItems: 5 }
  );
  const update = useMutation(api.notifications.updateNotifications);
  const { toast } = useToast();

  useEffect(() => {
    const markNotificationsAsRead = async () => {
      try {
        const unreadNotifications = results.filter((notif) => !notif.isRead);
        await Promise.all(
          unreadNotifications.map((notif) => update({ notifId: notif._id }))
        );
      } catch (error) {
        toast({ description: "Failed to update notification status" });
      }
    };

    markNotificationsAsRead();
  }, [results, update, toast]);

  return (
    <InfiniteScrollContainer onBottomReached={() => loadMore(5)} number={5}>
      <Navbar title="Notifications" className="py-3" />
      {results.map((notif) => (
        <Notif key={notif._id} notif={notif} />
      ))}
    </InfiniteScrollContainer>
  );
};

interface NotifProps {
  notif: Notification;
}

const Notif: React.FC<NotifProps> = ({ notif }) => {
  const { push } = useRouter();
  const handleNavigate = useCallback(() => {
    const link = notif.statusId
      ? `${notif.recepientName as string}/status/${notif.statusId}`
      : notif.recepientName;
    push(`/${link}`);
  }, [notif, push]);

  return (
    <div
      className="flex items-start p-4 border-b hover:bg-card cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="mr-3">{notificationIcons[notif.type]}</div>
      <div className="flex-1">
        {notif.content && <p className="text-sm">{notif.content}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {getTime(notif._creationTime)}
        </p>
      </div>
    </div>
  );
};

export default Notifications;
