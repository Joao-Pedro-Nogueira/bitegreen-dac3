// ============================================================
// ByteGreen — Error Display
// ============================================================

import { RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Pulsing error icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
          <svg
            className="h-10 w-10 text-red-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">
          Falha na Conexão com o Supabase
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-slate-400">
          {message}
        </p>
      </div>

      <button
        onClick={onRetry}
        className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white
                   shadow-lg shadow-emerald-600/20 transition-all duration-300
                   hover:bg-emerald-500 hover:shadow-emerald-500/30 hover:scale-105
                   active:scale-95 cursor-pointer"
      >
        <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
        Tentar Novamente
      </button>
    </div>
  );
}
