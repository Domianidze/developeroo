import type { Octokit } from "@octokit/rest";
import { AtSign, Mail } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { Button, Skeleton } from "@/components/ui";
import { SectionWrapper } from "./section-wrapper";

interface ContactMarkupProps {
  email?: string;
  data?: {
    id: string;
    url?: string;
    label?: string;
  }[];
}

export function ContactMarkup({ email, data }: ContactMarkupProps) {
  data ??= Array.from({ length: 4 }, (_, index) => ({
    id: `contact-fallback-${index + 1}`,
    url: undefined,
    label: undefined,
  }));

  return (
    <SectionWrapper icon={AtSign} title="Contact">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild disabled={!email}>
          <a href={email ? `mailto:${email}` : undefined}>
            {email ? (
              <Mail className="size-4" />
            ) : (
              <Skeleton className="size-4 rounded-full" />
            )}
            {email ?? <Skeleton className="h-4 w-52" />}
          </a>
        </Button>
        {data.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            size="sm"
            asChild
            disabled={!item.url}
          >
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.url ? (
                <SocialIcon as="div" url={item.url} className="size-4!" />
              ) : (
                <Skeleton className="size-4 rounded-full" />
              )}
              {item.label ?? <Skeleton className="h-4 w-42" />}
            </a>
          </Button>
        ))}
      </div>
    </SectionWrapper>
  );
}

function getLabel(url: string): string {
  const { pathname } = new URL(url);

  return pathname.replace(/^\/+|\/+$/g, "");
}

interface ContactProps {
  login: string;
  email?: string;
  octokit: Octokit;
}

export async function Contact({ login, email, octokit }: ContactProps) {
  const response = await octokit.users.listSocialAccountsForUser({
    username: login,
  });

  const data = response.data.slice(0, 4).map(({ url }, index) => ({
    id: `contact-${index + 1}`,
    url,
    label: getLabel(url),
  }));

  return <ContactMarkup email={email} data={data} />;
}
