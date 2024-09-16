import React from "react";
import { useQuery } from "convex/react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";
import { Loader2, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";
import UserAvatar from "@/components/ui/UserAvatar";

interface UsersProps {
  selectUsers: Id<"users">[];
  setSelectUsers: React.Dispatch<React.SetStateAction<Id<"users">[]>>;
}

const Users: React.FC<UsersProps> = ({ selectUsers, setSelectUsers }) => {
  const { user } = useUser();
  const getAllUsers = useQuery(api.follow.getFollowing, {
    name: user?.name as string,
  });

  if (getAllUsers === undefined) {
    return <Loader2 className="animate-spin text-blue-500" />;
  }
  if (getAllUsers?.length === 0 || getAllUsers === null || !getAllUsers) {
    return <p>Silakan untuk tambahkan users dahulu</p>;
  }

  const handleSelectUser = (userId: Id<"users">) => {
    setSelectUsers((prevUsers) => {
      if (prevUsers === null) {
        return [userId];
      }
      if (prevUsers.includes(userId)) {
        return prevUsers.filter((id) => id !== userId);
      }
      return [...prevUsers, userId];
    });
  };

  return (
    <div className="max-h-[50vh] overflow-y-auto">
      {getAllUsers.map((user) => {
        const isSelected = selectUsers?.includes(user?._id as Id<"users">);
        return (
          <div
            key={user?._id}
            className="flex items-center p-3 group hover:bg-card"
            onClick={() => handleSelectUser(user?._id as Id<"users">)}
          >
            <div className="flex-shrink-0 mr-3">
              <UserAvatar avatarUrl={user?.image} size={30} name={user?.name} />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between">
                <UserLinkWithTooltip username={user?.name as string}>
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-black dark:text-white truncate">
                      {user?.name}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                      @{user?.name}
                    </p>
                  </div>
                </UserLinkWithTooltip>
              </div>
            </div>
            {isSelected && (
              <X
                className="h-5 w-5 text-red-500 cursor-pointer"
                onClick={() => handleSelectUser(user?._id as Id<"users">)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Users;
