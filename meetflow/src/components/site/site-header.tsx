import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-xl tracking-tight">
          MeetFlow
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#how-it-works" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            仕組み
          </Link>
          <Link href="/#pricing" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            料金
          </Link>
          <Link href="/#compliance" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            法令遵守
          </Link>
          <Show when="signed-out">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                ログイン
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">はじめる</Button>
            </Link>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                ダッシュボード
              </Button>
            </Link>
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
