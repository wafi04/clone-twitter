/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as Bookmarks from "../Bookmarks.js";
import type * as conversations from "../conversations.js";
import type * as follow from "../follow.js";
import type * as http from "../http.js";
import type * as like from "../like.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as quote from "../quote.js";
import type * as retweet from "../retweet.js";
import type * as status from "../status.js";
import type * as types from "../types.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  Bookmarks: typeof Bookmarks;
  conversations: typeof conversations;
  follow: typeof follow;
  http: typeof http;
  like: typeof like;
  messages: typeof messages;
  notifications: typeof notifications;
  quote: typeof quote;
  retweet: typeof retweet;
  status: typeof status;
  types: typeof types;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
