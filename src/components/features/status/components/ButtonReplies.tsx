import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserAvatar from "@/components/ui/UserAvatar";
import { useStatus } from "@/hooks/useStatus";
import { CommentWithReplies, StatusWithCreator } from "@/lib/types";
import { MessageCircle, X } from "lucide-react";
import StatusEditor from "../editor";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export function ButtonReplies({
  status,
}: {
  status: CommentWithReplies | StatusWithCreator;
}) {
  const { onSubmit } = useStatus();
  const repliesLength = useQuery(api.status.getCountReplies, {
    statusId: status._id,
  });

  const handleSubmit = async (content: string, image: File | null) => {
    try {
      await onSubmit(content, image, status._id);
    } catch (error) {
      return;
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group flex items-center focus:outline-none transition-colors duration-300 ease-in-out text-gray-500 hover:text-blue-500">
          <div className="relative">
            <MessageCircle className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:scale-110" />
          </div>
          {repliesLength && repliesLength.length > 0 && (
            <span className="ml-1 text-xs transition-all duration-300 ease-in-out group-hover:text-blue-500">
              {repliesLength.length}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]  p-0 h-fit  ">
        <div className="flex justify-between items-center w-full px-5 py-3 bg-neutral-900">
          <h2>Replies</h2>
          <DialogClose>
            <X />
          </DialogClose>
        </div>
        <div className=" flex flex-col h-full px-5 pb-3 space-y-2 sm:w-[470px]">
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
            placeholder="Create Repliess..."
            size="size-8"
            className="p-0 sm:w-[450px] border-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
