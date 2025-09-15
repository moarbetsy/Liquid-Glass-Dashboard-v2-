import { useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export default function Settings() {
  const { exportData, importData, logout, deleteAll, setTab } = useApp()
  const [confirm, setConfirm] = useState<null | 'logout' | 'wipe'>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function onExport() {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'liquid-glass-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    importData(text)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard title="Transactions" onClick={() => setTab('Orders')} />
        <ActionCard title="Activity Log" onClick={() => alert('Coming soon')} />
        <ActionCard title="Reports" onClick={() => setTab('Reports')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass p-4 rounded-xl space-y-3">
          <h3 className="font-medium">Data Management</h3>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={onExport}>Export Data</button>
            <button className="btn-ghost" onClick={() => fileRef.current?.click()}>Import Data</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
          </div>
          <p className="text-muted text-sm">Download or restore full application state as a JSON file.</p>
        </div>

        <div className="glass p-4 rounded-xl border border-red-500/30">
          <h3 className="font-medium text-red-300">Danger Zone</h3>
          <p className="text-sm text-white/70">This will permanently delete all data from this device.</p>
          <button className="btn bg-red-500/20 hover:bg-red-500/30 border-red-500/40 mt-3" onClick={() => setConfirm('wipe')}>Delete All Data</button>
        </div>
      </div>

      <div>
        <button className="btn-ghost" onClick={() => setConfirm('logout')}>Log Out</button>
      </div>

      <ConfirmDialog
        open={confirm === 'logout'}
        title="Log Out"
        message="Are you sure you want to log out?"
        onConfirm={() => { setConfirm(null); logout() }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'wipe'}
        title="Delete All Data"
        message="This will remove all clients, orders, products, and expenses. This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => { setConfirm(null); deleteAll() }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}

function ActionCard({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="glass glass-hover p-4 rounded-xl w-full text-left">
      <div className="text-lg font-medium">{title}</div>
      <div className="text-muted text-sm">Open {title}</div>
    </button>
  )
}

