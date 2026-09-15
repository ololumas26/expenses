'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Wallet } from 'lucide-react'
import { menuOptions } from '@/data/app'
import { useAuth } from '@/context/AuthContext'
import { getInitials } from '@/utils/name'

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const accountName = (user?.user_metadata?.name as string | undefined)?.trim() || user?.email || "Utilizador"

  async function handleSignOut() {
    await signOut()
    router.replace('/login')
  }

  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-64 md:flex-col md:border-r md:border-border/60 md:bg-neutral md:px-4 md:py-6">
      <div className="flex items-center gap-2 px-2 pb-8">
        <span className="rounded-xl bg-primary/10 p-2 text-primary"><Wallet size={22} aria-hidden="true" /></span>
        <span className="text-lg font-bold text-tertiary">Manage</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {menuOptions.filter((option) => option.label !== "Novo").map((option) => {
          const isActive = pathname === option.href || pathname?.startsWith(option.href.split("?")[0] + "/")
          const Icon = option.icon
          return (
            <Link
              key={option.label}
              href={option.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-tertiary/70 hover:bg-border/40 hover:text-tertiary"}`}
            >
              {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
              {option.label}
            </Link>
          )
        })}

        <Link
          href="/movimentos/novo?type=outcome"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Novo movimento
        </Link>
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-xl border border-border/60 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-background text-xs">
          {getInitials(accountName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-tertiary">{accountName}</p>
        </div>
        <button type="button" onClick={handleSignOut} aria-label="Terminar sessão" className="shrink-0 rounded-lg p-2 text-tertiary/50 hover:bg-danger/10 hover:text-danger">
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
