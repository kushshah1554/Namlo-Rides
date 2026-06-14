import { Minus, ChevronUp } from "lucide-react";

interface MinimizeButtonProps {
  isMinimized: boolean;
  onToggle: () => void;
}

export default function MinimizeButton({
  isMinimized,
  onToggle,
}: MinimizeButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${!isMinimized &&  "absolute right-4 top-5 -translate-y-1/2"} flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors`}
      aria-label={isMinimized ? "Expand requests" : "Minimize requests"}
    >
      {isMinimized ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <Minus className="h-4 w-4" />
      )}
    </button>
  );
}