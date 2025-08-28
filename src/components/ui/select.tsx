import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
