import { ExternalLink, type LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib";

interface SectionWrapperProps extends PropsWithChildren {
  icon: LucideIcon;
  title: string;
  viewAllUrl?: string;
  className?: string;
}

export function SectionWrapper({
  icon,
  title,
  viewAllUrl,
  children,
  className,
}: SectionWrapperProps) {
  const Icon = icon;

  return (
    <section className={cn("grid gap-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon />
          <h3>{title}</h3>
        </div>
        {viewAllUrl ? (
          <a
            href={viewAllUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`View all ${title.toLowerCase()}`}
          >
            <ExternalLink className="size-4" aria-hidden />
          </a>
        ) : null}
      </div>
      {children}
    </section>
  );
}
