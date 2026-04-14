"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib";
import { SectionRow } from "./section-row";

interface VisibilityProps {
  baseUrl: string;
  initialPublished: boolean;
  login: string;
}

export function Visibility({
  baseUrl,
  initialPublished,
  login,
}: VisibilityProps) {
  const url = `${baseUrl}/${login}`;
  const togglePublished = useMutation(api.users.togglePublished);

  const [published, setPublished] = useState(initialPublished);
  const [isPending, setIsPending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handlePublishToggle() {
    const previousPublished = published;
    const nextPublished = !previousPublished;

    setIsPending(true);
    setPublished(nextPublished);

    try {
      const result = await togglePublished({});

      setPublished(result.published);
    } catch {
      setPublished(previousPublished);
    } finally {
      setIsPending(false);
    }
  }

  async function handleCopyUrl() {
    if (!published) {
      return;
    }

    await navigator.clipboard.writeText(url);

    setIsCopied(true);

    window.setTimeout(() => setIsCopied(false), 1500);
  }

  return (
    <div className="space-y-3">
      <SectionRow
        title="Status"
        action={
          <Button
            className="w-full"
            disabled={isPending}
            onClick={handlePublishToggle}
          >
            {published ? "Unpublish" : "Publish"}
          </Button>
        }
      >
        <p
          className={cn(
            "text-sm text-muted-foreground transition-colors",
            published && "text-primary",
          )}
        >
          {published ? "Published" : "Draft"}
        </p>
      </SectionRow>
      <SectionRow
        title="URL"
        action={
          <Button
            variant="outline"
            className="w-full"
            disabled={!published}
            onClick={handleCopyUrl}
          >
            {isCopied ? "Copied" : "Copy"}
          </Button>
        }
      >
        {published ? (
          <Button
            variant="link"
            className="p-0 h-auto w-full "
            nativeButton={false}
            render={
              <a href={url} target="_blank" rel="noreferrer" title={url} />
            }
          >
            <span className="truncate">{url}</span>
          </Button>
        ) : (
          <p className="truncate text-sm text-muted-foreground">
            Publish to get a shareable link
          </p>
        )}
      </SectionRow>
    </div>
  );
}
