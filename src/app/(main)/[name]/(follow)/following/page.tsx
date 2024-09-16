import React from "react";
import { Iparams } from "../../page";
import Following from "./Following";

const Page = ({ params }: Iparams) => {
  const name = decodeURIComponent(params.name);
  return <Following name={name} />;
};

export default Page;
