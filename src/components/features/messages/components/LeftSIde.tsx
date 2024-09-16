"use client";
import React from "react";
import NewMessages from "./@toggle/NewMessages";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Conversations from "./conversations";
import SearchField from "@/components/ui/SearchFieldDropdown";

const LeftSIde = () => {
  const myconversations = useQuery(api.conversations.getMyConversations);
  return (
    <div className="w-96 h-screen  flex flex-col border-r-2 ">
      <div className="flex items-center justify-between  p-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <NewMessages />
      </div>
      <div className="p-2 w-full">
        <SearchField />
      </div>
      <div className="flex-1 overflow-y-auto">
        {myconversations?.map((conv) => {
          return <Conversations conv={conv} key={conv._id} />;
        })}
      </div>
    </div>
  );
};

export default LeftSIde;
