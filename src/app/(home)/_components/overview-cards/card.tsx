import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import type { JSX, SVGProps, ReactNode } from "react";
import React from "react";

type PropsType = {
  label: string;
  data: {
    value: number | string;
    growthRate: number;
  };
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  /** Extra CSS classes */
  className?: string;
  /** Optional action element (button, link, etc.) */
  action?: ReactNode;
};
export function OverviewCard({
  label,
  data,
  Icon,
  className = "",
  action,
}: {
  label: string;
  data: { value: string; growthRate: number };
  Icon?: React.ComponentType<any>; // made optional
  className?: string;
  action?: React.ReactNode;
}) {
  const isDecreasing = data.growthRate < 0;

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark",
        className
      )}
    >
      <div className="flex justify-between items-start">
        {Icon && <Icon />} {/* Only render if Icon is provided */}
        {action && <div>{action}</div>}
      </div>

      <div className="mt-6 flex items-end justify-between">
        <dl>
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {data.value}
          </dt>
          <dd className="text-sm font-medium text-dark-6">{label}</dd>
        </dl>

        <dl
          className={cn(
            "text-sm font-medium",
            isDecreasing ? "text-red" : "text-green"
          )}
        >
          <dt className="flex items-center gap-1.5">
            {Math.abs(data.growthRate)}%
            {isDecreasing ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </dt>
          <dd className="sr-only">
            {label} {isDecreasing ? "Decreased" : "Increased"} by{" "}
            {Math.abs(data.growthRate)}%
          </dd>
        </dl>
      </div>
    </div>
  );
}

