// ============================================================
// ByteGreen — Dashboard Principal
// ============================================================

import { RefreshCw, Leaf, Cloud } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';

import SkeletonLoader from './components/SkeletonLoader';
import KpiCards from './components/KpiCards';
import EsgChart from './components/EsgChart';
import AuditTable from './components/AuditTable';
import PredictionStatus from './components/PredictionStatus';
import PredictionKpiCards from './components/PredictionKpiCards';
import PredictionChart from './components/PredictionChart';

export default function App() {
  const { data, loading, errors, refresh } = useDashboard();

  return (
    <div className="bg-mesh relative min-h-screen">
      {/* Ambient floating orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-float absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-emerald-500/[0.04] blur-3xl" />
        <div className="animate-float absolute -right-32 top-2/3 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-3xl" style={{ animationDelay: '3s' }} />
        <div className="animate-float absolute left-1/2 top-[10%] h-56 w-56 rounded-full bg-cyan-500/[0.03] blur-3xl" style={{ animationDelay: '5s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ---- HEADER ---- */}
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <Leaf className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                ByteGreen
              </h1>
              <p className="text-xs text-slate-400">
                Dashboard de Sustentabilidade Digital — Green IT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-refresh indicator */}
            <div className="hidden items-center gap-1.5 text-[10px] text-slate-500 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Auto-refresh 60s
            </div>

            <button
              id="btn-refresh"
              onClick={refresh}
              disabled={loading}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5
                         text-sm font-medium text-slate-300 backdrop-blur-lg
                         transition-all duration-300
                         hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300
                         disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 transition-transform duration-700 ${
                  loading ? 'animate-spin' : 'group-hover:rotate-180'
                }`}
              />
              {loading ? 'Atualizando…' : 'Atualizar Dados'}
            </button>
          </div>
        </header>

        {/* ---- CONTENT ---- */}
        {loading && !data.energiaTotal && data.previsoes.length === 0 ? (
          <SkeletonLoader />
        ) : (
          <main className="stagger space-y-8">
            {/* Partial error banner */}
            {errors.length > 0 && (
              <div className="animate-fade-in-up rounded-xl border border-amber-500/30 bg-amber-950/40 px-5 py-4 backdrop-blur-lg">
                <p className="mb-1 text-sm font-semibold text-amber-300">⚠ Alguns dados não puderam ser carregados</p>
                <ul className="list-inside list-disc space-y-0.5 text-xs text-amber-400/80">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {/* KPI Cards + Prediction Status side by side */}
            <div className="animate-fade-in-up grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <KpiCards energiaTotal={data.energiaTotal} />
              </div>
              <div className="lg:col-span-1">
                <PredictionStatus previsoes={data.previsoes} />
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                CLOUD ENERGY FORECASTING SECTION
                ═══════════════════════════════════════════════════ */}
            <div className="animate-fade-in-up space-y-6">
              {/* Section header */}
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 ring-1 ring-cyan-500/30">
                  <Cloud className="h-4.5 w-4.5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Cloud Energy Forecasting
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Previsão preditiva SARIMAX(5,1,0) · Atualização automática
                  </p>
                </div>
              </div>

              {/* Prediction KPI cards */}
              <PredictionKpiCards previsoes={data.previsoes} />

              {/* Prediction Chart */}
              <PredictionChart data={data.previsoes} />
            </div>

            {/* ESG Chart */}
            <div className="animate-fade-in-up">
              <EsgChart data={data.esgDiario} />
            </div>

            {/* Audit Table */}
            <div className="animate-fade-in-up">
              <AuditTable data={data.telemetria} />
            </div>

            {/* Footer */}
            <footer className="animate-fade-in-up border-t border-white/5 pt-6 pb-4 text-center text-xs text-slate-500">
              ByteGreen © {new Date().getFullYear()} — Infraestrutura sustentável de TI.
              Dados protegidos por hash criptográfico (LGPD).
            </footer>
          </main>
        )}
      </div>
    </div>
  );
}
