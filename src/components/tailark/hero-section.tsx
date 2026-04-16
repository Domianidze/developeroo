"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import type { Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button, Loader, Logo, Spinner } from "@/components";
import { AnimatedGroup } from "./animated-group";
import { TextEffect } from "./text-effect";

const transitionVariants: { item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  const { signIn } = useAuthActions();

  return (
    <div className="overflow-hidden">
      <div className="absolute top-5 left-5 flex size-8 items-center">
        <Logo className="size-6" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 isolate opacity-65 contain-strict"
      >
        <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="-rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-60 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>
      <section>
        <div className="relative pt-15">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    delayChildren: 1,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  y: 20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    bounce: 0.3,
                    duration: 2,
                  },
                },
              },
            }}
            className="mask-b-from-35% mask-b-to-90% -z-20 absolute inset-0 top-56 lg:top-32"
          >
            <Image
              src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
              alt="background"
              className="hidden size-full dark:block"
              width="3276"
              height="4095"
            />
          </AnimatedGroup>

          <div
            aria-hidden
            className="-z-10 absolute inset-0 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
          />

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mt-0 lg:mr-auto">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
              >
                Portfolio in an instant
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-8 max-w-2xl text-balance text-lg"
              >
                Generate a developer portfolio from your Github profile with a
                click of a button
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex items-center justify-center gap-2"
              >
                <div
                  key={1}
                  className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5"
                >
                  <Loader>
                    {({ isLoading, startLoading }) => (
                      <Button
                        size="lg"
                        className="rounded-xl px-5 text-base"
                        disabled={isLoading}
                        onClick={() => {
                          startLoading();
                          signIn("github");
                        }}
                      >
                        {isLoading && <Spinner />}
                        <span className="text-nowrap">Get started</span>
                      </Button>
                    )}
                  </Loader>
                </div>
                <Button
                  key={2}
                  size="lg"
                  variant="ghost"
                  className="h-10.5 rounded-xl px-5"
                  render={
                    <Link
                      href="https://github.com/Domianidze/developeroo"
                      target="_blank"
                    />
                  }
                  nativeButton={false}
                >
                  <span className="text-nowrap">Star us</span>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="mask-b-from-55% relative mt-8 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20">
              <div className="relative inset-shadow-2xs mx-auto aspect-16/9 max-w-6xl overflow-hidden rounded-lg border bg-background p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-background md:rounded-2xl dark:inset-shadow-white/20">
                <Image
                  className="relative hidden rounded bg-background md:rounded-xl dark:block"
                  src="/preview-dark.png"
                  alt="app screen"
                  width="2700"
                  height="1440"
                />
                <Image
                  className="relative z-2 rounded border border-border/25 md:rounded-xl dark:hidden"
                  src="/preview.png"
                  alt="app screen"
                  width="2700"
                  height="1440"
                />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </div>
  );
}
