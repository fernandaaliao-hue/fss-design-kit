// Moldura do app: sidebar escura + painel claro arredondado + topbar.
// Extraída do fss-youtube (main.tsx). Requer react-router-dom e lucide-react.
//
// Uso:
//   <BrowserRouter>
//     <AppShell
//       brand={{ name: 'Full Sales System', subtitle: user.email, icon: fssIcon }}
//       nav={[{ to: '/', label: 'Visão Geral', icon: LayoutDashboard, exact: true }]}
//       navBottom={[{ to: '/settings', label: 'Configurações', icon: Settings }]}
//       breadcrumb={['FSS', 'Meu Produto']}
//       topbarRight={<StatusDot label="Sync OK" />}
//       onLogout={logout}
//     >
//       <Routes>...</Routes>
//     </AppShell>
//   </BrowserRouter>

import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Circle, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

interface AppShellProps {
  brand: { name: string; subtitle?: string; icon?: string }
  nav: NavItem[]
  navBottom?: NavItem[]
  breadcrumb?: string[]
  topbarRight?: React.ReactNode
  onLogout?: () => void
  children: React.ReactNode
}

function NavItems({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <>
      {items.map(item => {
        const Icon = item.icon
        const active = item.exact
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to)
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`fss-nav-item ${active ? 'active' : ''}`}
          >
            <Icon size={15} strokeWidth={1.8} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </>
  )
}

/** Bolinha verde + rótulo — o "Sync OK" do canto da topbar. */
export function StatusDot({ label, color = 'var(--status-success)' }: { label: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Circle size={7} fill={color} color={color} />
      <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

export default function AppShell({
  brand, nav, navBottom = [], breadcrumb = [], topbarRight, onLogout, children,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const location = useLocation()

  // Fecha a gaveta (mobile) ao trocar de rota.
  React.useEffect(() => { setMenuOpen(false) }, [location.pathname])
  const close = () => setMenuOpen(false)

  return (
    <div className="fss-layout">
      <aside className={`fss-sidebar ${menuOpen ? 'open' : ''}`}>
        <button type="button" className="fss-sidebar-close" onClick={close} aria-label="Fechar menu">
          <X size={20} strokeWidth={1.8} />
        </button>

        {/* Workspace: logo (com bolinha de status) + nome + subtítulo */}
        <div style={{ padding: '14px 11px 20px' }}>
          {brand.icon && (
            <div style={{ position: 'relative', width: 30, height: 30, marginBottom: 14 }}>
              <div style={{
                width: 30, height: 30, background: 'var(--shell-surface)', borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={brand.icon} alt={brand.name} style={{ width: 20, height: 20, objectFit: 'contain' }} />
              </div>
              <span style={{
                position: 'absolute', left: 23, bottom: -2, width: 7, height: 7, borderRadius: '50%',
                background: 'var(--status-success)', border: '2px solid var(--shell-bg)',
                boxSizing: 'content-box',
              }} />
            </div>
          )}
          <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>{brand.name}</div>
          {brand.subtitle && (
            <div
              title={brand.subtitle}
              style={{
                fontSize: 10, color: 'var(--shell-text-dim)', marginTop: 5,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {brand.subtitle}
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          <NavItems items={nav} onNavigate={close} />
        </nav>

        <nav>
          <NavItems items={navBottom} onNavigate={close} />
          {onLogout && (
            <button
              type="button"
              className="fss-nav-item"
              onClick={onLogout}
              style={{ background: 'none', border: 'none', width: '100%', font: 'inherit', textAlign: 'left' }}
            >
              <LogOut size={15} strokeWidth={1.8} />
              <span>Sair</span>
            </button>
          )}
        </nav>
      </aside>

      {menuOpen && <div className="fss-sidebar-backdrop" onClick={close} aria-hidden="true" />}

      <div className="fss-main-area">
        <header className="fss-topbar">
          <button type="button" className="fss-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
            <Menu size={20} strokeWidth={1.8} />
          </button>
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <span style={{ color: 'var(--border)', fontSize: 12 }}>›</span>}
              <span
                style={i === 0
                  ? { fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 600 }
                  : { fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {topbarRight}
          </div>
        </header>

        {/* Suspense DENTRO do <main>: sidebar e topbar continuam desenhadas
            enquanto uma tela lazy carrega, em vez de piscar o app inteiro. */}
        <main className="fss-content">
          <React.Suspense fallback={<Carregando />}>{children}</React.Suspense>
        </main>
      </div>
    </div>
  )
}

function Carregando() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-dim)', fontSize: 13,
    }}>
      Carregando…
    </div>
  )
}
