import type { Octokit } from "@octokit/rest";
import { Building, MapPin, User } from "lucide-react";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { Skeleton } from "@/components/ui";

interface ProfileProps {
  login: string;
  octokit: Octokit;
}

function DetailWrapper({ children }: PropsWithChildren) {
  return <div className="flex items-center gap-2">{children}</div>;
}

export async function Profile({ login, octokit }: ProfileProps) {
  const { data } = await octokit.users.getByUsername({ username: login });

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="relative h-37.5 w-37.5 shrink-0 overflow-hidden rounded-xl border shadow-xs dark:border-input">
        <Image
          src={data.avatar_url}
          alt="avatar"
          fill
          sizes="150px"
          className="object-cover"
        />
      </div>
      <div className="text-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
          <DetailWrapper>
            <User />
            <span>{data.name}</span>
          </DetailWrapper>
          <DetailWrapper>
            <MapPin />
            <span>{data.location}</span>
          </DetailWrapper>
          <DetailWrapper>
            <Building />
            <span>{data.company}</span>
          </DetailWrapper>
        </div>
        <p>{data.bio}</p>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="relative h-37.5 w-37.5 shrink-0">
        <Skeleton className="h-full w-full rounded-xl border shadow-xs dark:border-input" />
      </div>
      <div className="text-sm space-y-4 flex-1">
        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
          <DetailWrapper>
            <User />
            <Skeleton className="h-4 w-28" />
          </DetailWrapper>
          <DetailWrapper>
            <MapPin />
            <Skeleton className="h-4 w-24" />
          </DetailWrapper>
          <DetailWrapper>
            <Building />
            <Skeleton className="h-4 w-32" />
          </DetailWrapper>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
