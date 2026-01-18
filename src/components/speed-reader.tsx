"use client";

import { useState, useEffect, useMemo } from "react";
import type { FC } from "react";
import { Pause, Play, X, BookText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import WordDisplay from "./word-display";
import TextNavigator from "./text-navigator";

type SpeedReaderProps = {
  text: string;
  onExit: () => void;
};

const SpeedReader: FC<SpeedReaderProps> = ({ text, onExit }) => {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const [wpm, setWpm] = useState(300);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const interval = (60 / wpm) * 1000;

  useEffect(() => {
    if (isPlaying && currentIndex < words.length && !isNavigating) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, currentIndex, words.length, interval, isNavigating]);

  useEffect(() => {
    if (currentIndex >= words.length) {
      setIsPlaying(false);
    }
  }, [currentIndex, words.length]);


  const togglePlay = () => {
    if (currentIndex >= words.length - 1) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setWpm(value[0]);
  };

  const handleToggleNavigation = () => {
    setIsNavigating(true);
    setIsPlaying(false);
  }

  const handleCloseNavigator = () => {
    setIsNavigating(false);
  }

  const handleSelectWord = (index: number) => {
    setCurrentIndex(index);
    setIsNavigating(false);
    setIsPlaying(true);
  };

  return (
    <>
      {isNavigating && (
        <TextNavigator
          words={words}
          currentIndex={currentIndex}
          onSelectWord={handleSelectWord}
          onClose={handleCloseNavigator}
        />
      )}
      <div className="flex flex-col h-screen w-full p-4 sm:p-6 md:p-8">
        <header className="flex justify-between items-center w-full">
          <h1 className="text-xl font-bold text-foreground tracking-tight">SwiftRead</h1>
          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit Reader">
            <X className="h-6 w-6" />
          </Button>
        </header>

        <main className="flex-grow flex items-center justify-center">
          <WordDisplay
            word={words[currentIndex] || "Done!"}
            key={currentIndex}
          />
        </main>

        <footer className="w-full max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground w-20 text-right tabular-nums">
              {wpm} WPM
            </span>
            <Slider
              min={100}
              max={1200}
              step={10}
              value={[wpm]}
              onValueChange={handleSliderChange}
              className="w-full"
              aria-label="Words per minute"
            />
          </div>
          <div className="flex items-center justify-center space-x-4 h-20 relative">
            <Button variant="ghost" size="lg" onClick={togglePlay} className="w-20 h-20 rounded-full">
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleToggleNavigation} className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full w-12 h-12" aria-label="Navigate text">
              <BookText className="h-6 w-6" />
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground tabular-nums pb-12">
            <p>Word {Math.min(currentIndex + 1, words.length)} of {words.length}</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SpeedReader;
