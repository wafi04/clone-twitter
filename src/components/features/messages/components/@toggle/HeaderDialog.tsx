// HeaderDialog.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeaderDialogProps {
  state: string;
  onBack: () => void;
  onNext: () => void;
  createGroup: () => void;
}

const HeaderDialog: React.FC<HeaderDialogProps> = ({
  state,
  onBack,
  onNext,
  createGroup,
}) => {
  if (state === "Chat") {
    return (
      <>
        <h4 className="text-lg font-semibold">New Message</h4>
        <Button
          size="sm"
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
          onClick={onNext}
        >
          Next
        </Button>
      </>
    );
  }

  if (state === "Group") {
    return (
      <>
        <div className="flex space-x-3 items-center">
          <ArrowLeft className="cursor-pointer" onClick={onBack} />
          <h4 className="text-lg font-semibold">New Group</h4>
        </div>
        <Button
          size="sm"
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
          onClick={createGroup}
        >
          Create
        </Button>
      </>
    );
  }

  return null;
};

export default HeaderDialog;
