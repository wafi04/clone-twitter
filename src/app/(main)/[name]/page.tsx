import TrendsSidebar from "@/components/layouts/TrendsSidebar";
import React, { cache, ReactNode } from "react";
import Profile from "./Profile";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header, { GetAllData } from "./_components/Header";

export interface Iparams {
  params: {
    name: string;
  };
}

export const getUser = cache(async (name: string) => {
  const user = await fetchQuery(
    api.users.getUserByname,
    {
      name,
    },
    {}
  );
  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { name },
}: Iparams): Promise<Metadata> {
  const user = await getUser(decodeURIComponent(name));

  return {
    title: `${user.name} (@${user.displayName || user.name}) `,
  };
}

const page = ({ params }: Iparams) => {
  const name = decodeURIComponent(params.name);

  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 ">
        <Profile name={name} />
        <GetAllData name={name} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default page;
