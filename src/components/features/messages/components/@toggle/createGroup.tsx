import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, TriangleAlert } from "lucide-react";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface CreateGroupProps {
  selectUsers: Id<"users">[];
  setSelectUsers: React.Dispatch<React.SetStateAction<Id<"users">[]>>;
  groupNameRef: React.RefObject<HTMLInputElement>;
  groupImageRef: React.RefObject<HTMLInputElement>;
}

const CreateGroup: React.FC<CreateGroupProps> = ({
  selectUsers,
  setSelectUsers,
  groupNameRef,
  groupImageRef,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleImageClick = () => {
    groupImageRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  return (
    <div className="px-3 space-y-4">
      {selectUsers.length > 1 && (
        <div className="bg-destructive/50  p-3 rounded-md flex items-center gap-x-2 text-sm">
          <TriangleAlert className="size-4" />
          Don&apos;t Forget to add name group and image
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500 mb-2 ">Group participants:</p>
        <div className="flex flex-wrap gap-2">
          {selectUsers?.map((user) => (
            <div
              key={user}
              className="border-2 border-card rounded-full px-3 py-1 flex items-center"
            >
              <span className="mr-1">{user}</span>
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={() =>
                  setSelectUsers(selectUsers.filter((u) => u !== user))
                }
              />
            </div>
          ))}
        </div>
      </div>
      {selectUsers.length > 1 && (
        <>
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              Group Name
            </label>
            <Input
              id="groupName"
              ref={groupNameRef}
              className="mt-1"
              placeholder="Enter group name"
            />
          </div>
          <div>
            <label
              htmlFor="groupImage"
              className="block text-sm font-medium text-gray-700"
            >
              Group Image
            </label>
            <input
              type="file"
              ref={groupImageRef}
              className="hidden"
              id="groupImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              onClick={handleImageClick}
              className="mt-1 flex w-full bg-transparent   text-foreground  border-2 border-gray-300  hover:bg-gray-100  hover:text-accent items-center justify-center space-x-2"
            >
              <ImageIcon className="h-5 w-5" />
              <span>{selectedFileName || "Upload Image"}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateGroup;
