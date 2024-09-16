import { Metadata } from "next";
import React from "react";
import Notifications from "./Notifications";
import TrendsSidebar from "@/components/layouts/TrendsSidebar";

export const metadata: Metadata = {
  title: "Notifications",
};

const Page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 ">
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
