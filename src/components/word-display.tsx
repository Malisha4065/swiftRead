import { useRef, useLayoutEffect, useState } from "react";
import type { FC } from "react";

type WordDisplayProps = {
  word: string;
};

const WordDisplay: FC<WordDisplayProps> = ({ word }) => {
  const [offset, setOffset] = useState(0);
  const preRef = useRef<HTMLSpanElement>(null);
  const focalRef = useRef<HTMLSpanElement>(null);

  if (!word) return null;

  // Heuristic to find the optimal recognition point (ORP) or focal point of a word.
  const getFocalIndex = (w: string) => {
    const len = w.length;
    if (len <= 1) return 0; // a
    if (len <= 4) return 1; // an, the, four
    if (len <= 8) return 2; // seven, eight
    if (len <= 12) return 3; // twelve
    return 4; // anything longer
  };

  const focalIndex = getFocalIndex(word);

  const pre = word.substring(0, focalIndex);
  const focalChar = word.charAt(focalIndex);
  const post = word.substring(focalIndex + 1);

  useLayoutEffect(() => {
    if (preRef.current && focalRef.current) {
      const preWidth = preRef.current.offsetWidth;
      const focalWidth = focalRef.current.offsetWidth;
      setOffset(preWidth + focalWidth / 2);
    }
  }, [word]);


  return (
    <div className="relative h-24 w-full animate-in fade-in duration-150">
      <div
        className="absolute top-1/2 left-1/2 -translate-y-1/2"
        style={{ transform: `translateX(calc(-50% - ${offset}px))` }}
      >
        <p className="text-5xl md:text-7xl font-light tracking-wider whitespace-nowrap invisible my-4">
            <span ref={preRef}>{pre}</span>
            <span ref={focalRef} className="text-primary font-normal">{focalChar}</span>
            <span>{post}</span>
        </p>
      </div>
      <div
        className="absolute top-1/2 left-1/2 -translate-y-1/2"
        style={{ transform: `translateX(-${offset}px)` }}
      >
        <p className="text-5xl md:text-7xl font-light tracking-wider whitespace-nowrap my-4">
          <span>{pre}</span>
          <span className="text-primary font-normal">{focalChar}</span>
          <span>{post}</span>
        </p>
      </div>

      {/* Visual guide for the focal point */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[-3.5rem] w-[2px] h-2 bg-primary/50 rounded-full"></div>
        <div className="absolute top-[3.5rem] w-[2px] h-2 bg-primary/50 rounded-full"></div>
      </div>
    </div>
  );
};

export default WordDisplay;
