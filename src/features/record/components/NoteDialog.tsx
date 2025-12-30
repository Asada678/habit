import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Need to check if textarea is installed or use standard
import { Label } from "@/components/ui/label"; // Or simple label
// shadcn textarea might not be installed. Standard textarea with tailwind classes is fine.



interface NoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialNote?: string;
    onSave: (note: string) => void;
    dateStr: string; // For display title
}

export function NoteDialog({ open, onOpenChange, initialNote = "", onSave, dateStr }: NoteDialogProps) {
    const [note, setNote] = useState(initialNote);

    useEffect(() => {
        if (open) {
            setNote(initialNote || "");
        }
    }, [open, initialNote]);

    const handleSave = () => {
        onSave(note);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Note for {dateStr}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="note" className="mb-2 block">Memo</Label>
                    <Textarea
                        id="note"
                        placeholder="Add a note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
