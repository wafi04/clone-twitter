import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { StatusWithCreator, StatusWithCreatorAndChildren } from "@/lib/types";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

const useStatusThread = (statusId: Id<"status">) => {
  const statusThread = useQuery(api.status.getStatusWithParents, { statusId });
  const [parentStatuses, setParentStatuses] = useState<
    StatusWithCreatorAndChildren[]
  >([]);
  const [targetStatus, setTargetStatus] =
    useState<StatusWithCreatorAndChildren | null>(null);
  const [childStatuses, setChildStatuses] = useState<StatusWithCreator[]>([]);

  useEffect(() => {
    if (statusThread) {
      const targetIndex = statusThread.findIndex(
        (status) => status._id === statusId
      );
      if (targetIndex !== -1) {
        setParentStatuses(statusThread.slice(0, targetIndex).reverse());
        setTargetStatus(statusThread[targetIndex]);
        setChildStatuses(statusThread.slice(targetIndex + 1));
      }
    }
  }, [statusThread, statusId]);

  return { parentStatuses, targetStatus, childStatuses, statusThread };
};

export default useStatusThread;
