import Link from 'next/link'
import { MenuButtonType } from '@/types/type'

// Adiciona 'isActive' às props caso ainda não esteja no teu tipo

export default function MenuButton({
  label,
  href,
  isActive,
  icon: Icon,
  isAction
}:MenuButtonType) {
  return (
    <Link
      href={href}
      className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-3 rounded-full transition-all duration-200 select-none ${
        isActive
          ? 'text-primary font-medium'
          : 'text-tertiary/70 hover:text-primary hover:bg-neutral'
      }
      `}
    >
      <span className={`relative flex items-center justify-center
       ${isAction ? 'bg-primary/30 text-primary p-3 rounded-full'
        :''}`}>
        {Icon && (
          <Icon
            className={`w-5 h-5 transition-transform duration-200 ${
              isActive ? 'scale-110' : 'scale-100'
            }`}
          />
        )}
      </span>

      <span className={`text-[11px] mt-1 tracking-tight leading-none ${isAction? 'text-[12px] font-semibold':''}`}>
        {label}
      </span>

      {isActive && (
        <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
      )}
    </Link>
  )
}