import type { ReactNode } from "react";
import AppMenu from "@/components/AppMenu";
import AppSidebar from "@/components/AppSidebar";

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="md:flex md:min-h-screen">
            <AppSidebar />
            <div className="min-h-screen w-full md:pl-64">
                {children}
            </div>
            <AppMenu />
        </div>
    );
}
