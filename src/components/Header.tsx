import { Calculator, EyeOff, Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Calculator as CalculatorModal } from './Calculator'

export default function Header() {
  const { search, setSearch, privateMode, setPrivateMode, setTab } = useApp()
  const [calcOpen, setCalcOpen] = useState(false)

  return (
    <header className="glass sticky top-0 z-40 mx-4 mt-4 rounded-xl border border-glass px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
          <input
            className="input pl-10"
            placeholder="Search clients, orders, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-ghost" onClick={() => setCalcOpen(true)}>
          <Calculator className="h-5 w-5" />
          <span className="hidden md:inline">Calculator</span>
        </button>
        <button className={`btn-ghost ${privateMode ? 'border-accent/60' : ''}`} onClick={() => setPrivateMode(!privateMode)}>
          <EyeOff className="h-5 w-5" />
          <span className="hidden md:inline">Private</span>
        </button>
        <button className="btn-ghost group" onClick={() => setTab('Settings')}>
          <Settings className="h-5 w-5 transition-transform group-hover:rotate-180" />
          <span className="hidden md:inline">Settings</span>
        </button>
      </div>
      <CalculatorModal open={calcOpen} onClose={() => setCalcOpen(false)} />
    </header>
  )
}
