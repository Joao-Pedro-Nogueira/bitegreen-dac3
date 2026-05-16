// ============================================================
// ByteGreen — Hook de dados do dashboard
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { DashboardData } from '../types';
import {
  fetchEnergiaIntegral,
  fetchEsgDiario,
  fetchTelemetriaLgpd,
  fetchPrevisaoPico,
} from '../services/api';

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
    previsao: null,
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrors([]);
    // Clear previous data to force fresh re-render (cache invalidation)
    setData({
      energiaTotal: null,
      esgDiario: [],
      telemetria: [],
      previsao: null,
    });

    // Use allSettled so one failing endpoint doesn't block others
    const [energiaResult, esgResult, telemetriaResult, previsaoResult] =
      await Promise.allSettled([
        fetchEnergiaIntegral(),
        fetchEsgDiario(),
        fetchTelemetriaLgpd(),
        fetchPrevisaoPico(),
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
      previsao:
        previsaoResult.status === 'fulfilled'
          ? previsaoResult.value
          : (partialErrors.push(previsaoResult.reason?.message ?? 'Erro ao buscar previsão'), null),
    });

    setErrors(partialErrors);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, errors, refresh: loadData };
}
