"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Check, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import AuthField from "@/components/auth/AuthField";

const MIN_PASSWORD_LENGTH = 6;

type LinkState = "checking" | "valid" | "invalid";

async function establishRecoverySession(): Promise<boolean> {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        return !error;
    }

    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        return !error;
    }

    // Já pode existir uma sessão de recuperação ativa (o cliente Supabase
    // trata automaticamente o redirect quando detectSessionInUrl está ativo).
    const { data } = await supabase.auth.getSession();
    return !!data.session;
}

export default function ResetPassword() {
    const router = useRouter();

    const [linkState, setLinkState] = useState<LinkState>("checking");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        establishRecoverySession().then((ok) => {
            if (isMounted) setLinkState(ok ? "valid" : "invalid");
        });
        return () => { isMounted = false; };
    }, []);

    function validate(): string {
        if (password.length < MIN_PASSWORD_LENGTH) return `A password deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
        if (confirmPassword !== password) return "As passwords não coincidem";
        return "";
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setSubmitting(true);

        const { error: updateError } = await supabase.auth.updateUser({ password });

        setSubmitting(false);

        if (updateError) {
            setError("Não foi possível definir a nova password");
            return;
        }

        setSuccess(true);
        await supabase.auth.signOut();
    }

    if (linkState === "checking") {
        return <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12"><p className="text-sm text-tertiary/60">A validar o link...</p></div>;
    }

    if (linkState === "invalid") {
        return (
            <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12">
                <div className="flex w-full max-w-sm flex-col items-center text-center">
                    <span className="mb-4 rounded-full bg-danger/15 p-4 text-danger"><ShieldAlert size={28} aria-hidden="true" /></span>
                    <h1 className="text-lg font-bold text-tertiary">Link inválido ou expirado</h1>
                    <p className="mt-1.5 text-sm text-gray-500">Pede um novo link de recuperação de password.</p>
                    <button type="button" onClick={() => router.replace("/recuperar-password")} className="mt-6 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90">Pedir novo link</button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12">
                <div className="flex w-full max-w-sm flex-col items-center text-center">
                    <span className="mb-4 rounded-full bg-primary/15 p-4 text-primary"><Check size={28} aria-hidden="true" /></span>
                    <h1 className="text-lg font-bold text-tertiary">Password alterada</h1>
                    <p className="mt-1.5 text-sm text-gray-500">Já podes entrar com a tua nova password.</p>
                    <button type="button" onClick={() => router.replace("/login")} className="mt-6 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90">Ir para o login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
            <div className="w-full max-w-sm">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-tertiary">Define a tua nova password</h1>
                    <p className="mt-1.5 text-sm text-gray-500">Escolhe uma password nova para a tua conta.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3.5">
                    <AuthField
                        icon={Lock}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nova password"
                        value={password}
                        onChange={setPassword}
                        autoComplete="new-password"
                        rightElement={
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Ocultar password" : "Mostrar password"}>
                                {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                            </button>
                        }
                    />
                    <AuthField
                        icon={Lock}
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar nova password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        autoComplete="new-password"
                        rightElement={
                            <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} aria-label={showConfirmPassword ? "Ocultar password" : "Mostrar password"}>
                                {showConfirmPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                            </button>
                        }
                    />

                    {!!error && <p className="text-xs text-danger" role="alert">{error}</p>}

                    <button type="submit" disabled={submitting} className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                        {submitting ? "A guardar..." : "Guardar nova password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
