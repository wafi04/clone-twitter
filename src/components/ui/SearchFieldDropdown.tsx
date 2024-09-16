"use client";

import { Search, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
// import UserAvatar from "../ui/userAvatar";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function SearchField() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const results = useQuery(api.users.serachUser, {
    name: text,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setText(value);
    setIsDropdownOpen(value.trim() !== "");
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Input
          name="q"
          value={text}
          onChange={handleInputChange}
          placeholder="Search"
          className="pe-10 py-2  focus:outline-none focus:border-accent focus:ring-0 rounded-full"
        />
        <button
          type="submit"
          className="absolute right-3 top-4 size-5 -translate-y-1/2"
        >
          <SearchIcon className="transform text-muted-foreground" />
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background max-h-[300px] border border-card rounded-t-xl rounded-b-xl shadow-lg">
          {results && results.length > 0 ? (
            results.map((result, index) => (
              <Link
                key={index}
                href={`/${result.name}`}
                className="px-4 py-2 flex cursor-pointer hover:bg-card gap-4 items-center rounded-xl"
              >
                <UserAvatar avatarUrl={result.image} size={30} />
                <div className="flex flex-col">
                  <p className="font-bold">{result.name}</p>
                  <p className="text-gray-500">@{result.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-2 text-center text-gray-500 flex gap-4 h-20 items-center justify-center">
              <Search size={20} />
              User not found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
