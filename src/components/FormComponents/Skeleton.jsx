// components/ui/Skeleton.jsx
import React from "react";
import clsx from "clsx";

const Skeleton = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-300 dark:bg-gray-700",
        width,
        height,
        rounded,
        className
      )}
    ></div>
  );
};

export default Skeleton;
