"use client";

import { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import CategoryIcon from "@/components/movements/CategoryIcon";
import type { Category } from "@/types/movement";

export default function CategoryPickerField({ categories, value, onChange, label = "Categoria" }: {
    categories: Category[];
    value?: string;
    onChange: (categoryId: string) => void;
    label?: string;
}) {
    const [open, setOpen] = useState(false);
    const selected = categories.find((category) => category.id === value);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-neutral px-3 py-3 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                <span className="flex items-center gap-3">
                    <span className="shrink-0 text-tertiary">{selected ? <CategoryIcon slug={selected.slug} /> : <CategoryIcon slug={null} />}</span>
                    <span className="flex flex-col">
                        <span className="text-xs text-tertiary/60">{label}</span>
                        <span className={selected ? "font-medium text-tertiary" : "text-tertiary/50"}>{selected?.name ?? "Selecionar categoria"}</span>
                    </span>
                </span>
                <ChevronRight size={18} className="text-tertiary/40" aria-hidden="true" />
            </button>

            <Modal open={open} onClose={() => setOpen(false)} title="Selecionar categoria">
                <div className="max-h-64 overflow-y-auto">
                    {categories.length > 0 ? categories.map((category) => {
                        const isSelected = category.id === value;
                        return (
                            <button
                                type="button"
                                key={category.id}
                                onClick={() => { onChange(category.id); setOpen(false); }}
                                className={`flex w-full items-center justify-between gap-3 rounded-lg p-3 text-sm ${isSelected ? "bg-primary/10" : "hover:bg-primary/5"}`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-primary"><CategoryIcon slug={category.slug} /></span>
                                    <span>{category.name}</span>
                                </span>
                                {isSelected && <Check size={18} className="text-primary" aria-hidden="true" />}
                            </button>
                        );
                    }) : <p className="p-3 text-sm text-tertiary/60">Não há categorias disponíveis.</p>}
                </div>
            </Modal>
        </>
    );
}
