import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function Login() {
  const { login } = useApp()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(u, p)
    if (!ok) setErr('Invalid credentials')
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Liquid Glass Dashboard</h1>
        <p className="text-white/70">Please sign in with Admin/Admin000</p>
        {err && <div className="badge border-red-400 text-red-300 bg-red-500/10">{err}</div>}
        <div>
          <label className="label">Username</label>
          <input className="input" value={u} onChange={(e) => setU(e.target.value)} placeholder="Admin" />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Admin000" />
        </div>
        <button className="btn-primary w-full py-2.5 rounded-lg">Sign In</button>
      </form>
    </div>
  )
}

