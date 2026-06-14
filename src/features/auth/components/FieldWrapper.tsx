interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FieldWrapper({
  label,
  error,
  children,
}: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-zinc-300 text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}