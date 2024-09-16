import Follows from "@/components/features/follow/follows";
import TrendsSidebar from "@/components/layouts/TrendsSidebar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Connect",
};

const Page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 ">
        <Follows />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
