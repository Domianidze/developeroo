import Link from "next/link";
import { Button, Logo } from "@/components";

export function Footer() {
  return (
    <div className="flex items-center justify-end gap-0.5 text-sm">
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
