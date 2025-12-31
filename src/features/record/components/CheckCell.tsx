"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CheckCellProps {
  status: boolean; // checked or not
  hasNote: boolean;
  color?: string;
  onClick: () => void;
  onLongPress: () => void;
}

export function CheckCell({
  status,
  hasNote,
  color,
  onClick,
  onLongPress,
}: CheckCellProps) {
  return (
    <div className="h-full w-full">
      <Button
        variant="ghost"
        className={cn(
          "relative h-full w-full rounded-none p-0 transition-all duration-200",
          !status && "hover:bg-muted/50",
        )}
        style={{
          backgroundColor: status ? color || "var(--primary)" : undefined,
        }}
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress();
        }}
      >
        {hasNote && (
          <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-yellow-500 ring-1 ring-background/50" />
        )}
      </Button>
    </div>
  );
}
