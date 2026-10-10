// Gráfico de série temporal no padrão FSS (Recharts).
// Período atual em vermelho da marca; período de comparação em azul-acinzentado
// tracejado. Área com gradiente para volume, linha para taxa (%), barra para contagem.
//
// Uso:
//   <MetricChart
//     title="Evolução"
//     rows={[{ data: '2026-10-01', views: 120, ctr: 5.2 }, ...]}
//     metrics={{
//       views: { label: 'Views', kind: 'area' },
//       ctr:   { label: 'CTR', kind: 'line', unit: '%', percentAxis: true },
//     }}
//     compareRows={periodoAnterior}   // opcional, alinhado por índice
//   />

import { useState } from 'react'
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { PillToggle, fmtKM } from './ui'

export const CHART = {
  primary: '#E11A38',   // série atual
  compare: '#5A6485',   // período anterior
  success: '#1E9E5A',   // barras de "ganho" (inscritos, leads)
  grid: '#E5E5E5',
  tick: '#716E74',
  /** Paleta categórica (origens, dispositivos, fatias). Nesta ordem. */
  categorical: ['#285193', '#E11A38', '#1E9E5A', '#E5A100', '#7B2D8B', '#0097A7', '#5A6485'],
}

export interface MetricDef {
  label: string
  kind: 'area' | 'line' | 'bar'
  unit?: '%' | 'h'
  percentAxis?: boolean
}

type Row = { data: string } & Record<string, number | null | string>

function formatValue(def: MetricDef, v: number | null): string {
  if (v == null) return '—'
  if (def.unit === '%') return `${v.toFixed(1)}%`
  if (def.unit === 'h') return `${v.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h`
  return fmtKM(v)
}

const tooltipStyle = {
  contentStyle: { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 12 },
  labelStyle: { color: 'var(--text-dim)' },
}
const axisTick = { fill: CHART.tick, fontSize: 10 }

export default function MetricChart({
  rows, compareRows, metrics, initial, title, height = 260,
}: {
  rows: Row[]
  compareRows?: Row[] | null
  metrics: Record<string, MetricDef>
  initial?: string
  title?: string
  height?: number
}) {
  const keys = Object.keys(metrics)
  const [metric, setMetric] = useState(initial && keys.includes(initial) ? initial : keys[0])
  const def = metrics[metric]
  const hasCompare = Boolean(compareRows?.length)

  const data = rows.map((r, i) => ({
    data: r.data.slice(5), // MM-DD
    atual: r[metric] as number | null,
    anterior: hasCompare ? ((compareRows![i]?.[metric] as number | null) ?? null) : null,
  }))

  const tooltip = <Tooltip {...tooltipStyle} formatter={v => [formatValue(def, v as number | null), def.label]} />
  const grid = <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
  const xAxis = <XAxis dataKey="data" tick={axisTick} />
  const yAxis = def.percentAxis
    ? <YAxis tick={axisTick} domain={[0, 100]} unit="%" />
    : <YAxis tick={axisTick} tickFormatter={(v: number) => fmtKM(v)} />

  function chart() {
    if (def.kind === 'bar') {
      return (
        <BarChart data={data}>
          {grid}{xAxis}{yAxis}{tooltip}
          {hasCompare && <Bar dataKey="anterior" fill={CHART.compare} fillOpacity={0.5} radius={[2, 2, 0, 0]} />}
          <Bar dataKey="atual" fill={CHART.success} radius={[2, 2, 0, 0]} />
        </BarChart>
      )
    }
    if (def.kind === 'line') {
      return (
        <LineChart data={data}>
          {grid}{xAxis}{yAxis}{tooltip}
          {hasCompare && <Line type="monotone" dataKey="anterior" stroke={CHART.compare} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
          <Line type="monotone" dataKey="atual" stroke={CHART.primary} strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      )
    }
    return (
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART.primary} stopOpacity={0.25} />
            <stop offset="95%" stopColor={CHART.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}{xAxis}{yAxis}{tooltip}
        {hasCompare && <Area type="monotone" dataKey="anterior" stroke={CHART.compare} strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} />}
        <Area type="monotone" dataKey="atual" stroke={CHART.primary} fill={`url(#grad-${metric})`} strokeWidth={2} dot={false} />
      </AreaChart>
    )
  }

  return (
    <div className="fss-card" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        {title ? <div className="fss-label">{title}</div> : <div />}
        {keys.length > 1 && (
          <PillToggle
            options={keys.map(k => ({ value: k, label: metrics[k].label }))}
            value={metric}
            onChange={setMetric}
          />
        )}
      </div>
      {data.length === 0 ? (
        <div style={{ color: 'var(--text-dim)', fontSize: 13, padding: '32px 0', textAlign: 'center' }}>
          Sem dado no período.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>{chart()}</ResponsiveContainer>
      )}
    </div>
  )
}
