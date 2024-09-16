import LeftSIde from "@/components/features/messages/components/LeftSIde";
import RightSide from "@/components/features/messages/components/RightSide";
import React from "react";

const Main = () => {
  return (
    <div className="flex w-full max-w-5xl">
      <LeftSIde />
      <RightSide />
    </div>
  );
};

export default Main;
