import { Button } from "@/components/ui/button";

export function ChatPlaceholder() {
  return (
    <div className="flex flex-col space-y-5 justify-center items-center w-full h-screen">
      <h1 className="text-3xl font-bold">Start your Message with Member</h1>
      <Button className="dark:text-white  rounded-full h-14 bg-twitter  hover:bg-twitter/90">
        Start Messages
      </Button>
    </div>
  );
}
