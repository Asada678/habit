import { useRef } from "react";
import { cn } from "@/lib/utils";

interface CalendarControlProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    className?: string;
}

export function CalendarControl({
    currentDate,
    onDateChange,
    className,
}: CalendarControlProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });
    const year = currentDate.getFullYear();

    // Format for input value: YYYY-MM
    const inputValue = `${year}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

    const handleTextClick = () => {
        // Programmatically open the date picker
        const input = inputRef.current;
        if (input) {
            if ("showPicker" in input) {
                // Modern browsers
                (input as any).showPicker();
            } else {
                // Fallback or just focus
                (input as HTMLInputElement).click();
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value; // YYYY-MM
        if (!val) return;
        const [y, m] = val.split("-").map(Number);
        // Create new date (1st of that month)
        const newDate = new Date(y, m - 1, 1);
        onDateChange(newDate);
    };

    return (
        <div
            className={cn(
                "flex h-8 items-center border-b border-border bg-background px-4",
                className,
            )}
        >
            <div className="relative flex items-center gap-2">
                <button
                    onClick={handleTextClick}
                    className="flex items-baseline gap-2 text-sm font-medium hover:opacity-70 focus:outline-none"
                >
                    <span className="font-bold">{monthName}</span>
                    <span className="text-muted-foreground">{year}</span>
                </button>

                {/* Hidden Input for Month Picker */}
                <input
                    ref={inputRef}
                    type="month"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full -z-10"
                    aria-label="Change month"
                    tabIndex={-1}
                />
            </div>
        </div>
    );
}
