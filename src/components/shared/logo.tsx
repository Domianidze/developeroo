import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/developeroo.svg"
        alt="logo"
        width={500}
        height={500}
        className="size-full dark:hidden"
      />
      <Image
        src="/developeroo-dark.svg"
        alt="logo"
        width={500}
        height={500}
        className="hidden size-full dark:block"
      />
    </div>
  );
}
