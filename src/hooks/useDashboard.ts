// ============================================================
// ByteGreen — Hook de dados do dashboard
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DashboardData } from '../types';
import {
  fetchEnergiaIntegral,
  fetchEsgDiario,
  fetchTelemetriaLgpd,
  fetchPrevisoes,
} from '../services/api';

const AUTO_REFRESH_MS = 60_000; // 60 seconds

interface UseDashboardReturn {
  data: DashboardData;
  loading: boolean;
  errors: string[];
  refresh: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData>({
    energiaTotal: null,
    esgDiario: [],
    telemetria: [],
    previsoes: [],
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrors([]);
    // Clear previous data to force fresh re-render (cache invalidation)
    setData({
      energiaTotal: null,
      esgDiario: [],
      telemetria: [],
      previsoes: [],
    });

    // Use allSettled so one failing endpoint doesn't block others
    const [energiaResult, esgResult, telemetriaResult, previsoesResult] =
      await Promise.allSettled([
        fetchEnergiaIntegral(),
        fetchEsgDiario(),
        fetchTelemetriaLgpd(),
        fetchPrevisoes(),
      ]);

    const partialErrors: string[] = [];

    setData({
      energiaTotal:
        energiaResult.status === 'fulfilled'
          ? energiaResult.value
          : (partialErrors.push(energiaResult.reason?.message ?? 'Erro ao buscar energia integral'), null),
      esgDiario:
        esgResult.status === 'fulfilled'
          ? esgResult.value
          : (partialErrors.push(esgResult.reason?.message ?? 'Erro ao buscar ESG diário'), []),
      telemetria:
        telemetriaResult.status === 'fulfilled'
          ? telemetriaResult.value
          : (partialErrors.push(telemetriaResult.reason?.message ?? 'Erro ao buscar telemetria'), []),
      previsoes:
        previsoesResult.status === 'fulfilled'
          ? previsoesResult.value
          : (partialErrors.push(previsoesResult.reason?.message ?? 'Erro ao buscar previsões'), []),
    });

    setErrors(partialErrors);
    setLoading(false);
  }, []);

  // Initial load + auto-refresh every 60s
  useEffect(() => {
    loadData();

    intervalRef.current = setInterval(() => {
      loadData();
    }, AUTO_REFRESH_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadData]);

  return { data, loading, errors, refresh: loadData };
}
