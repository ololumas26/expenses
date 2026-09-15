export default function AmountInput({ value, onChange, color = "text-primary", placeholder = "0,00", id = "amount-input", label = "Valor" }: {
    value: string;
    onChange: (value: string) => void;
    color?: string;
    placeholder?: string;
    id?: string;
    label?: string;
}) {
    return (
        <div className="flex flex-col items-center gap-1">
            <label htmlFor={id} className="sr-only">{label}</label>
            <span className="text-xs text-tertiary/50">€</span>
            <input
                id={id}
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`w-40 min-w-0 bg-transparent text-center text-4xl font-bold outline-none ${color}`}
            />
        </div>
    );
}
