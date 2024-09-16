import Sidebar from "@/components/layouts/Sidebar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full  grow ">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
