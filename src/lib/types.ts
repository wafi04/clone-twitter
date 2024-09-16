import { User } from "@auth/core/types";
import { Id } from "../../convex/_generated/dataModel";

export type UserData = {
  _id: Id<"users">;
  _creationTime: number;
  name?: string | undefined;
  image?: string | undefined;
  email?: string | undefined;
  emailVerificationTime?: number | undefined;
  displayName?: string | undefined;
  bio?: string | undefined;
  backgorundImage?: string | undefined;
};
export interface CommentWithReplies {
  _id: Id<"status">;
  content: string;
  creater: Id<"users">;
  parentStatus?: Id<"status"> | undefined;
  depth: number;
  _creationTime: number;
  creator: UserData;
  replies: CommentWithReplies[];
}

export type LikeData = {
  creator: UserData;
  like: boolean;
  liker: Id<"users">;
  replies: {
    _id: Id<"status">;
    content: string;
    creater: Id<"users">;
    parentStatus?: Id<"status"> | undefined;
    depth: number;
    _creationTime: number;
    creator: UserData;
  };
};
export interface StatusWithUsersandReplies {
  _id: Id<"status">;
  content: string;
  creater: Id<"users">;
  parentStatus?: Id<"status">;
  depth: number;
  _creationTime: number;
  creator: UserData;
  replies?: StatusWithUsersandReplies | null; // Ubah tipe menjadi StatusWithUsersandReplies | null
}
interface Status {
  _id: Id<"status">;
  content: string;
  creater: Id<"users">;
  parentStatus?: Id<"status">;
  depth: number;
  _creationTime: number;
}
export interface StatusWithCreator extends Status {
  creator: UserData;
}

export interface StatusWithCreatorAndChildren extends StatusWithCreator {
  children?: StatusWithCreatorAndChildren[];
}

export type replies = {
  _id: Id<"status">;
  content: string;
  creater: Id<"users">;
  parentStatus?: Id<"status"> | undefined;
  depth: number;
  _creationTime: number;
  creator: UserData;
};

export type QuoteReplies = {
  statusId: Id<"status">;
  _creationTime: number;
  _id: Id<"quote">;
  content: string;
  quoter: Id<"users">;
  creator: UserData;
  replies: replies;
};
