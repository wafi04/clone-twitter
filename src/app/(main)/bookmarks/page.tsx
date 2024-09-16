import TrendsSidebar from "@/components/layouts/TrendsSidebar";
import { Metadata } from "next";
import React from "react";
import Main from "./Main";

export const metadata: Metadata = {
  title: "Bookmarks",
};

const page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 ">
        <Main />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default page;
