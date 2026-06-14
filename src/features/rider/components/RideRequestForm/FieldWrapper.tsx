import { Label } from "@/components/ui/label";

interface FieldWrapperProps {
  label: string;
  error?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export default function FieldWrapper({
  label,
  error,
  icon: Icon,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-amber-400" />
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}