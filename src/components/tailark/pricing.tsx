"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Check } from "lucide-react";
import { Button } from "@/components";

export default function Pricing() {
  const { signIn } = useAuthActions();

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Pricing
          </h1>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">Free</h2>
                <span className="my-3 block text-2xl font-semibold">
                  $0 / mo
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("github")}
              >
                Get Started
              </Button>

              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Dynamic portfolio from GitHub",
                  "Light & dark mode",
                  "Published under our domain",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dark:bg-sidebar rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">Pro</h2>
                  <span className="my-3 block text-2xl font-semibold">
                    $1 / mo
                  </span>
                </div>

                <Button className="w-full" disabled>
                  Coming soon
                </Button>
              </div>

              <div>
                <div className="text-sm font-medium">
                  Everything in free, plus :
                </div>

                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {[
                    "Customize your portfolio",
                    "Style it your way",
                    "Use your own domain",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
