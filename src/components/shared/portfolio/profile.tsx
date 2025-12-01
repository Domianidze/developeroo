import type { Octokit } from "@octokit/rest";
import { Building, MapPin, User } from "lucide-react";
import Image from "next/image";
import type { PropsWithChildren } from "react";

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
      <Image
        src={data.avatar_url}
        alt="avatar"
        width={150}
        height={150}
        className="rounded-xl border shadow-xs dark:border-input"
      />
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
