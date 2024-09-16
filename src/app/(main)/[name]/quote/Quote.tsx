"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import Quotes from "../_components/Quote";
import Header from "../_components/Header";

export function Quote({ name }: { name: string }) {
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.quote.getAllQuoteByUser,
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

  console.log(results);
  return (
    results && (
      <>
        <Header name={name} />
        <InfiniteScrollContainer
          onBottomReached={() => loadMore(5)}
          number={5}
          className="overflow-hidden"
        >
          {results.map((status) => (
            <Quotes status={status} key={status._id} />
          ))}
        </InfiniteScrollContainer>
      </>
    )
  );
}
