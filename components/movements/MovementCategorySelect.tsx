import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { Category, MovementType } from "@/types/movement";
import CategoryIcon from "./CategoryIcon";

export default function MovementCategorySelect({ categories, type, value, onChange }: {
    categories: Category[];
    type: MovementType;
    value?: string;
    onChange: (categoryId: string) => void;
}) {
    const options = categories.filter((category) => category.type === type);
    const selected = options.find((category) => category.id === value);
    const dropdown = useRef<HTMLDetailsElement>(null);
    const trigger = useRef<HTMLElement>(null);

    return (
        <div>
            <span id="category-label" className="mb-2 block text-sm font-semibold">Categoria</span>
            <details ref={dropdown} className="group relative" onKeyDown={(event) => {
                if (event.key === "Escape" && dropdown.current) {
                    dropdown.current.open = false;
                    trigger.current?.focus();
                }
            }}>
                <summary ref={trigger} aria-labelledby="category-label category-value" className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-border bg-neutral px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20 [&::-webkit-details-marker]:hidden">
                    {selected && <CategoryIcon slug={selected.slug} />}
                    <span id="category-value" className="flex-1">{selected ? selected.name : "Seleciona uma categoria"}</span>
                    <ChevronDown size={18} aria-hidden="true" className="group-open:rotate-180" />
                </summary>
                <fieldset className="absolute left-0 right-0 z-10 mt-2 max-h-64 overflow-y-auto rounded-xl border border-border bg-neutral p-2 shadow-lg">
                    <legend className="sr-only">Categorias de {type === "income" ? "entrada" : "saída"}</legend>
                    {options.map((category) => (
                        <label key={category.id} className="relative flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm hover:bg-primary/10 has-checked:bg-primary/10 has-focus-visible:ring-2 has-focus-visible:ring-primary">
                            <input type="radio" name="category_id" value={category.id} required checked={value === category.id} onInvalid={() => {
                                if (dropdown.current) dropdown.current.open = true;
                            }} onChange={() => {
                                onChange(category.id);
                                if (dropdown.current) dropdown.current.open = false;
                                trigger.current?.focus();
                            }} className="sr-only" />
                            <span className="shrink-0 text-primary"><CategoryIcon slug={category.slug} /></span>
                            <span className="flex-1">{category.name}</span>
                        </label>
                    ))}
                    {options.length === 0 && <p className="p-3 text-sm text-tertiary/60">Não existem categorias para este tipo de movimento.</p>}
                </fieldset>
            </details>
        </div>
    );
}
