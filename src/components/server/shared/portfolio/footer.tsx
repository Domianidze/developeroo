import Link from "next/link";
import { Button, Logo } from "@/components";

export function Footer() {
  return (
    <div className="flex justify-end text-sm items-center gap-0.5">
      Powered by
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <Logo className="size-6" />
      </Button>
    </div>
  );
}
