import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CheckCellProps {
    status: boolean; // checked or not
    hasNote: boolean;
    color?: string;
    onClick: () => void;
    onLongPress: () => void;
}

export function CheckCell({ status, hasNote, color, onClick, onLongPress }: CheckCellProps) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <Button
                variant="ghost"
                className={cn(
                    "relative h-8 w-8 rounded-full p-0 transition-all duration-300",
                    status
                        ? "text-primary-foreground shadow-sm scale-100"
                        : "bg-muted/50 hover:bg-muted scale-90 opacity-70 hover:opacity-100"
                )}
                style={status && color ? { backgroundColor: color } : status ? { backgroundColor: 'var(--primary)' } : undefined}
                onClick={onClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onLongPress();
                }}
            >
                <div className={cn(
                    "transition-all duration-300",
                    status ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )}>
                    {status && <Check className="h-5 w-5" strokeWidth={3} />}
                </div>

                {hasNote && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-yellow-500 ring-2 ring-background animate-pulse" />
                )}
            </Button>
        </div>
    );
}
