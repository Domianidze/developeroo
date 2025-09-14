import { ThemeToggle } from "@/components";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full">
      <div className="absolute p-5 w-full flex justify-end">
        <ThemeToggle />
      </div>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {children}
      </div>
    </main>
  );
}
