import React, { useState } from "react";
import { QuoteReplies } from "@/lib/types";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";
import UserAvatar from "@/components/ui/UserAvatar";
import { getTime, getTimeFromNow } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { useQuote } from "@/hooks/useQuote";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";

const Quotes = ({ status }: { status: QuoteReplies }) => {
  const { user } = useUser();
  return (
    <div className="border-b p-4  max-w-full relative group">
      {/* Main Quote */}
      {user?._id === status.quoter && <DropdownQuote quoteId={status._id} />}
      <div className="flex items-start mb-2 space-x-3">
        <UserLinkWithTooltip username={status.creator.name as string}>
          <UserAvatar avatarUrl={status.creator.image} />
        </UserLinkWithTooltip>
        <div className="flex-1 min-w-0 ">
          <div className="flex items-center mb-1 text-sm space-x-1">
            <UserLinkWithTooltip username={status.creator.name as string}>
              <span className="font-bold truncate">
                {status.creator.displayName}
              </span>
              <span className="text-gray-500 truncate">
                @{status.creator.name}
              </span>
              <span className="ml-1">.</span>
            </UserLinkWithTooltip>
            <span
              className="text-sm text-gray-500 hover:text-white cursor-pointer hover:font-bold"
              title={getTime(status._creationTime)}
            >
              {getTimeFromNow(status._creationTime)}
            </span>
          </div>
          <p className="whitespace-pre-wrap break-words w-full cursor-pointer">
            {status.content}
          </p>
        </div>
      </div>

      {/* Quoted Reply */}
      {status.replies && (
        <div className="border rounded-xl p-3 mt-2 max-w-full">
          <div className="flex items-start space-x-3">
            <UserLinkWithTooltip
              username={status.replies.creator.name as string}
            >
              <UserAvatar avatarUrl={status.replies.creator.image} />
            </UserLinkWithTooltip>
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1 space-x-1 text-sm">
                <UserLinkWithTooltip username={status.creator.name as string}>
                  <span className="font-bold truncate">
                    {status.replies.creator.displayName}
                  </span>
                  <span className="text-gray-500   truncate">
                    @{status.replies.creator.name}
                  </span>
                  <span className="ml-1">.</span>
                </UserLinkWithTooltip>
                <span
                  className=" text-gray-500 hover:text-white cursor-pointer hover:font-bold"
                  title={getTime(status._creationTime)}
                >
                  {getTimeFromNow(status._creationTime)}
                </span>
              </div>
              <p className="whitespace-pre-wrap break-words w-full cursor-pointer">
                {status.replies.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;

function DropdownQuote({ quoteId }: { quoteId: Id<"quote"> }) {
  const [open, setIsopen] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-transparent invisible group-hover:bg-card group-hover:visible rounded-full w-8 h-8 p-1 absolute right-3 top-0">
            <Ellipsis className="w-5 h-5 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" mt-2 border-none">
          <DropdownMenuItem
            className="flex gap-4  border-2"
            onClick={() => setIsopen(true)}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <DialogQuote
          open={open}
          onClose={() => setIsopen(false)}
          quote={quoteId}
        />
      )}
    </>
  );
}

function DialogQuote({
  open,
  onClose,
  quote,
}: {
  open: boolean;
  onClose: () => void;
  quote: Id<"quote">;
}) {
  const { onDelete } = useQuote();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            post.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onDelete(quote)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
