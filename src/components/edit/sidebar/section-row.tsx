import type { PropsWithChildren, ReactNode } from "react";
import { SidebarSeparator } from "@/components/ui";

interface SectionRowProps extends PropsWithChildren {
  action?: ReactNode;
  title: string;
}

export function SectionRow({ action, children, title }: SectionRowProps) {
  return (
    <>
      <section className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          {children}
        </div>
        {action}
      </section>
      <SidebarSeparator className="mx-0 h-px last:hidden" />
    </>
  );
}
