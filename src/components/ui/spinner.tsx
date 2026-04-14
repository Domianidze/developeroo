import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <Loader2Icon
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
