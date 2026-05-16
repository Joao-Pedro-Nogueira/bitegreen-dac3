// ============================================================
// ByteGreen — KPI Cards (Energia Total + CO₂ Emitido)
// ============================================================

import { Zap, Leaf } from 'lucide-react';
import type { EnergiaIntegral } from '../types';

const CO2_FACTOR = 0.09; // kg CO₂e/kWh

interface KpiCardsProps {
  energiaTotal: EnergiaIntegral | null;
}

export default function KpiCards({ energiaTotal }: KpiCardsProps) {
  const kwh = energiaTotal?.energia_total_kwh ?? 0;
  const co2 = kwh * CO2_FACTOR;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Energia Total */}
      <div
        id="kpi-energia-total"
        className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 p-6
                   backdrop-blur-xl transition-all duration-500 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10"
      >
        {/* Glow accent */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-emerald-500/20" />

        <div className="relative flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400/80">
              Consumo Total Acumulado
            </p>
            <p className="text-3xl font-bold tabular-nums text-white lg:text-4xl">
              {kwh.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="ml-2 text-base font-medium text-emerald-400/70">kWh</span>
            </p>
            <p className="text-xs text-slate-400">
              Cálculo integral via Regra do Trapézio
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30 transition-colors group-hover:bg-emerald-500/25">
            <Zap className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* CO₂ Emitido */}
      <div
        id="kpi-co2-emitido"
        className="group relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/60 to-teal-900/30 p-6
                   backdrop-blur-xl transition-all duration-500 hover:border-teal-400/40 hover:shadow-lg hover:shadow-teal-500/10"
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-500/10 blur-2xl transition-all duration-500 group-hover:bg-teal-500/20" />

        <div className="relative flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400/80">
              Impacto Ambiental CO₂e
            </p>
            <p className="text-3xl font-bold tabular-nums text-white lg:text-4xl">
              {co2.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="ml-2 text-base font-medium text-teal-400/70">kg CO₂e</span>
            </p>
            <p className="text-xs text-slate-400">
              Fator de emissão: {CO2_FACTOR} kg CO₂e/kWh
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 ring-1 ring-teal-500/30 transition-colors group-hover:bg-teal-500/25">
            <Leaf className="h-6 w-6 text-teal-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
