import type { Metadata } from "next";
import { HeroSection, Pricing } from "@/components";
import { RequireGuest } from "@/components/server";
import { title } from "@/lib";

export const metadata: Metadata = {
  title: title("Portfolio in an Instant"),
  description:
    "Generate a developer portfolio from your Github profile with a click of a button",
};

export default async function Landing() {
  return (
    <RequireGuest>
      <HeroSection />
      <Pricing />
    </RequireGuest>
  );
}
