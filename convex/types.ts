import { Id } from "./_generated/dataModel";

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
