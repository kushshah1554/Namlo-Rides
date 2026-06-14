import { XCircle, X } from "lucide-react";

interface ErrorToastProps {
  error: string;
  onDismiss: () => void;
}

export default function ErrorToast({ error, onDismiss }: ErrorToastProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
      <div className="flex items-center gap-2 rounded-xl border border-red-800 bg-red-950/90 px-4 py-3 text-sm text-red-300 shadow-lg backdrop-blur-sm">
        <XCircle className="h-4 w-4 shrink-0 text-red-400" />
        {error}
        <button
          onClick={onDismiss}
          className="ml-auto text-red-400 hover:text-red-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}