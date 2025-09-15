import { CirclePlus, Home, ListChecks, Package, UsersRound } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { NavTab } from '@/context/AppContext'

const items: { key: NavTab; label: string; icon: any }[] = [
  { key: 'Dashboard', label: 'Home', icon: Home },
  { key: 'Orders', label: 'Orders', icon: ListChecks },
  { key: 'Clients', label: 'Clients', icon: UsersRound },
  { key: 'Products', label: 'Products', icon: Package },
]

export default function MobileNav({ onFab }: { onFab: () => void }) {
  const { tab, setTab } = useApp()

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-4 z-40 mx-auto flex max-w-lg items-center justify-around gap-2 rounded-2xl glass px-4 py-3">
      {items.map((it) => (
        <button key={it.key} className="relative p-2 text-white/80" onClick={() => setTab(it.key)}>
          <it.icon className="h-6 w-6" />
          {tab === it.key && (
            <span className="absolute -top-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"></span>
          )}
        </button>
      ))}
      <button
        className="btn-primary absolute -top-6 left-1/2 -translate-x-1/2 rounded-full p-4 shadow-glass"
        aria-label="New Order"
        onClick={onFab}
      >
        <CirclePlus className="h-6 w-6" />
      </button>
    </nav>
  )
}
