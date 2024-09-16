import React from "react";
import Image from "next/image";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader2 } from "lucide-react";
export type Media = {
  mediaId: Id<"_storage">;
  post: string;
  url: string;
  _creationTime: number;
  _id: Id<"media">;
};

interface MediaGridProps {
  statusId: Id<"status">;
}

const MediaGrid: React.FC<MediaGridProps> = ({ statusId }) => {
  //   const displayedMedia = media.slice(0, maxDisplay);
  const dataMedia = useQuery(api.status.getMediaForStatus, {
    statusId,
  });

  if (dataMedia === undefined) {
    return (
      <div className="space-y-4">
        {/* Image placeholder */}
        <div className="bg-gray-300 animate-pulse h-40 w-full rounded-md" />

        {/* Text placeholders */}
        <div className="space-y-2">
          <div className="bg-gray-300 animate-pulse h-4 w-3/4 rounded-md" />
          <div className="bg-gray-300 animate-pulse h-4 w-1/2 rounded-md" />
        </div>
      </div>
    );
  }

  if (dataMedia.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex justify-start items-center my-3">
      {dataMedia &&
        dataMedia.map((item, index) => (
          <div key={item._id}>
            <Image
              src={item.url}
              alt={`Media ${index + 1}`}
              height={500}
              width={500}
              className="rounded-lg  w-full  h-[400px]"
            />
          </div>
        ))}
    </div>
  );
};

export default MediaGrid;
