"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/ui/GoogleButton";
import { googleSignIn } from "@/app/actions";

function LoginForm() {
    const { session, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && session) router.replace("/dashboard");
    }, [authLoading, session, router]);

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();
        await googleSignIn();
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center">
                    <span className="mb-5 rounded-full bg-primary/15 p-4 text-primary"><Wallet size={26} aria-hidden="true" /></span>
                    <h1 className="text-xl font-bold text-tertiary">Bem-vindo de volta</h1>
                    <p className="mt-1.5 max-w-70 text-sm text-gray-500">Entra para continuares a gerir as tuas finanças</p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 flex flex-col items-center gap-3.5">
                    <GoogleButton type="submit" />
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
