import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "../../convex/_generated/dataModel";

export const useQuote = () => {
  const mutationQuote = useMutation(api.quote.createQuote);
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteQuote = useMutation(api.quote.deleteQuote);
  const { toast } = useToast();
  const onSubmit = useCallback(
    async (content: string, statusId: Id<"status">) => {
      try {
        await mutationQuote({
          content,
          statusId,
        });
        toast({
          description: "Status posted successfully!",
        });
      } catch (error) {
        toast({
          description: "Something went wrong while posting the status.",
          variant: "destructive",
        });
      }
    },
    [mutationQuote, toast]
  );
  const onDelete = useCallback(
    async (quote: Id<"quote">) => {
      try {
        await deleteQuote({
          quoteId: quote,
        });
        toast({
          description: "Status Delete successfully!",
        });
      } catch (error) {
        toast({
          description: "Something went wrong while posting the status.",
          variant: "destructive",
        });
      }
    },
    [mutationQuote, toast, deleteQuote]
  );

  const handleOpen = useCallback(() => {
    setDialogOpen(true);
  }, []);
  const handleCLose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return {
    handleOpen,
    handleCLose,
    dialogOpen,
    onDelete,
    onSubmit,
  };
};
