// ============================================================
// ByteGreen — Tabela de Auditoria LGPD
// ============================================================

import { Shield } from 'lucide-react';
import type { TelemetriaLgpd } from '../types';

interface AuditTableProps {
  data: TelemetriaLgpd[];
}

function formatTimestampBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatInstructions(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return n.toLocaleString('pt-BR');
}

export default function AuditTable({ data }: AuditTableProps) {
  return (
    <div
      id="audit-table"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
          <Shield className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Auditoria &amp; Logs LGPD
          </h2>
          <p className="text-xs text-slate-400">
            Feed criptográfico com mascaramento MD5/SHA256
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Nenhum registro de telemetria encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Timestamp
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  VM ID (Protegido)
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  CPU (%)
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Instruções
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Potência
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={`${row.vm_id_protegido}-${idx}`}
                  className="border-b border-white/5 transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {formatTimestampBR(row.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <code className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-emerald-400">
                      {row.vm_id_protegido}
                    </code>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {row.cpu_usage.toFixed(2)}%
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-300">
                    {formatInstructions(row.num_executed_instructions)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-300">
                    {row.power_consumption.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} W
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
