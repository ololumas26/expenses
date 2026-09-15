import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { MovementType } from "@/types/movement";

const options = [
    { value: "income", label: "Entrada", Icon: ArrowDownLeft },
    { value: "outcome", label: "Saída", Icon: ArrowUpRight },
] as const;

export default function MovementTypeSelector({ value, onChange }: {
    value: MovementType;
    onChange: (value: MovementType) => void;
}) {
    return (
        <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-tertiary/60">Tipo de movimento</legend>
            <div className="grid grid-cols-2 gap-3">
                {options.map(({ value: option, label, Icon }) => (
                    <label key={option} className="cursor-pointer">
                        <input type="radio" name="type" value={option} checked={value === option} onChange={() => onChange(option)} className="peer sr-only" required />
                        <span className="flex items-center justify-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                            <Icon size={20} aria-hidden="true" />{label}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
