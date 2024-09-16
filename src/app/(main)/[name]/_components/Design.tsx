import { replies, UserData } from "@/lib/types";
import { GetAllData, Status } from "../_components/Header";
import InfiniteScrollContainer from "@/components/ui/InfiniteScrollContainer";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";
import UserAvatar from "@/components/ui/UserAvatar";
import { getTime, getTimeFromNow } from "@/lib/utils";
import Linkify from "@/components/ui/Linkify";
import { useRouter } from "next/navigation";
import { ButtonReplies } from "@/components/features/status/components/ButtonReplies";
import { DropdownRetweet } from "@/components/features/status/components/ButtonRetweetandQuote";
import { ButtonLike } from "@/components/features/status/components/ButtonLike";
import { ButtonBookmarks } from "@/components/features/status/components/ButtonBookmarks";
import MediaGrid from "@/components/ui/MediaPost";

export function Design({
  creator,
  replies,
  type,
}: {
  creator: UserData;
  replies: replies;
  type: "like" | "retweet";
}) {
  const { push } = useRouter();
  return (
    <div className="relative border-b mt-5 border-neutral-800 ">
      <Header type={type} name={creator.name as string} />
      <div className="flex items-start space-x-3 p-4 relative h-full">
        <div className="flex-shrink-0">
          <UserLinkWithTooltip username={creator.name as string}>
            <UserAvatar avatarUrl={creator.image} size={40} />
          </UserLinkWithTooltip>
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center space-x-1">
            <UserLinkWithTooltip username={creator.name as string}>
              <p className="text-sm font-medium text-gray-200">
                {creator.name}
              </p>
            </UserLinkWithTooltip>

            <UserLinkWithTooltip username={creator.name as string}>
              <span className="text-sm text-gray-500">
                @{creator.email?.split("@")[0]}
              </span>
            </UserLinkWithTooltip>

            <span className="text-sm text-gray-500">·</span>
            <span
              className="text-sm text-gray-500 hover:text-white cursor-pointer hover:font-bold"
              title={getTime(replies._creationTime)}
            >
              {getTimeFromNow(replies._creationTime)}
            </span>
          </div>
          <Linkify>
            <div
              onClick={() => push(`/${creator.name}/status/${replies._id}`)}
              className="whitespace-pre-wrap break-words w-full cursor-pointer"
            >
              {replies?.content}
            </div>
          </Linkify>
          <MediaGrid statusId={replies._id} />
          {replies && (
            <div className="grid grid-cols-4 w-full mt-2">
              <ButtonReplies status={replies} />
              <DropdownRetweet status={replies} />
              <ButtonLike statusId={replies._id} />
              <ButtonBookmarks statusId={replies._id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  type: "like" | "retweet";
  name: string;
}

const Header: React.FC<HeaderProps> = ({ type, name }) => {
  const icon =
    type === "like" ? (
      <svg
        className="w-5 h-5 text-pink-600"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ) : (
      <svg
        className="w-5 h-5 text-green-600"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z" />
      </svg>
    );

  return (
    <div className="flex items-center space-x-3 text-sm text-gray-500  pl-5">
      {icon}
      <span className="font-bold text-gray-700 hover:underline cursor-pointer">
        {name}
      </span>
      <span>{type === "like" ? "liked" : "retweeted"}</span>
    </div>
  );
};
