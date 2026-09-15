"use client"

import { useState } from "react";
import Link from "next/link";
import { Mail, MailCheck } from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthField from "@/components/auth/AuthField";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordForm() {
    const { sendPasswordReset } = useAuth();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSend(event: React.FormEvent) {
        event.preventDefault();

        if (!EMAIL_REGEX.test(email.trim())) {
            setError("Indica um email válido");
            return;
        }

        setError("");
        setSubmitting(true);

        const result = await sendPasswordReset(email.trim());

        setSubmitting(false);

        if (!result.success) {
            setError(result.error ?? "Não foi possível enviar o email");
            return;
        }

        setSent(true);
    }

    if (sent) {
        return (
            <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12">
                <div className="flex w-full max-w-sm flex-col items-center text-center">
                    <span className="mb-4 rounded-full bg-primary/15 p-4 text-primary"><MailCheck size={28} aria-hidden="true" /></span>
                    <h1 className="text-lg font-bold text-tertiary">Verifica o teu email</h1>
                    <p className="mt-1.5 text-sm text-gray-500">Enviámos um link para {email.trim()} para definires uma nova password.</p>
                    <Link href="/login" className="mt-6 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-tertiary hover:bg-gray-200">Voltar ao login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <span className="mb-5 rounded-full bg-primary/15 p-4 text-primary"><Mail size={26} aria-hidden="true" /></span>
                    <h1 className="text-xl font-bold text-tertiary">Esqueceste-te da password?</h1>
                    <p className="mt-1.5 max-w-75 text-sm text-gray-500">Indica o teu email e enviamos-te um link para definires uma nova.</p>
                </div>

                <form onSubmit={handleSend} className="mt-8 flex flex-col gap-3.5">
                    <AuthField icon={Mail} id="email" type="email" placeholder="Email" value={email} onChange={setEmail} autoComplete="email" />

                    {!!error && <p className="text-xs text-danger" role="alert">{error}</p>}

                    <button type="submit" disabled={submitting} className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                        {submitting ? "A enviar..." : "Enviar link"}
                    </button>

                    <Link href="/login" className="text-center text-xs font-semibold text-tertiary/60 hover:text-primary">Voltar ao login</Link>
                </form>
            </div>
        </div>
    );
}

export default function ForgotPassword() {
    return (
        <AuthProvider>
            <ForgotPasswordForm />
        </AuthProvider>
    );
}
