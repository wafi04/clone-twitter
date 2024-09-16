import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getTime(times: number): string {
  const date = new Date(times);
  const day = date.getDate().toString().padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const time = `${month} ${day}, ${year}`;
  return time;
}

export function getTimeFromNow(date: number) {
  const creationDate = new Date(date);
  let timeAgo = formatDistanceToNow(creationDate, { addSuffix: true });
  timeAgo = timeAgo.replace(/^about\s/, "").replace(/\sago$/, "");

  return timeAgo;
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
