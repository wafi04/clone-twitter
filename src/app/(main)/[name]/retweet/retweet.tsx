"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import { Design } from "../_components/Design";
import Header from "../_components/Header";

export function Retweet({ name }: { name: string }) {
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.retweet.getAllRtweeterByUser,
    {
      name,
    },
    {
      initialNumItems: 5,
    }
  );
  if (results === null) {
    return;
  }
  return (
    results && (
      <>
        <Header name={name} />
        <InfiniteScrollContainer onBottomReached={() => loadMore(5)} number={5}>
          {results.map((status) => (
            <Design
              key={status._id}
              creator={status.creator}
              replies={status.replies}
              type="retweet"
            />
          ))}
        </InfiniteScrollContainer>
      </>
    )
  );
}
