import { ThemeToggle } from "@/components";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full">
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>
      <div className="min-h-dvh">{children}</div>
    </main>
  );
}
