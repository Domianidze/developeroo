import type { Octokit } from "@octokit/rest";
import { AtSign, Mail } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { Button, Skeleton } from "@/components/ui";

interface ContactProps {
  login: string;
  email?: string;
  octokit: Octokit;
}

function getLabel(url: string): string {
  const { pathname } = new URL(url);

  return pathname.replace(/^\/+|\/+$/g, "");
}

export async function Contact({ login, email, octokit }: ContactProps) {
  const { data } = await octokit.users.listSocialAccountsForUser({
    username: login,
  });

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <AtSign />
        <h3>Contact</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {email ? (
          <Button variant="outline" size="sm" asChild>
            <a href={`mailto:${email}`}>
              <Mail className="size-4" />
              {email}
            </a>
          </Button>
        ) : null}
        {data.map(({ url }) => (
          <Button key={url} variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <SocialIcon as="div" url={url} className="size-4!" />
              {getLabel(url)}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <AtSign />
        <h3>Contact</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-58 rounded-md" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={`contact-fallback-${index + 1}`}
            className="h-8 w-48 rounded-md"
          />
        ))}
      </div>
    </div>
  );
}
