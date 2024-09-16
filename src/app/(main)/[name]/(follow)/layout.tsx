import TrendsSidebar from "@/components/layouts/TrendsSidebar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 ">{children}</div>
      <TrendsSidebar />
    </main>
  );
};

export default layout;
