import Providers from "@/components/Providers"
import AppShell from "@/components/AppShell"

export default function DashboardRootLayout({ children }: LayoutProps<"/">){

    return (
        <Providers>
            <AppShell>
                {children}
            </AppShell>
        </Providers>
    )

}
