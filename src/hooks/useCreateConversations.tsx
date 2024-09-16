import { ChangeEvent, useCallback, useState, useRef } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";

type Message = "Chat" | "Group";
type HandleKick = {
  conversationId: Id<"conversations">;
  userId: Id<"users">;
};
export const useCreateConversations = () => {
  const [state, setState] = useState<Message>("Chat");
  const [searchUsers, setSearchUsers] = useState("");
  const [selectUsers, setSelectUsers] = useState<Id<"users">[]>([]);
  const kickMember = useMutation(api.conversations.deleteMember);
  const { toast } = useToast();
  const handlekick = useCallback(
    async (data: HandleKick) => {
      try {
        await kickMember(data);
      } catch (error) {
        toast({
          description: "Something Went Wrong",
        });
      }
    },
    [kickMember, toast]
  );

  const groupNameRef = useRef<HTMLInputElement>(null);
  const groupImageRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchUsers(e.target.value);
    },
    [setSearchUsers]
  );

  const onNext = useCallback(() => {
    setState("Group");
  }, [setState]);

  const onBack = useCallback(() => {
    setState("Chat");
  }, [setState]);

  const getGroupName = useCallback(() => {
    return groupNameRef.current?.value || "";
  }, []);

  const getGroupImage = useCallback(() => {
    return groupImageRef.current?.files?.[0] || null;
  }, []);

  const createGroup = useCallback(() => {
    const groupName = getGroupName();
    const groupImage = getGroupImage();
    const members = selectUsers;
    if (groupNameRef.current) groupNameRef.current.value = "";
    if (groupImageRef.current) groupImageRef.current.value = "";
    setSelectUsers([]);
    setState("Chat");
  }, [getGroupName, getGroupImage, selectUsers, setSelectUsers, setState]);

  return {
    deleteMembers: handlekick,
    setSelectUsers,
    searchUsers,
    handleSearch,
    selectUsers,
    onNext,
    onBack,
    state,
    groupNameRef,
    groupImageRef,
    getGroupName,
    getGroupImage,
    createGroup,
  };
};
