import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel, Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
});

export async function getUserByEmail(
  ctx: QueryCtx,
  email: string
): Promise<Id<"users"> | null> {
  const user = await ctx.db
    .query("users")
    .withIndex("by_email_name", (q) => q.eq("email", email))
    .first();

  return user ? user._id : null;
}

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword, Google],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        return args.existingUserId;
      }

      const existingUser = await getUserByEmail(
        ctx,
        args.profile.email as string
      );

      if (existingUser) return existingUser;

      return ctx.db.insert("users", {
        name: args.profile.name,
        email: args.profile.email,
        image: args.profile.image,
        displayName: args.profile.name,
      });
    },
  },
});
