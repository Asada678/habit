import { Home, Settings } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background/95 pt-3 pb-8 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <button
        type="button"
        className="flex cursor-pointer flex-col items-center gap-1 text-primary transition-colors hover:text-primary/80"
      >
        <Home className="h-6 w-6" strokeWidth={2.5} />
        <span className="font-medium text-[10px]">ホーム</span>
      </button>
      <button
        type="button"
        className="flex cursor-pointer flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Settings className="h-6 w-6" strokeWidth={2.5} />
        <span className="font-medium text-[10px]">設定</span>
      </button>
    </nav>
  );
}
