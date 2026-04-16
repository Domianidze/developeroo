import Image from "next/image";

interface LogoProps {
  className?: string;
  priority?: boolean;
}

export function Logo({ className, priority = false }: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/logo.svg"
        alt="logo"
        priority={priority}
        width={500}
        height={500}
        className="size-full dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        alt="logo"
        priority={priority}
        width={500}
        height={500}
        className="hidden size-full dark:block"
      />
    </div>
  );
}
