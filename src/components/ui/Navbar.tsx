"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

const Navbar = ({
  children,
  title,
  className,
}: {
  children?: ReactNode;
  title: string;
  className?: string;
}) => {
  const { back } = useRouter();

  return (
    <div
      className={cn(
        "flex flex-col w-full sticky top-0  items-center border-b",
        className
      )}
    >
      <div className="flex items-center w-full  px-4 py-2 gap-x-4">
        <Button
          className="rounded-full p-2 hover:bg-gray-100 bg-neutral-200/70 transition-colors"
          onClick={() => back()}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
        {/* Placeholder for additional buttons/icons */}
      </div>
      {children}
    </div>
  );
};

export default Navbar;
