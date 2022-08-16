import Image from "next/image";
import React, { useEffect, useState } from "react";
import Container from "./container";
import api from "../utils/api";

import userOneImg from "../public/img/user1.jpg";
import userTwoImg from "../public/img/user2.jpg";
import userThreeImg from "../public/img/user3.jpg";
import Plan from "./plan";

export default function Plans({ plans }) {

  return (
    <div className="grid gap-10 lg:grid-cols-4 xl:grid-cols-4 mt-6">
      {/* <div className="lg:col-span-2 xl:col-auto"> */}
      {/* <div className="flex flex-wrap justify-center gap-5 mt-10 md:justify-around"> */}
      {/* <div className="flex flex-col justify-center"> */}
      {/* <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3"> */}
        {plans ? <>
        {/* <pre>{JSON.stringify(plans, null, 2)}</pre> */}
        {plans.map((plan, index) => {
          return <Plan plan={plan} key={index} />
        })}
        </> : null}

      {/* </div> */}
      </div>
  );
}
