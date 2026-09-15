"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";

const inputClassName = "w-full rounded-xl border border-border bg-neutral px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function EditProfileForm() {
    const { user } = useAuth();

    const [name, setName] = useState((user?.user_metadata?.name as string | undefined) ?? "");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim() || name.trim().length < 2) {
            setError("Indica o teu nome completo");
            setSuccess(false);
            return;
        }

        setError("");
        setSuccess(false);
        setSubmitting(true);

        const { error: updateError } = await supabase.auth.updateUser({ data: { name: name.trim() } });

        setSubmitting(false);

        if (updateError) {
            setError("Não foi possível guardar as alterações");
            return;
        }

        setSuccess(true);
    }

    return (
        <form onSubmit={handleSave} className="max-w-md space-y-4">
            <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">Nome completo</label>
                <input id="name" name="name" autoComplete="name" placeholder="Nome completo" value={name} onChange={(event) => setName(event.target.value)} className={inputClassName} />
            </div>

            <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label>
                <input id="email" value={user?.email ?? ""} disabled className={`${inputClassName} cursor-not-allowed opacity-60`} />
                <p className="mt-1.5 text-xs text-tertiary/60">O email não pode ser alterado por aqui.</p>
            </div>

            {!!error && <p role="alert" className="text-sm text-danger">{error}</p>}
            {success && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    <Check size={16} aria-hidden="true" /> Alterações guardadas
                </p>
            )}

            <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                {submitting ? "A guardar..." : "Guardar alterações"}
            </button>
        </form>
    );
}
