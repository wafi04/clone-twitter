import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUser() {
  const currentUser = useQuery(api.users.currentUser);
  const loading = currentUser === undefined;

  return {
    user: currentUser?.currentUser,
    following: currentUser?.following,
    followers: currentUser?.followers,
    loading,
  };
}
