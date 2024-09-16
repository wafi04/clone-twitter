"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateConversations } from "@/hooks/useCreateConversations";
import { MailPlus, Search, UserCircleIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import HeaderDialog from "./HeaderDialog";
import { api } from "../../../../../../convex/_generated/api";
import Users from "./listUsers";
import CreateGroup from "./createGroup";

const NewMessages = () => {
  const {
    onBack,
    onNext,
    searchUsers,
    selectUsers,
    handleSearch,
    setSelectUsers,
    state,
    groupNameRef,
    groupImageRef,
    createGroup,
  } = useCreateConversations();
  const { user: me } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const generateUploadUrl = useMutation(api.status.generateUploadUrl);
  const mutation = useMutation(api.conversations.createConversation);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreateConversation = async () => {
    if (!selectUsers || selectUsers.length === 0) return;
    setIsLoading(true);
    try {
      const isGroup = selectUsers.length > 1;

      let conversationId;
      if (!isGroup) {
        conversationId = await mutation({
          participants: [...selectUsers, me?._id!],
          isGroup: false,
        });
      } else {
        const groupName = groupNameRef.current?.value;
        const groupImage = groupImageRef.current?.files?.[0];

        if (!groupName) {
          throw new Error("Group name is required");
        }

        let storageId = null;
        if (groupImage) {
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": groupImage.type },
            body: groupImage,
          });
          const { storageId: uploadedStorageId } = await result.json();
          storageId = uploadedStorageId;
        }

        conversationId = await mutation({
          participants: [...selectUsers, me?._id!],
          isGroup: true,
          groupName,
          groupImage: storageId,
        });
      }

      dialogCloseRef.current?.click();
      setSelectUsers([]);
      if (groupNameRef.current) groupNameRef.current.value = "";
      if (groupImageRef.current) groupImageRef.current.value = "";

      const conversationName = isGroup
        ? groupNameRef.current?.value
        : "New Conversation";
      router.push(`?q=${conversationId}`);

      toast({
        description: `Conversation "${conversationName}" created successfully!`,
      });
    } catch (err) {
      toast({
        description: "Something Went Wrong: " + (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (state === "Chat") {
      return (
        <>
          <div className="flex items-center my-2 group px-3">
            <Search className="text-gray-500 group-hover:text-accent group-focus:text-accent" />
            <Input
              className="border-none outline-none"
              placeholder="Search People...."
              value={searchUsers}
              onChange={handleSearch}
            />
          </div>
          <div
            className="flex p-4 gap-4 border-y text-accent cursor-pointer"
            onClick={onNext}
          >
            <UserCircleIcon className="size-7 inline-flex" />
            <p className="font-semibold ">Create Group</p>
          </div>
          <Users selectUsers={selectUsers} setSelectUsers={setSelectUsers} />
        </>
      );
    }

    if (state === "Group") {
      return (
        <CreateGroup
          selectUsers={selectUsers}
          setSelectUsers={setSelectUsers}
          groupNameRef={groupNameRef}
          groupImageRef={groupImageRef}
        />
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="hover:bg-transparent bg-transparent text-white"
        >
          <MailPlus className=" size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-full h-[80vh] p-0">
        <div className="space-y-2">
          <div className="flex justify-between items-center w-full px-5 py-3">
            <HeaderDialog
              state={state}
              onBack={onBack}
              onNext={onNext}
              createGroup={handleCreateConversation}
            />
          </div>
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessages;
