import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height
}) => {
  const style: React.CSSProperties = {
    width,
    height
  };

  return (
    <div
      style={style}
      className={cn(
        "animate-pulse bg-slate-200/80 dark:bg-slate-700",
        {
          "rounded-md": variant === "rectangular",
          "rounded-full": variant === "circular",
          "h-3 w-full rounded": variant === "text"
        },
        className
      )}
    />
  );
};

export default Skeleton;
