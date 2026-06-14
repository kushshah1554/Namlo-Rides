import { Button } from "@/components/ui/button";
import type { Role } from "@/const/enum";
import RoleOption from "./RoleOption";
import { ROLE_OPTIONS } from "../const/roleOptions";

interface RoleSelectFormProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
  onContinue: () => void;
  buttonLabel: string;
}

export default function RoleSelectForm({
  selectedRole,
  onRoleChange,
  onContinue,
  buttonLabel,
}: RoleSelectFormProps) {
  return (
    <div className="space-y-4">
      {ROLE_OPTIONS.map((option) => (
        <RoleOption
          key={option.checkboxId}
          role={option.role}
          label={option.label}
          description={option.description}
          checkboxId={option.checkboxId}
          isSelected={selectedRole === option.role}
          onSelect={onRoleChange}
        />
      ))}

      <Button
        className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold"
        onClick={onContinue}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}