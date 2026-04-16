"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Brush, Eye, Globe } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import {
  Button,
  Loader,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components";
import { Visibility } from "./visibility";

interface EditSidebarProps extends PropsWithChildren {
  baseUrl: string;
  login: string;
  published: boolean;
}

export function EditSidebar({
  baseUrl,
  children,
  login,
  published,
}: EditSidebarProps) {
  const { signOut } = useAuthActions();

  const sections = [
    {
      id: "visibility",
      Icon: Eye,
      label: "Visibility",
      Section: () => (
        <Visibility
          baseUrl={baseUrl}
          initialPublished={published}
          login={login}
        />
      ),
    },
    {
      id: "customization",
      Icon: Brush,
      label: "Customization",
      disabled: true,
    },
    {
      id: "dns",
      Icon: Globe,
      label: "DNS",
      disabled: true,
    },
  ];

  const [section, setSection] = useState(sections[0].id);

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="px-0">
        <SidebarContent>
          <div className="p-5 lg:p-3.5">
            <Tabs
              value={section}
              onValueChange={setSection}
              className="flex-col gap-4"
            >
              <TabsList>
                {sections.map(({ id, Icon, label, disabled }) => {
                  const active = id === section;

                  return (
                    <Tooltip key={id}>
                      <TooltipTrigger
                        render={
                          <TabsTrigger
                            value={id}
                            disabled={disabled}
                            className="pointer-events-auto!"
                          />
                        }
                      >
                        <Icon />
                        {active && <span>{label}</span>}
                      </TooltipTrigger>
                      {!active && (
                        <TooltipContent
                          side="right"
                          className="pointer-events-none"
                        >
                          {label} {disabled && "(Soon)"}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </TabsList>
              {sections.map(({ id, Section }) => (
                <TabsContent key={id} value={id}>
                  {Section && <Section />}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </SidebarContent>
        <SidebarFooter className="grid gap-2 p-5 pt-0">
          <Button
            variant="ghost"
            className="w-full"
            nativeButton={false}
            render={
              <a
                href="https://github.com/Domianidze/developeroo/issues"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Report an issue
          </Button>
          <Loader>
            {({ isLoading, startLoading }) => (
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => {
                  startLoading();
                  signOut();
                }}
              >
                {isLoading && <Spinner />}
                Log out
              </Button>
            )}
          </Loader>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="absolute top-5 left-5 min-[1160]:top-3 min-[1160]:left-3">
          <SidebarTrigger render={<Button variant="outline" size="icon" />} />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
