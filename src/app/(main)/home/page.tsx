import React from "react";
import TrendsSidebar from "@/components/layouts/TrendsSidebar";
import { Main } from "./main";

const Page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 ">
        <Main />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;
