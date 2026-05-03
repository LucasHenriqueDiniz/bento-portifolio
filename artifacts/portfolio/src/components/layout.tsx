import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-8 mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2 font-bold tracking-tight">
              <span>ana.sh</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Dashboard
            </Link>
            <Link href="/projects" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Projects
            </Link>
            <Link href="/donate" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Donate
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  );
}
