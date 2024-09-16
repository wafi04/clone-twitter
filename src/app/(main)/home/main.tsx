"use client";
import { useStatus } from "@/hooks/useStatus";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import StatusPage from "@/components/features/status/StatusPage";

const StatusEditor = dynamic(
  () => import("@/components/features/status/editor"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
export function Main({ parentStatusId }: { parentStatusId?: Id<"status"> }) {
  const { onSubmit, toast } = useStatus();

  const handleSubmit = async (content: string, image: File | null) => {
    try {
      await onSubmit(content, image, parentStatusId);
    } catch (error) {
      return;
    }
  };

  return (
    <>
      <StatusEditor onSubmit={handleSubmit} />
      <StatusData />
    </>
  );
}

function StatusData() {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.status.getStatusAll,
    {},
    {
      initialNumItems: 7,
    }
  );

  return (
    <InfiniteScrollContainer onBottomReached={() => loadMore(6)} number={6}>
      {results.map((data) => (
        <StatusPage key={data._id} status={data} />
      ))}
    </InfiniteScrollContainer>
  );
}
