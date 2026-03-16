import type { Octokit } from "@octokit/rest";
import { Building, MapPin, User } from "lucide-react";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { Skeleton } from "@/components/ui";
import { cn } from "@/lib";

function DetailWrapper({ children }: PropsWithChildren) {
  return <div className="flex items-center gap-2">{children}</div>;
}

interface DetailsProps {
  name?: string | null;
  location?: string | null;
  company?: string | null;
  className?: string;
}

function Details({ name, location, company, className }: DetailsProps) {
  return (
    <div className={cn("flex gap-4 text-sm", className)}>
      <DetailWrapper>
        <User />
        {name ? <span>{name}</span> : <Skeleton className="h-4 w-30" />}
      </DetailWrapper>
      <DetailWrapper>
        <MapPin />
        {location ? <span>{location}</span> : <Skeleton className="h-4 w-30" />}
      </DetailWrapper>
      <DetailWrapper>
        <Building />
        {company ? <span>{company}</span> : <Skeleton className="h-4 w-30" />}
      </DetailWrapper>
    </div>
  );
}

interface ProfileMarkupProps {
  data?: {
    avatarUrl?: string;
    name?: string | null;
    location?: string | null;
    company?: string | null;
    bio?: string | null;
  };
}

export function ProfileMarkup({ data }: ProfileMarkupProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex items-center gap-4 lg:block">
        <div className="relative size-37.5 shrink-0 overflow-hidden rounded-xl border shadow-xs dark:border-input">
          {data?.avatarUrl ? (
            <Image
              src={data.avatarUrl}
              alt="avatar"
              fill
              sizes="150px"
              className="object-cover"
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
        <Details
          name={data?.name}
          location={data?.location}
          company={data?.company}
          className="flex-col lg:hidden"
        />
      </div>
      <div className="w-full lg:space-y-4">
        <Details
          name={data?.name}
          location={data?.location}
          company={data?.company}
          className="hidden lg:flex flex-row justify-between items-center"
        />
        {data?.bio ? (
          <p className="text-sm">{data.bio}</p>
        ) : (
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
      </div>
    </div>
  );
}

interface ProfileProps {
  login: string;
  octokit: Octokit;
}

export async function Profile({ login, octokit }: ProfileProps) {
  const response = await octokit.users.getByUsername({ username: login });

  const data = {
    avatarUrl: response.data.avatar_url,
    name: response.data.name,
    location: response.data.location,
    company: response.data.company,
    bio: response.data.bio,
  };

  return <ProfileMarkup data={data} />;
}
