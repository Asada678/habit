"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MotionButton = motion(Button);

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
    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
      <MotionButton
        variant="ghost"
        className={cn(
          "relative h-8 w-8 rounded-full p-0 transition-colors duration-300",
          status
            ? "text-primary-foreground shadow-sm"
            : "bg-muted/50 hover:bg-muted",
        )}
        style={
          status && color
            ? { backgroundColor: color }
            : status
              ? { backgroundColor: "var(--primary)" }
              : undefined
        }
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress();
        }}
        initial={false}
        animate={{
          scale: status ? 1 : 0.9,
          opacity: status ? 1 : 0.7,
        }}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: status ? 1.05 : 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status && (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className="flex items-center justify-center"
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>

        {hasNote && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-yellow-500 ring-2 ring-background animate-pulse" />
        )}
      </MotionButton>
    </div>
  );
}
