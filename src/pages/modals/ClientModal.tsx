import { useEffect, useState } from 'react'
import { Modal } from '@/components/Modal.tsx'
import { useApp } from '@/context/AppContext'
import type { Client } from '@/types'

export function ClientModal({ open, onClose, client }: { open: boolean; onClose: () => void; client?: Client }) {
  const { upsertClient } = useApp()
  const [name, setName] = useState('')

  useEffect(() => { setName(client?.name || '') }, [client])

  function save() {
    upsertClient({ id: client?.id, name })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={client?.id ? 'Edit Client' : 'New Client'}>
      <div className="space-y-3">
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </div>
      </div>
    </Modal>
  )
}
