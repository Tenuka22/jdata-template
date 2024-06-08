import React from "react";
import { Separator } from "./ui/separator";

const HeroSec = () => {
  return (
    <div className="flex items-center justify-start pb-14">
      <div className="flex flex-col items-start justify-center gap-2">
        <span className="text-5xl sm:text-8xl font-semibold text-left">
          JData
        </span>
        <span className="text-xl sm:text-2xl font-medium text-left">
          Genarate JSON Data from Text
        </span>
        <Separator />
      </div>
    </div>
  );
};

export default HeroSec;
