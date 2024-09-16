import React from "react";
import { Heart } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useLike } from "@/hooks/uselike";

export function ButtonLike({ statusId }: { statusId: Id<"status"> }) {
  const { isLiked, count, handleClick, isLoading } = useLike({ statusId });

  return (
    <button
      onClick={handleClick}
      className="group flex items-center focus:outline-none"
      disabled={isLoading}
    >
      <div className="relative">
        <Heart
          className={`h-5 w-5 mr-2 transition-all duration-300 ease-in-out
            ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}
            group-hover:text-red-500 group-hover:scale-110
            ${isLoading ? "opacity-50" : ""}
          `}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {count > 0 && (
        <span
          className={`text-xs transition-all duration-300 ease-in-out
          ${isLiked ? "text-red-500" : "text-gray-500"}
          group-hover:text-red-500
        `}
        >
          {count}
        </span>
      )}
    </button>
  );
}
