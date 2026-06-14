
import { Minus, ChevronUp } from "lucide-react";

interface MinimizeButtonProps {
  isMinimized: boolean;
  onToggle: () => void;
  ariaLabel?: string;
  style?: string;
}

export default function MinimizeButton({
  isMinimized,
  onToggle,
  ariaLabel,
  style=""
}: MinimizeButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${!isMinimized &&  style} flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors`}
      aria-label={ariaLabel ?? (isMinimized ? "Expand" : "Minimize")}
    >
      {isMinimized ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <Minus className="h-4 w-4" />
      )}
    </button>
  );
}