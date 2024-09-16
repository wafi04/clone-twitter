import React from "react";
import { Bookmark } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useBookmarks } from "@/hooks/useBookmarks";

export function ButtonBookmarks({ statusId }: { statusId: Id<"status"> }) {
  const { count, handleClick, isLoading, isSave } = useBookmarks({ statusId });

  return (
    <button
      onClick={handleClick}
      className="group flex items-center focus:outline-none transition-colors duration-300 ease-in-out text-gray-500 hover:text-blue-500"
      disabled={isLoading}
    >
      <div className="relative">
        <Bookmark
          className={`h-5 w-5 transition-all duration-300 ease-in-out
            ${isSave ? "fill-blue-500 text-blue-500" : "text-gray-500"}
            group-hover:text-blue-500 group-hover:scale-110
            ${isLoading ? "opacity-50" : ""}
          `}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {count > 0 && (
        <span
          className={`ml-2 text-xs transition-all duration-300 ease-in-out
          ${isSave ? "text-blue-500" : "text-gray-500"}
          group-hover:text-blue-500
        `}
        >
          {count}
        </span>
      )}
    </button>
  );
}
