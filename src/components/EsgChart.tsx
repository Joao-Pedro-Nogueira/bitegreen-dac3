// ============================================================
// ByteGreen — Gráfico Multi-Eixo ESG Diário (Recharts)
// ============================================================

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Activity } from 'lucide-react';
import type { EsgDiario } from '../types';

interface EsgChartProps {
  data: EsgDiario[];
}

function formatDateBR(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-lg">
      <p className="mb-2 text-xs font-semibold text-slate-300">{label}</p>
      {payload.map((entry: { color: string; name: string; value: number }, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </p>
      ))}
    </div>
  );
}

export default function EsgChart({ data }: EsgChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    data_label: formatDateBR(d.data_registro),
  }));

  return (
    <div
      id="esg-chart"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <Activity className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Histórico ESG Diário
          </h2>
          <p className="text-xs text-slate-400">
            Séries temporais de energia e emissão de CO₂
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">
          Nenhum dado disponível para exibição.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="data_label"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#40916C', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'kWh',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#40916C', fontSize: 12 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#E53E3E', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'kg CO₂',
                angle: 90,
                position: 'insideRight',
                style: { fill: '#E53E3E', fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
              iconType="circle"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="energia_kwh"
              name="Energia (kWh)"
              stroke="#40916C"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#40916C' }}
              activeDot={{ r: 6, stroke: '#40916C', strokeWidth: 2, fill: '#0f172a' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="co2_emitido_kg"
              name="CO₂ Emitido (kg)"
              stroke="#E53E3E"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#E53E3E' }}
              activeDot={{ r: 6, stroke: '#E53E3E', strokeWidth: 2, fill: '#0f172a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
