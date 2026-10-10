// Peças pequenas do design FSS: KPI, cabeçalho de página, modal, alerta,
// toggle de pílulas e formatação de número pt-BR. Sem dependência além de
// React e lucide-react.

import React from 'react'
import { X } from 'lucide-react'

// ── Números ────────────────────────────────────────────────────────────────
/** 1.234 → "1,2K"; 2.500.000 → "2,5M"; null → "—". Padrão pt-BR. */
export function fmtKM(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.', ',') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.', ',') + 'K'
  return n.toLocaleString('pt-BR')
}

export function pctDelta(atual: number | null, anterior: number | null): number | null {
  if (atual == null || anterior == null || anterior === 0) return null
  return ((atual - anterior) / Math.abs(anterior)) * 100
}

// ── Cabeçalho de página ───────────────────────────────────────────────────
/** Eyebrow vermelho + título + descrição, com ações à direita. */
export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="fss-section-header fss-page-header" style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div className="fss-eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <h1 className="fss-h1" style={{ margin: 0 }}>{title}</h1>
        {description && <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '4px 0 0' }}>{description}</p>}
      </div>
      {actions}
    </div>
  )
}

// ── KPI ────────────────────────────────────────────────────────────────────
export function StatCard({
  label, value, delta, valueColor, placeholder,
}: {
  label: string
  value: string
  /** Variação % vs período anterior; null esconde a linha. */
  delta?: number | null
  valueColor?: string
  /** Métrica reservada ("em breve"): card esmaecido. */
  placeholder?: boolean
}) {
  if (placeholder) {
    return (
      <div className="fss-stat-card" style={{ opacity: 0.55 }}>
        <div className="fss-stat-label">{label}</div>
        <div className="fss-stat-value" style={{ color: 'var(--text-dim)' }}>—</div>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', marginTop: 4, display: 'inline-block' }}>
          em breve
        </span>
      </div>
    )
  }
  return (
    <div className="fss-stat-card">
      <div className="fss-stat-label">{label}</div>
      <div className="fss-stat-value" style={{ color: valueColor ?? 'var(--text)' }}>{value}</div>
      {delta != null && (
        <span style={{
          fontSize: 10, fontWeight: 700, marginTop: 4, display: 'inline-block',
          color: delta >= 0 ? 'var(--status-success)' : 'var(--fss-red)',
        }}>
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs período anterior
        </span>
      )}
    </div>
  )
}

/** Grade de KPIs: 6 colunas (ou 5) → 3 no tablet → 2 no celular. */
export function KpiGrid({ cols = 6, children }: { cols?: 5 | 6; children: React.ReactNode }) {
  return <div className={`fss-kpi-grid ${cols === 5 ? 'cols-5' : ''}`} style={{ marginBottom: 20 }}>{children}</div>
}

// ── Toggle de pílulas (troca de métrica, período, aba) ────────────────────
export function PillToggle<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`fss-btn-secondary ${value === o.value ? 'active' : ''}`}
          style={{ fontSize: 10, padding: '4px 9px' }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ── Alerta ─────────────────────────────────────────────────────────────────
export function Alert({ kind, children }: { kind: 'success' | 'warning' | 'error'; children: React.ReactNode }) {
  return <div className={`fss-alert-${kind}`} role={kind === 'error' ? 'alert' : undefined}>{children}</div>
}

// ── Modal ──────────────────────────────────────────────────────────────────
/** Cabeçalho fixo, corpo com scroll próprio, rodapé opcional. Fecha no Esc e no fundo. */
export function Modal({
  title, onClose, footer, maxWidth = 660, children,
}: {
  title: string
  onClose: () => void
  footer?: React.ReactNode
  maxWidth?: number
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 18, zIndex: 60, overflowY: 'auto',
      }}
    >
      <div
        className="fss-card"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth, width: '100%', margin: 'auto', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 36px)' }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Fechar (Esc)"
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', padding: 2 }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto', flex: 1, minHeight: 0 }}>{children}</div>
        {footer && (
          <div style={{
            padding: '14px 20px', borderTop: '1px solid var(--border-soft)',
            display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
