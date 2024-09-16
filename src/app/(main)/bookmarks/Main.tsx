"use client";
import { usePaginatedQuery } from "convex/react";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import Bookmarks from "./Bookmarks";

const Main = () => {
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.Bookmarks.getAllBookamarksByUser,
    {},
    {
      initialNumItems: 6,
    }
  );
  console.log(results);
  return (
    <InfiniteScrollContainer onBottomReached={() => loadMore(6)} number={6}>
      {results.map((r) => (
        <Bookmarks bookmarks={r} key={r._id} />
      ))}
    </InfiniteScrollContainer>
  );
};

export default Main;
