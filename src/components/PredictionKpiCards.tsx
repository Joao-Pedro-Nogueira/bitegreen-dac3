// ============================================================
// ByteGreen — Prediction KPI Cards
// Cloud Energy Forecasting — derived metrics
// ============================================================

import { Zap, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import type { PrevisaoEnergia, PrevisaoKpis } from '../types';

interface PredictionKpiCardsProps {
  previsoes: PrevisaoEnergia[];
}

function computeKpis(previsoes: PrevisaoEnergia[]): PrevisaoKpis {
  if (previsoes.length === 0) {
    return {
      mediaPotencia: 0,
      maxPotencia: 0,
      horarioPico: '—',
      totalRiscos: 0,
      proximaPrevisao: null,
    };
  }

  const soma = previsoes.reduce((acc, p) => acc + p.potencia_prevista, 0);
  const media = soma / previsoes.length;

  let maxVal = -Infinity;
  let maxItem: PrevisaoEnergia = previsoes[0];
  for (const p of previsoes) {
    if (p.potencia_prevista > maxVal) {
      maxVal = p.potencia_prevista;
      maxItem = p;
    }
  }

  const totalRiscos = previsoes.filter((p) => p.risco_pico).length;

  // Closest future prediction
  const now = new Date();
  const futuras = previsoes
    .filter((p) => new Date(p.horario_previsto) >= now)
    .sort(
      (a, b) =>
        new Date(a.horario_previsto).getTime() -
        new Date(b.horario_previsto).getTime()
    );

  return {
    mediaPotencia: media,
    maxPotencia: maxVal,
    horarioPico: formatTimeBR(maxItem.horario_previsto),
    totalRiscos,
    proximaPrevisao: futuras[0] ?? previsoes[previsoes.length - 1],
  };
}

function formatTimeBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const cards = [
  {
    key: 'media',
    label: 'Potência Média Prevista',
    icon: TrendingUp,
    color: 'cyan',
    getValue: (k: PrevisaoKpis) =>
      `${k.mediaPotencia.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} W`,
    sub: 'Próximas 24 horas',
  },
  {
    key: 'max',
    label: 'Potência Máxima Prevista',
    icon: Zap,
    color: 'amber',
    getValue: (k: PrevisaoKpis) =>
      `${k.maxPotencia.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} W`,
    sub: 'Pior cenário projetado',
  },
  {
    key: 'hora',
    label: 'Horário do Pico',
    icon: Clock,
    color: 'violet',
    getValue: (k: PrevisaoKpis) => k.horarioPico,
    sub: 'Timestamp do valor máximo',
  },
  {
    key: 'riscos',
    label: 'Alertas de Pico',
    icon: AlertTriangle,
    color: 'red',
    getValue: (k: PrevisaoKpis) => `${k.totalRiscos} de ${0}`,
    sub: 'Janelas com risco elevado',
    getValueDynamic: true,
  },
] as const;

const colorMap: Record<string, { border: string; bg: string; icon: string; text: string; glow: string }> = {
  cyan: {
    border: 'border-cyan-500/20 hover:border-cyan-400/40',
    bg: 'from-cyan-950/60 to-cyan-900/20',
    icon: 'bg-cyan-500/15 ring-cyan-500/30 text-cyan-400',
    text: 'text-cyan-400/80',
    glow: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
  },
  amber: {
    border: 'border-amber-500/20 hover:border-amber-400/40',
    bg: 'from-amber-950/60 to-amber-900/20',
    icon: 'bg-amber-500/15 ring-amber-500/30 text-amber-400',
    text: 'text-amber-400/80',
    glow: 'bg-amber-500/10 group-hover:bg-amber-500/20',
  },
  violet: {
    border: 'border-violet-500/20 hover:border-violet-400/40',
    bg: 'from-violet-950/60 to-violet-900/20',
    icon: 'bg-violet-500/15 ring-violet-500/30 text-violet-400',
    text: 'text-violet-400/80',
    glow: 'bg-violet-500/10 group-hover:bg-violet-500/20',
  },
  red: {
    border: 'border-red-500/20 hover:border-red-400/40',
    bg: 'from-red-950/60 to-red-900/20',
    icon: 'bg-red-500/15 ring-red-500/30 text-red-400',
    text: 'text-red-400/80',
    glow: 'bg-red-500/10 group-hover:bg-red-500/20',
  },
};

export default function PredictionKpiCards({ previsoes }: PredictionKpiCardsProps) {
  const kpis = computeKpis(previsoes);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const c = colorMap[card.color];
        const Icon = card.icon;
        const value =
          card.key === 'riscos'
            ? `${kpis.totalRiscos} de ${previsoes.length}`
            : card.getValue(kpis);

        return (
          <div
            key={card.key}
            id={`kpi-prediction-${card.key}`}
            className={`group relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-5
                        backdrop-blur-xl transition-all duration-500 hover:shadow-lg`}
          >
            {/* Glow */}
            <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${c.glow} blur-2xl transition-all duration-500`} />

            <div className="relative flex items-start justify-between">
              <div className="space-y-2">
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${c.text}`}>
                  {card.label}
                </p>
                <p className="text-2xl font-bold tabular-nums text-white">
                  {value}
                </p>
                <p className="text-[11px] text-slate-500">{card.sub}</p>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.icon} ring-1`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
