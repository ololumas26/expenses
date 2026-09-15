import { Calendar } from "lucide-react";

export function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function formatDateLabel(date: Date) {
    const today = new Date();
    if (formatDateKey(date) === formatDateKey(today)) return "Hoje";
    return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function DatePickerField({ value, onChange, label = "Data", id = "date-field" }: {
    value: Date;
    onChange: (date: Date) => void;
    label?: string;
    id?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-neutral px-3 py-3">
            <label htmlFor={id} className="flex flex-1 items-center gap-3 text-sm">
                <span className="text-tertiary"><Calendar size={18} aria-hidden="true" /></span>
                <span className="flex flex-col">
                    <span className="text-xs text-tertiary/60">{label}</span>
                    <span className="font-medium text-tertiary">{formatDateLabel(value)}</span>
                </span>
            </label>
            <input
                id={id}
                type="date"
                value={formatDateKey(value)}
                onChange={(event) => {
                    if (!event.target.value) return;
                    const [year, month, day] = event.target.value.split("-").map(Number);
                    onChange(new Date(year, month - 1, day));
                }}
                className="w-28 bg-transparent text-right text-sm text-tertiary outline-none"
            />
        </div>
    );
}
