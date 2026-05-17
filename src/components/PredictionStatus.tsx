// ============================================================
// ByteGreen — Prediction Status Card (Next Hour)
// Cloud Energy Forecasting — immediate outlook
// ============================================================

import { Zap, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { PrevisaoEnergia } from '../types';

interface PredictionStatusProps {
  previsoes: PrevisaoEnergia[];
}

function getNextPrediction(previsoes: PrevisaoEnergia[]): PrevisaoEnergia | null {
  if (previsoes.length === 0) return null;
  const now = new Date();
  const futuras = previsoes
    .filter((p) => new Date(p.horario_previsto) >= now)
    .sort(
      (a, b) =>
        new Date(a.horario_previsto).getTime() -
        new Date(b.horario_previsto).getTime()
    );
  return futuras[0] ?? previsoes[previsoes.length - 1];
}

function formatTimeBR(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PredictionStatus({ previsoes }: PredictionStatusProps) {
  const next = getNextPrediction(previsoes);

  if (!next) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-500 backdrop-blur-xl">
        Sem previsões disponíveis
      </div>
    );
  }

  const isRisk = next.risco_pico;
  const hasAnyRisk = previsoes.some((p) => p.risco_pico);

  const borderColor = isRisk ? 'border-red-500/40' : 'border-emerald-500/40';
  const bgGradient = isRisk
    ? 'from-red-950/60 to-red-900/20'
    : 'from-emerald-950/60 to-emerald-900/20';
  const glowColor = isRisk ? 'bg-red-500/15' : 'bg-emerald-500/15';

  return (
    <div
      id="prediction-status"
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${borderColor} bg-gradient-to-br ${bgGradient} p-6 backdrop-blur-xl transition-all duration-500`}
    >
      {/* Glow */}
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${glowColor} blur-3xl`} />

      <div className="relative flex flex-1 flex-col space-y-4">
        {/* Badge */}
        <div className="flex items-center gap-2">
          {isRisk ? (
            <ShieldAlert className="h-5 w-5 animate-pulse text-red-400" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          )}
          <span
            className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
              isRisk
                ? 'bg-red-500/20 text-red-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {isRisk ? 'Risco de Pico' : 'Operação Normal'}
          </span>
        </div>

        {/* Title */}
        <div>
          <p className="text-xs text-slate-400">Previsão próxima hora</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-white lg:text-4xl">
            {next.potencia_prevista.toLocaleString('pt-BR', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
            <span className="ml-2 text-base font-medium text-slate-400">W</span>
          </p>
        </div>

        {/* Time */}
        <p className="text-xs text-slate-500">
          <Zap className="mr-1 inline h-3 w-3 text-cyan-400" />
          {formatTimeBR(next.horario_previsto)}
        </p>

        {/* Risk summary */}
        {hasAnyRisk && (
          <div className="mt-auto rounded-lg border border-red-500/20 bg-red-950/30 px-3 py-2">
            <p className="text-xs font-medium text-red-300">
              ⚠️ Pico energético previsto nas próximas horas
            </p>
            <p className="mt-0.5 text-[11px] text-red-400/70">
              {previsoes.filter((p) => p.risco_pico).length} janela(s) com risco elevado
            </p>
          </div>
        )}

        {!hasAnyRisk && (
          <div className="mt-auto rounded-lg border border-emerald-500/20 bg-emerald-950/30 px-3 py-2">
            <p className="text-xs font-medium text-emerald-300">
              ✓ Sem risco de pico detectado
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-400/70">
              Todas as janelas dentro do limiar seguro
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
