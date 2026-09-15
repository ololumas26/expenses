export default function MovementAmount({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
            <div className="rounded-2xl border border-border/60 p-4">
                <label htmlFor="amount" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-tertiary/60">Valor</label>
                <div className="flex items-center gap-3">
                    <span className="text-3xl text-primary" aria-hidden="true">€</span>
                    <input id="amount" name="amount" aria-label="Valor em euros" type="text" inputMode="decimal" placeholder="0,00" required value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 w-full rounded-lg bg-transparent py-2 text-4xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary/30" />
                </div>
            </div>

    );
}
