'use client'

import { usePathname } from 'next/navigation'
import { menuOptions } from '@/data/app'
import MenuButton from './ui/MenuButton'

export default function AppMenu() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center p-4 md:hidden">
      <div className="flex items-center justify-around w-full max-w-md p-2 bg-neutral/80 backdrop-blur-md border border-border/80 rounded-full shadow-lg shadow-tertiary/5">
        {menuOptions.length > 0 &&
          menuOptions.map((option) => {
            const isActive = pathname === option.href || (option.href !== "/dashboard" && pathname?.startsWith(option.href.split("?")[0]))

            return (
              <MenuButton
                key={option.label}
                href={option.href}
                label={option.label}
                icon={option.icon}
                isActive={isActive}
                isAction={option.label === "Novo"}
              />
            );
          })}
      </div>
    </nav>
  )
}
