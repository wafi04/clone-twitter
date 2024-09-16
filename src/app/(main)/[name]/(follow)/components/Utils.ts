"use client";
import { usePathname } from "next/navigation";

export const getTabClassName = (path: string) => {
  const pathname = usePathname();
  const isActive = pathname === path;
  return `flex-1 py-3 px-4 text-sm font-medium ${
    isActive
      ? "text-white border-b-2 border-twitter"
      : "text-gray-500 hover:text-foreground"
  }`;
};
