import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface HeaderProps {
    title: string;
    onSettingsClick?: () => void;
}

export function Header({ title, onSettingsClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <Button variant="ghost" size="icon" onClick={onSettingsClick}>
                <Settings className="h-5 w-5" />
            </Button>
        </header>
    );
}
