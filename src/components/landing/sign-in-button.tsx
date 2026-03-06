"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components";

export function SignInButton() {
  const { signIn } = useAuthActions();

  return (
    <Button
      variant="outline"
      onClick={() => {
        signIn("github");
      }}
    >
      Portfolio in an Instant
    </Button>
  );
}
