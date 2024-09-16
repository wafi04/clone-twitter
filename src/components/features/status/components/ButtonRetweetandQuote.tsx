import { useRetweet } from "@/hooks/useRettweet";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PenLine, Repeat2, X } from "lucide-react";
import { CommentWithReplies, StatusWithCreator } from "@/lib/types";
import { useQuote } from "@/hooks/useQuote";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserAvatar from "@/components/ui/UserAvatar";
import StatusEditor from "../editor";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { bookmarks } from "@/app/(main)/bookmarks/Bookmarks";
export function DropdownRetweet({
  status,
}: {
  status: CommentWithReplies | StatusWithCreator;
}) {
  const { count, handleClick, isLoading, isRetweet } = useRetweet({
    statusId: status._id,
  });

  const { handleCLose, handleOpen, dialogOpen } = useQuote();
  const QuoteLength = useQuery(api.quote.getQuoteByPost, {
    status: status._id,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <button className="group flex items-center focus:outline-none transition-colors duration-300 ease-in-out text-gray-500 hover:text-green-500">
            <div className="relative">
              <Repeat2
                className={`h-5 w-5 mr-2 transition-all duration-300 ease-in-out
            ${isRetweet ? "fill-green-500 text-green-500" : "text-gray-500"}
            group-hover:text-green-500 group-hover:scale-110
            ${isLoading ? "opacity-50" : ""}
          `}
              />
            </div>
            {(() => {
              const totalCount = count + (QuoteLength?.length || 0);
              return totalCount > 0 ? (
                <span
                  className={`
        text-xs transition-all duration-300 ease-in-out
        ${isRetweet ? "text-green-500" : "text-gray-500"}
        group-hover:text-green-500
      `}
                >
                  {totalCount}
                </span>
              ) : null;
            })()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" mt-2 border-none">
          <DropdownMenuItem
            onClick={handleClick}
            className="flex gap-4  border-2"
          >
            <Repeat2 size={16} />
            {isRetweet ? "Undo Repost " : "Repost"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpen}
            className="flex gap-4 border-2"
          >
            <PenLine size={14} />
            Quote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogOpen && (
        <DialogQuote onClose={handleCLose} open={dialogOpen} status={status} />
      )}
    </>
  );
}

function DialogQuote({
  open,
  onClose,
  status,
}: {
  open: boolean;
  onClose: () => void;
  status: CommentWithReplies | StatusWithCreator;
}) {
  const { onSubmit } = useQuote();
  const handleSubmit = async (content: string) => {
    try {
      await onSubmit(content, status._id);
      onClose();
    } catch (error) {
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]  p-0 h-fit  ">
        <div className="flex justify-between items-center w-full px-5 py-3 bg-neutral-900">
          <h2>Quote</h2>
          <DialogClose>
            <X />
          </DialogClose>
        </div>
        <div className=" flex flex-col h-full px-5 pb-3 space-y-4 sm:w-[470px]">
          <div className="flex items-start space-x-4 flex-grow">
            <div className="flex flex-col items-center h-full">
              <UserAvatar avatarUrl={status.creator.image} size={30} />
              <div className="w-0.5 bg-neutral-600 flex-grow mt-2 h-fit"></div>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{status.creator.name}</p>
              <p className="text-gray-500">@{status.creator.name}</p>
              <p className="mt-2">
                {status &&
                  (status.content.length > 20
                    ? `${status.content.slice(0, 20)}....`
                    : status.content)}
              </p>
            </div>
          </div>
          <StatusEditor
            onSubmit={handleSubmit}
            placeholder="Quote This Post..."
            size="size-8"
            className="p-0  sm:w-[450px] border-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
