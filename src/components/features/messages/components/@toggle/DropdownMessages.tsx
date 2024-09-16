import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useEditMessages, useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { Messages } from "../../types";

export function DrodpdownMessages({
  message,
  isSender,
}: {
  message: Messages;
  isSender: boolean;
}) {
  const { deleteMessages } = useMessages();
  const { setEdit, setReply } = useEditMessages();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`p-0 bg-transparent group-hover:visible invisible hover:bg-transparent size-4 absolute top-0 ${isSender ? "right-2" : "left-2"} text-white`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!isSender ||
            (!message.image && (
              <DropdownMenuItem onClick={() => setEdit(message)}>
                Edit
              </DropdownMenuItem>
            ))}

          <DropdownMenuItem onClick={() => setReply(message)}>
            reply
          </DropdownMenuItem>
          {isSender && (
            <DropdownMenuItem onClick={() => deleteMessages(message._id)}>
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
