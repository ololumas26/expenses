import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export default function AuthField({ icon: Icon, id, type = "text", placeholder, value, onChange, autoComplete, rightElement }: {
    icon: LucideIcon;
    id: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    autoComplete?: string;
    rightElement?: ReactNode;
}) {
    return (
        <div className="flex items-center gap-2.5 rounded-2xl border border-gray-300 px-3.5 py-1 focus-within:border-primary">
            <Icon size={18} className="shrink-0 text-gray-400" aria-hidden="true" />
            <label htmlFor={id} className="sr-only">{placeholder}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                autoComplete={autoComplete}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-tertiary outline-none placeholder:text-gray-400"
            />
            {rightElement}
        </div>
    );
}
