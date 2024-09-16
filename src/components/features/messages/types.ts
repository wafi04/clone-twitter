export type TypeMessages = "chat" | "group";

import { UserData } from "@/lib/types";
import { Id } from "../../../../convex/_generated/dataModel";

export type conversation = {
  _creationTime: number;
  _id: Id<"conversations">;
  isGroup: boolean;
  name?: string; // Optional because it's only present if `isGroup` is false
  admin?: string; // Optional because it's only present if `isGroup` is true
  groupImage?: string; // Optional because it's only present if `isGroup` is true
  groupName?: string; // Optional because it's only present if `isGroup` is true
  participants: UserData[];
  image?: string;
};

export type conversationType = {
  _creationTime: number;
  _id: Id<"conversations">;
  email?: string; // Optional because it's only present if `isGroup` is false
  isGroup: boolean;
  lastMessage?: MessagesConv | null;
  name?: string; // Optional because it's only present if `isGroup` is false
  admin?: string; // Optional because it's only present if `isGroup` is true
  groupImage?: string; // Optional because it's only present if `isGroup` is true
  groupName?: string; // Optional because it's only present if `isGroup` is true
  participants: string[];
  image?: string;
};

export type Messages = {
  conversationId: Id<"conversations">;
  body: string;
  imageId?: Id<"_storage">;
  image?: string | undefined;
  sender: UserData;
  parentmessageId?: Id<"messages">;
  updatedAt?: number;
  _id: Id<"messages">;
  _creationTime: number;
};
export type MessagesConv = {
  conversationId: Id<"conversations">;
  body: string;
  imageId?: Id<"_storage">;
  image?: string | undefined;
  sender: Id<"users">;
  parentmessageId?: Id<"messages">;
  updatedAt?: number;
  _id: Id<"messages">;
  _creationTime: number;
};
