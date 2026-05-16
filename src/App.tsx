// ============================================================
// ByteGreen — Dashboard Principal
// ============================================================

import { RefreshCw, Leaf } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';

import SkeletonLoader from './components/SkeletonLoader';
import KpiCards from './components/KpiCards';
import EsgChart from './components/EsgChart';
import AuditTable from './components/AuditTable';
import AlertMonitor from './components/AlertMonitor';

export default function App() {
  const { data, loading, errors, refresh } = useDashboard();

  return (
    <div className="bg-mesh relative min-h-screen">
      {/* Ambient floating orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-float absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-emerald-500/[0.04] blur-3xl" />
        <div className="animate-float absolute -right-32 top-2/3 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-3xl" style={{ animationDelay: '3s' }} />
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
        </header>

        {/* ---- CONTENT ---- */}
        {loading && !data.energiaTotal ? (
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
            {/* KPI Cards + Alert side by side on desktop */}
            <div className="animate-fade-in-up grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <KpiCards energiaTotal={data.energiaTotal} />
              </div>
              <div className="lg:col-span-1">
                <AlertMonitor previsao={data.previsao} />
              </div>
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
