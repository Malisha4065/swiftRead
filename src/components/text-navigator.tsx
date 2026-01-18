"use client";

import { useEffect, useRef } from "react";
import type { FC } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type TextNavigatorProps = {
  words: string[];
  currentIndex: number;
  onSelectWord: (index: number) => void;
  onClose: () => void;
};

const TextNavigator: FC<TextNavigatorProps> = ({ words, currentIndex, onSelectWord, onClose }) => {
  const currentWordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Scroll to the current word when the component mounts
    currentWordRef.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }, []); // Only run once on mount

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in duration-150">
      <header className="flex justify-between items-center w-full p-4 sm:p-6 md:p-8 border-b shrink-0">
        <h2 className="text-xl font-bold text-foreground">Navigate Text</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close Navigator">
          <X className="h-6 w-6" />
        </Button>
      </header>
      <ScrollArea className="flex-grow p-4 sm:p-6 md:p-8">
        <p className="text-xl md:text-2xl leading-relaxed text-left">
          {words.map((word, index) => (
            <span
              key={index}
              ref={index === currentIndex ? currentWordRef : null}
              onClick={() => onSelectWord(index)}
              className={cn(
                "cursor-pointer transition-colors hover:bg-primary/20 p-1 rounded-md",
                index === currentIndex ? "bg-primary/30" : "text-foreground/70"
              )}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </ScrollArea>
    </div>
  );
};

export default TextNavigator;
