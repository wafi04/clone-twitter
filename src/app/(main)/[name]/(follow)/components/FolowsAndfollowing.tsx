import { FollowButton } from "@/components/ui/FollowButton";
import Navbar from "@/components/ui/Navbar";
import UserAvatar from "@/components/ui/UserAvatar";
import UserLinkWithTooltip from "@/components/ui/userlInkWithTooltip";
import { useUser } from "@/hooks/useUser";
import { UserData } from "@/lib/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { getTabClassName } from "./Utils";

interface Props {
  title: string;
  follow: UserData[];
  name: string;
}

const FollowsAndfollowing = ({ title, name, follow }: Props) => {
  const baseUrl = `/${name}`;

  const router = useRouter();

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Navbar title={title} className="pt-2">
        <div className="flex border-b w-full">
          <button
            className={getTabClassName(`${baseUrl}/following`)}
            onClick={() => handleTabClick(`${baseUrl}/following`)}
          >
            Following
          </button>
          <button
            className={getTabClassName(`${baseUrl}/followers`)}
            onClick={() => handleTabClick(`${baseUrl}/followers`)}
          >
            Followers
          </button>
        </div>
      </Navbar>
      {follow.map((follow) => (
        <div className="p-4 hover:bg-card" key={follow._id}>
          <div className="flex items-start">
            <UserAvatar avatarUrl={follow.image} className="size-10 mr-3" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <UserLinkWithTooltip username={follow.name as string}>
                    <Link href={`/${follow.name}`}>
                      <p className="font-semibold">{follow.name}</p>
                      <p className="text-sm text-gray-500">
                        @{follow.displayName || follow.name}
                      </p>
                    </Link>
                  </UserLinkWithTooltip>
                </div>
                <FollowButton user={follow._id} />
              </div>
              {follow.bio && <p className="text-sm mt-2">{follow.bio}</p>}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FollowsAndfollowing;
