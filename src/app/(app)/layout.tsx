import { ThemeToggle } from "@/components";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full">
      <div className="absolute z-10 top-5 right-5">
        <ThemeToggle />
      </div>
      <div className="min-h-dvh bg-neutral-50 dark:bg-neutral-950">
        {children}
      </div>
    </main>
  );
}
