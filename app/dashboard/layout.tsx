import Providers from "@/components/Providers"
import AppShell from "@/components/AppShell"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardRootLayout({ children }: LayoutProps<"/">){
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) redirect("/")

    return (
        <Providers>
            <AppShell>
                {children}
            </AppShell>
        </Providers>
    )

}
