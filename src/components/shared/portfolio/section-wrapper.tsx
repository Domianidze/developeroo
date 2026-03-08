import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib";

interface SectionWrapperProps extends PropsWithChildren {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function SectionWrapper({
  icon,
  title,
  children,
  className,
}: SectionWrapperProps) {
  const Icon = icon;

  return (
    <section className={cn("grid gap-4", className)}>
      <div className="flex items-center gap-2">
        <Icon />
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}
