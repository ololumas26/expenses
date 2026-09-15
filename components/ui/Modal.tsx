"use client";

import { useEffect, type ReactNode } from "react";

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
    useEffect(() => {
        if (!open) return;
        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-label={title}>
            <div className="absolute inset-0 bg-tertiary/40" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-t-3xl bg-neutral p-5 shadow-lg md:max-w-sm md:rounded-3xl">
                <h2 className="mb-4 text-center text-base font-semibold text-tertiary">{title}</h2>
                <div className="flex flex-col gap-4">{children}</div>
            </div>
        </div>
    );
}
