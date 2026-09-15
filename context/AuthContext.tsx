"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

type AuthResult = {
    success: boolean;
    error?: string;
    needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthResult>;
    signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
    signOut: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function translateAuthError(message: string) {
    if (message.includes("Invalid login credentials")) return "Email ou palavra-passe incorretos";
    if (message.includes("User already registered")) return "Já existe uma conta com este email";
    if (message.includes("Password should be at least")) return "A palavra-passe é demasiado curta";
    if (message.includes("For security purposes")) return "Aguarda um pouco antes de tentar novamente";
    return "Algo correu mal. Tenta novamente.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => subscription.subscription.unsubscribe();
    }, []);

    async function signIn(email: string, password: string): Promise<AuthResult> {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: translateAuthError(error.message) };
        return { success: true };
    }

    async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
        });
        if (error) return { success: false, error: translateAuthError(error.message) };
        return { success: true, needsEmailConfirmation: !data.session };
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    async function sendPasswordReset(email: string): Promise<AuthResult> {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/nova-password`,
        });
        if (error) return { success: false, error: translateAuthError(error.message) };
        return { success: true };
    }

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signIn, signUp, signOut, sendPasswordReset }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    return context;
}
