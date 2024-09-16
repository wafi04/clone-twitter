import TrendsSidebar from "@/components/layouts/TrendsSidebar";
import React, { cache, ReactNode } from "react";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { api } from "../../../../../convex/_generated/api";
import Profile from "../Profile";
import { getUser } from "../page";
import Header from "../_components/Header";
import { Quote } from "./Quote";

export interface Iparams {
  params: {
    name: string;
  };
}

export async function generateMetadata({
  params: { name },
}: Iparams): Promise<Metadata> {
  const user = await getUser(decodeURIComponent(name));

  return {
    title: `${user.name} (@${user.displayName || user.name})`,
  };
}

const page = ({ params }: Iparams) => {
  const name = decodeURIComponent(params.name);

  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 overflow-hidden">
        <Profile name={name} />
        <Quote name={name} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default page;
