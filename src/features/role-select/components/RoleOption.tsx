import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Role } from "@/const/enum";

interface RoleOptionProps {
  role: Role;
  label: string;
  description: string;
  checkboxId: string;
  isSelected: boolean;
  onSelect: (role: Role) => void;
}

export default function RoleOption({
  role,
  label,
  description,
  checkboxId,
  isSelected,
  onSelect,
}: RoleOptionProps) {
  return (
    <div
      onClick={() => onSelect(role)}
      className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
        isSelected
          ? "border-amber-500 bg-amber-500/10"
          : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
      }`}
    >
      <Checkbox
        id={checkboxId}
        checked={isSelected}
        onCheckedChange={() => onSelect(role)}
        className="mt-0.5 border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
      />
      <div className="flex flex-col">
        <Label
          htmlFor={checkboxId}
          className="cursor-pointer text-white font-semibold"
        >
          {label}
        </Label>
        <span className="text-sm text-zinc-400">{description}</span>
      </div>
    </div>
  );
}