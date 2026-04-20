import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/cn";

export type NavItem = { label: string; href: string };

export function AppShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] bg-[var(--card)] md:flex md:flex-col">
        <Link href="/" className="border-b border-[var(--border)] px-6 py-5 font-serif text-lg">
          MeetFlow
        </Link>
        <p className="px-6 pt-6 text-xs tracking-[0.2em] text-[var(--muted-foreground)]">
          {title.toUpperCase()}
        </p>
        <nav className="mt-3 flex flex-col gap-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-[var(--border)] px-4 py-4">
          <UserButton />
        </div>
      </aside>
      <main className="flex-1 bg-[var(--background)] px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
