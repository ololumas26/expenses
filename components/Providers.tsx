"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { TotalsProvider } from "@/context/TotalsContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <TotalsProvider>{children}</TotalsProvider>
        </AuthProvider>
    );
}
