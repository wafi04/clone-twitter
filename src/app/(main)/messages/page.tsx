import { Metadata } from "next";
import Main from "./Main";

export const metadata: Metadata = {
  title: "Messages",
};

const Page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5 max-w-5xl">
      <div className="w-full min-w-0  border-r-2 ">
        <Main />
      </div>
    </main>
  );
};

export default Page;
