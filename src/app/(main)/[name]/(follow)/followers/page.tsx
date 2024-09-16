import React from "react";
import { Iparams } from "../../page";
import Followers from "./Followers";

const Page = ({ params }: Iparams) => {
  const name = decodeURIComponent(params.name);
  return <Followers name={name} />;
};

export default Page;
