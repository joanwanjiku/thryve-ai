import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDateTime, formatShortDate, formatValue } from '../format'
import type { MetricType, ProgressMetric } from '../types'

// brand-600; validated (lightness, chroma, contrast) against the white surface.
const LINE_COLOR = '#059669'
const GRID_COLOR = '#e5e7eb'
const AXIS_TEXT = '#6b7280'

interface ProgressChartProps {
  type: MetricType
  entries: ProgressMetric[]
}

export function ProgressChart({ type, entries }: ProgressChartProps) {
  const data = [...entries]
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))
    .map((e) => ({ t: e.recordedAt, value: Number(e.value) }))

  return (
    <div className="h-72 w-full" role="img" aria-label={`Line chart of ${type.toLowerCase()} over time`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeWidth={1} vertical={false} />
          <XAxis
            dataKey="t"
            tickFormatter={formatShortDate}
            tick={{ fill: AXIS_TEXT, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: GRID_COLOR }}
            minTickGap={24}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: AXIS_TEXT, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: AXIS_TEXT, strokeWidth: 1 }}
            labelFormatter={(t) => formatDateTime(String(t))}
            formatter={(v) => [formatValue(type, Number(v)), null]}
            contentStyle={{ borderRadius: 8, borderColor: GRID_COLOR, color: '#111827' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={LINE_COLOR}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{ r: 4, fill: LINE_COLOR, stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: LINE_COLOR, stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
