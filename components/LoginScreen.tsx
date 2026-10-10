// Tela de login no padrão FSS: card claro centrado sobre o fundo escuro do shell.
// Só a casca visual — passe sua função de login em `onLogin` (deve lançar Error
// com mensagem amigável em caso de falha).

import React from 'react'

export default function LoginScreen({
  icon, eyebrow = 'Acesso restrito', title, description, onLogin,
}: {
  icon?: string
  eyebrow?: string
  title: string
  description?: string
  onLogin: (email: string, password: string) => Promise<void>
}) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [erro, setErro] = React.useState<string | null>(null)
  const [enviando, setEnviando] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (enviando) return
    setErro(null)
    setEnviando(true)
    try {
      await onLogin(email, password)
    } catch (err: any) {
      setErro(err?.message || 'Não foi possível entrar.')
      setPassword('')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--shell-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div className="fss-card" style={{ width: '100%', maxWidth: 380, padding: '32px 28px' }}>
        {icon && (
          <div style={{
            width: 34, height: 34, background: 'var(--surface-2)', border: '1px solid var(--border-soft)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
          }}>
            <img src={icon} alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
          </div>
        )}

        <div className="fss-eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>
        <h1 className="fss-h1" style={{ marginBottom: 4 }}>{title}</h1>
        {description && <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 24 }}>{description}</p>}

        <form onSubmit={onSubmit}>
          <label className="fss-label" htmlFor="login-email" style={{ display: 'block', marginBottom: 6 }}>E-mail</label>
          <input
            id="login-email" className="fss-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} autoComplete="username" autoFocus required
            style={{ width: '100%', marginBottom: 16 }}
          />
          <label className="fss-label" htmlFor="login-password" style={{ display: 'block', marginBottom: 6 }}>Senha</label>
          <input
            id="login-password" className="fss-input" type="password" value={password}
            onChange={e => setPassword(e.target.value)} autoComplete="current-password" required
            style={{ width: '100%', marginBottom: 18 }}
          />
          {erro && <div className="fss-alert-error" role="alert" style={{ marginBottom: 16 }}>{erro}</div>}
          <button type="submit" className="fss-btn-primary" disabled={enviando} style={{ width: '100%', padding: '10px 14px' }}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
