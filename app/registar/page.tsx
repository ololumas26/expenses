"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Check, Wallet, MailCheck } from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthField from "@/components/auth/AuthField";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function RegisterForm() {
    const { signUp, session, loading: authLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

    useEffect(() => {
        if (!authLoading && session) router.replace("/dashboard");
    }, [authLoading, session, router]);

    function validate(): string {
        if (!name.trim() || name.trim().length < 2) return "Indica o teu nome completo";
        if (!EMAIL_REGEX.test(email.trim())) return "Indica um email válido";
        if (password.length < MIN_PASSWORD_LENGTH) return `A password deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
        if (confirmPassword !== password) return "As passwords não coincidem";
        if (!acceptedTerms) return "Tens de aceitar os Termos e Condições para continuar";
        return "";
    }

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setSubmitting(true);

        const result = await signUp(name.trim(), email.trim(), password);

        setSubmitting(false);

        if (!result.success) {
            setError(result.error ?? "Não foi possível criar a conta");
            return;
        }

        setNeedsEmailConfirmation(!!result.needsEmailConfirmation);
        setSuccess(true);
    }

    if (success) {
        return (
            <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12">
                <div className="flex w-full max-w-sm flex-col items-center text-center">
                    <span className="mb-4 rounded-full bg-primary/15 p-4 text-primary">
                        {needsEmailConfirmation ? <MailCheck size={28} aria-hidden="true" /> : <Check size={28} aria-hidden="true" />}
                    </span>
                    <h1 className="text-lg font-bold text-tertiary">{needsEmailConfirmation ? "Confirma o teu email" : "Conta criada"}</h1>
                    <p className="mt-1.5 text-sm text-gray-500">
                        {needsEmailConfirmation
                            ? `Enviámos um link de confirmação para ${email.trim()}. Confirma para poderes entrar.`
                            : "A tua conta foi criada com sucesso."}
                    </p>
                    <Link href="/login" className="mt-6 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-tertiary hover:bg-gray-200">
                        Ir para o login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <span className="mb-5 rounded-full bg-primary/15 p-4 text-primary"><Wallet size={26} aria-hidden="true" /></span>
                    <h1 className="text-xl font-bold text-tertiary">Criar conta</h1>
                    <p className="mt-1.5 max-w-70 text-sm text-gray-500">Regista-te para começares a gerir as tuas finanças</p>
                </div>

                <form onSubmit={handleRegister} className="mt-8 flex flex-col gap-3.5">
                    <AuthField icon={User} id="name" placeholder="Nome completo" value={name} onChange={setName} autoComplete="name" />
                    <AuthField icon={Mail} id="email" type="email" placeholder="Email" value={email} onChange={setEmail} autoComplete="email" />
                    <AuthField
                        icon={Lock}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
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
                        placeholder="Confirmar password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        autoComplete="new-password"
                        rightElement={
                            <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} aria-label={showConfirmPassword ? "Ocultar password" : "Mostrar password"}>
                                {showConfirmPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                            </button>
                        }
                    />

                    <label className="mt-1 flex items-start gap-2.5 text-xs text-gray-500">
                        <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        Li e aceito os <span className="font-semibold text-tertiary">Termos e Condições</span>
                    </label>

                    {!!error && <p className="text-xs text-danger" role="alert">{error}</p>}

                    <button type="submit" disabled={submitting} className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                        {submitting ? "A criar conta..." : "Criar conta"}
                    </button>

                    <p className="mt-1 text-center text-xs text-gray-500">
                        Já tens conta?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">Entrar</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function Register() {
    return (
        <AuthProvider>
            <RegisterForm />
        </AuthProvider>
    );
}
