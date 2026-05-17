// ============================================================
// ByteGreen — Service Layer (Supabase data fetching)
// ============================================================

import { supabase } from '../lib/supabaseClient';
import type {
  EnergiaIntegral,
  EsgDiario,
  TelemetriaLgpd,
  PrevisaoEnergia,
} from '../types';

/** ENDPOINT 1 — Consumo global acumulado (Cálculo Integral) */
export async function fetchEnergiaIntegral(): Promise<EnergiaIntegral> {
  const { data, error } = await supabase.rpc('calcular_energia_integral', {});
  if (error) throw new Error(`Erro ao buscar energia integral: ${error.message}`);
  const result = Array.isArray(data) ? data[0] : data;
  return result as EnergiaIntegral;
}

/** ENDPOINT 2 — Histórico diário de sustentabilidade (ESG) */
export async function fetchEsgDiario(): Promise<EsgDiario[]> {
  const { data, error } = await supabase.rpc('calcular_esg_diario', {});
  if (error) throw new Error(`Erro ao buscar ESG diário: ${error.message}`);
  return (data ?? []) as EsgDiario[];
}

/** ENDPOINT 3 — Feed de auditoria com mascaramento LGPD */
export async function fetchTelemetriaLgpd(): Promise<TelemetriaLgpd[]> {
  const { data, error } = await supabase
    .from('dados_telemetria_lgpd')
    .select(
      'timestamp, vm_id_protegido, cpu_usage, num_executed_instructions, power_consumption'
    )
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error) throw new Error(`Erro ao buscar telemetria LGPD: ${error.message}`);
  return (data ?? []) as TelemetriaLgpd[];
}

/** ENDPOINT — Previsões energéticas (tabela previsoes_energia via SARIMAX) */
export async function fetchPrevisoes(): Promise<PrevisaoEnergia[]> {
  const { data, error } = await supabase
    .from('previsoes_energia')
    .select('*')
    .order('horario_previsto');

  if (error) throw new Error(`Erro ao buscar previsões energéticas: ${error.message}`);
  return (data ?? []) as PrevisaoEnergia[];
}
