
import { MenuButtonType } from '@/types/type'
import MenuButton from "@/components/ui/MenuButton";

interface QuickActionsProps {
  actions: MenuButtonType[]

}

export default function QuickActions({ actions }: QuickActionsProps) {
  if (!actions || actions.length === 0) return null

  return (
    <section className="w-full max-w-md mx-auto my-4 px-3 md:max-w-none md:px-0">
      <h2 className="text-xs font-semibold text-tertiary/60 uppercase tracking-wider mb-2 px-1">
        Ações Rápidas
      </h2>

      <div className="grid grid-cols-4 gap-2 p-2 border border-border/60 rounded-2xl md:max-w-md">
        {actions.map((action) => (
          <MenuButton
            key={action.label}
            label={action.label}
            href={action.href}
            icon={action.icon}
            isAction={true}
          />
        ))}
      </div>
    </section>
  )
}