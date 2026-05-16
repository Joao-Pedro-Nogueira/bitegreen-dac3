// ============================================================
// ByteGreen — Monitor de Estado de Alerta (Previsão de Picos)
// ============================================================

import { Shield, Activity } from 'lucide-react';
import type { PrevisaoPico } from '../types';

interface AlertMonitorProps {
  previsao: PrevisaoPico | null;
}

export default function AlertMonitor({ previsao }: AlertMonitorProps) {
  if (!previsao) return null;

  const isCritico = previsao.status_infraestrutura.includes('CRÍTICO');
  const isEstavel = previsao.status_infraestrutura.includes('ESTÁVEL');

  // Determine severity styling
  const borderColor = isCritico
    ? 'border-red-500/40'
    : isEstavel
      ? 'border-emerald-500/40'
      : 'border-amber-500/40';

  const bgGradient = isCritico
    ? 'from-red-950/60 to-red-900/20'
    : isEstavel
      ? 'from-emerald-950/60 to-emerald-900/20'
      : 'from-amber-950/60 to-amber-900/20';

  const iconBg = isCritico
    ? 'bg-red-500/15 ring-red-500/30'
    : isEstavel
      ? 'bg-emerald-500/15 ring-emerald-500/30'
      : 'bg-amber-500/15 ring-amber-500/30';

  const iconColor = isCritico
    ? 'text-red-400'
    : isEstavel
      ? 'text-emerald-400'
      : 'text-amber-400';

  const statusColor = isCritico
    ? 'text-red-300'
    : isEstavel
      ? 'text-emerald-300'
      : 'text-amber-300';

  const glowColor = isCritico
    ? 'bg-red-500/15'
    : isEstavel
      ? 'bg-emerald-500/15'
      : 'bg-amber-500/15';

  const barColor = isCritico ? 'bg-red-500' : isEstavel ? 'bg-emerald-500' : 'bg-amber-500';
  const barTrack = isCritico ? 'bg-red-500/20' : isEstavel ? 'bg-emerald-500/20' : 'bg-amber-500/20';

  const percentage = previsao.limiar_pico_watts > 0
    ? Math.min((previsao.media_watts_recente / previsao.limiar_pico_watts) * 100, 120)
    : 0;

  return (
    <div
      id="alert-monitor"
      className={`group relative overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGradient} p-6 backdrop-blur-xl transition-all duration-500`}
    >
      {/* Glow */}
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${glowColor} blur-3xl`} />

      <div className="relative space-y-5">
        {/* Title bar */}
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ring-1`}>
            <Shield className={`h-5 w-5 ${iconColor} ${isCritico ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Monitor de Infraestrutura
            </h2>
            <p className="text-xs text-slate-400">
              Análise preditiva de picos de demanda
            </p>
          </div>
        </div>

        {/* Status message */}
        <div className={`rounded-xl border ${borderColor} bg-black/20 px-4 py-3`}>
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${iconColor} ${isCritico ? 'animate-bounce' : ''}`} />
            <span className={`text-sm font-semibold ${statusColor}`}>
              {previsao.status_infraestrutura}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">Média Recente</p>
            <p className="text-xl font-bold tabular-nums text-white">
              {previsao.media_watts_recente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              <span className="ml-1 text-xs font-medium text-slate-400">W</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-400">Limiar de Pico</p>
            <p className="text-xl font-bold tabular-nums text-white">
              {previsao.limiar_pico_watts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              <span className="ml-1 text-xs font-medium text-slate-400">W</span>
            </p>
          </div>
        </div>

        {/* Usage bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Utilização do Limiar</span>
            <span className={`font-semibold ${statusColor}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className={`h-2.5 w-full overflow-hidden rounded-full ${barTrack}`}>
            <div
              className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
