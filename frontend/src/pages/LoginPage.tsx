import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ mbId: 'PRD', loginId: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(form)
      navigate(params.get('redirect') || '/home')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-box" onSubmit={onSubmit}>
        <h1>testReact</h1>
        <label>
          회사코드 <input value={form.mbId} onChange={(e) => setForm({ ...form, mbId: e.target.value })} autoComplete="organization" />
        </label>
        <label>
          아이디 <input value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} autoComplete="username" />
        </label>
        <label>
          비밀번호{' '}
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn primary" type="submit" disabled={busy}>
          로그인
        </button>
      </form>
    </div>
  )
}
