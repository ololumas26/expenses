"use client";

import { useState, type FormEvent } from "react";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 6;

export default function SecurityForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    function validate(): string {
        if (password.length < MIN_PASSWORD_LENGTH) return `A password deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
        if (confirmPassword !== password) return "As passwords não coincidem";
        return "";
    }

    async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationError = validate();

        if (validationError) {
            setError(validationError);
            setSuccess(false);
            return;
        }

        setError("");
        setSuccess(false);
        setSubmitting(true);

        const { error: updateError } = await supabase.auth.updateUser({ password });

        setSubmitting(false);

        if (updateError) {
            setError("Não foi possível alterar a password");
            return;
        }

        setPassword("");
        setConfirmPassword("");
        setSuccess(true);
    }

    return (
        <div className="max-w-md">
            <h2 className="text-sm font-semibold text-tertiary">Alterar password</h2>
            <p className="mt-1 mb-5 text-sm text-tertiary/60">Escolhe uma password nova para a tua conta.</p>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-neutral px-3.5 py-1 focus-within:border-primary">
                    <Lock size={18} className="shrink-0 text-tertiary/40" aria-hidden="true" />
                    <label htmlFor="password" className="sr-only">Nova password</label>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nova password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm text-tertiary outline-none placeholder:text-tertiary/40"
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Ocultar password" : "Mostrar password"}>
                        {showPassword ? <EyeOff size={18} className="text-tertiary/40" /> : <Eye size={18} className="text-tertiary/40" />}
                    </button>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-neutral px-3.5 py-1 focus-within:border-primary">
                    <Lock size={18} className="shrink-0 text-tertiary/40" aria-hidden="true" />
                    <label htmlFor="confirmPassword" className="sr-only">Confirmar nova password</label>
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar nova password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm text-tertiary outline-none placeholder:text-tertiary/40"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} aria-label={showConfirmPassword ? "Ocultar password" : "Mostrar password"}>
                        {showConfirmPassword ? <EyeOff size={18} className="text-tertiary/40" /> : <Eye size={18} className="text-tertiary/40" />}
                    </button>
                </div>

                {!!error && <p role="alert" className="text-sm text-danger">{error}</p>}
                {success && (
                    <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        <Check size={16} aria-hidden="true" /> Password alterada com sucesso
                    </p>
                )}

                <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                    {submitting ? "A alterar..." : "Alterar password"}
                </button>
            </form>
        </div>
    );
}
