"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Wallet } from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AuthField from "@/components/auth/AuthField";

function LoginForm() {
    const { signIn, session, loading: authLoading } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && session) router.replace("/dashboard");
    }, [authLoading, session, router]);

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();

        if (!email.trim() || !password) {
            setError("Indica o email e a password");
            return;
        }

        setError("");
        setSubmitting(true);

        const result = await signIn(email.trim(), password);

        setSubmitting(false);

        if (!result.success) {
            setError(result.error ?? "Não foi possível entrar");
            return;
        }

        router.replace("/dashboard");
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <span className="mb-5 rounded-full bg-primary/15 p-4 text-primary"><Wallet size={26} aria-hidden="true" /></span>
                    <h1 className="text-xl font-bold text-tertiary">Bem-vindo de volta</h1>
                    <p className="mt-1.5 max-w-70 text-sm text-gray-500">Entra para continuares a gerir as tuas finanças</p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-3.5">
                    <AuthField icon={Mail} id="email" type="email" placeholder="Email" value={email} onChange={setEmail} autoComplete="email" />
                    <AuthField
                        icon={Lock}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                        autoComplete="current-password"
                        rightElement={
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Ocultar password" : "Mostrar password"}>
                                {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                            </button>
                        }
                    />

                    <Link href="/recuperar-password" className="self-end text-xs font-semibold text-primary hover:underline">
                        Esqueceste-te da password?
                    </Link>

                    {!!error && <p className="text-xs text-danger" role="alert">{error}</p>}

                    <button type="submit" disabled={submitting} className="mt-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                        {submitting ? "A entrar..." : "Entrar"}
                    </button>

                    <p className="mt-1 text-center text-xs text-gray-500">
                        Ainda não tens conta?{" "}
                        <Link href="/registar" className="font-semibold text-primary hover:underline">Criar conta</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
}
