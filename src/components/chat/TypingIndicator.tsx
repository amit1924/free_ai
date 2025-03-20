import React from "react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  isTyping?: boolean;
  className?: string;
}

const TypingIndicator = ({
  isTyping = true,
  className,
}: TypingIndicatorProps) => {
  if (!isTyping) return null;

  return (
    <div className={cn("flex items-center h-8 bg-background", className)}>
      <div className="flex space-x-1 px-4 py-2 rounded-full bg-muted">
        <div
          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
