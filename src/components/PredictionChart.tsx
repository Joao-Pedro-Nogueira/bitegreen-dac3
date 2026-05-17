// ============================================================
// ByteGreen — Prediction Chart (24h Forecast)
// Cloud Energy Forecasting — SARIMAX time series
// ============================================================

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Activity } from 'lucide-react';
import type { PrevisaoEnergia } from '../types';

interface PredictionChartProps {
  data: PrevisaoEnergia[];
}

function formatHourBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateHourBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload as PrevisaoEnergia | undefined;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-lg">
      <p className="mb-1.5 text-xs font-semibold text-slate-300">{label}</p>
      <p className="text-sm text-cyan-400">
        Potência:{' '}
        <span className="font-semibold">
          {payload[0]?.value?.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} W
        </span>
      </p>
      {entry?.risco_pico && (
        <p className="mt-1 text-xs font-semibold text-red-400">⚠ Risco de Pico</p>
      )}
    </div>
  );
}

// Custom dot that highlights risk points
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RiskDot(props: any) {
  const { cx, cy, payload } = props;
  if (!payload?.risco_pico) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="rgba(239,68,68,0.2)" />
      <circle cx={cx} cy={cy} r={4} fill="#EF4444" stroke="#0f172a" strokeWidth={1.5} />
    </g>
  );
}

export default function PredictionChart({ data }: PredictionChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    hora_label: formatHourBR(d.horario_previsto),
    full_label: formatDateHourBR(d.horario_previsto),
  }));

  // Compute average for reference line
  const avg =
    data.length > 0
      ? data.reduce((s, d) => s + d.potencia_prevista, 0) / data.length
      : 0;

  return (
    <div
      id="prediction-chart"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
          <Activity className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Previsão de Consumo — Próximas 24h
          </h2>
          <p className="text-xs text-slate-400">
            Modelo SARIMAX(5,1,0) com variáveis exógenas
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">
          Nenhuma previsão disponível. Execute o modelo preditivo.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradPotencia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="hora_label"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#06b6d4', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Watts',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#06b6d4', fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avg}
              stroke="#94a3b8"
              strokeDasharray="6 4"
              label={{
                value: `Média ${avg.toFixed(0)}W`,
                position: 'insideTopRight',
                fill: '#94a3b8',
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="potencia_prevista"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#gradPotencia)"
              dot={<RiskDot />}
              activeDot={{
                r: 6,
                stroke: '#06b6d4',
                strokeWidth: 2,
                fill: '#0f172a',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
