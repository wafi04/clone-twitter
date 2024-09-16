import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import TrendsSidebar from "@/components/layouts/TrendsSidebar";
import Status from "./Status";
interface Props {
  params: {
    statusId: Id<"status">;
  };
}

const Page = ({ params }: Props) => {
  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl ">
      <div className="w-full min-w-0  border-r-2 overflow-hidden">
        <Status statusId={params.statusId} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
