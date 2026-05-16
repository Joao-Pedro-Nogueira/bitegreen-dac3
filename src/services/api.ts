// ============================================================
// ByteGreen — Service Layer (Supabase data fetching)
// ============================================================

import { supabase } from '../lib/supabaseClient';
import type {
  EnergiaIntegral,
  EsgDiario,
  TelemetriaLgpd,
  PrevisaoPico,
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

/** ENDPOINT 4 — Previsão preditiva de picos de demanda */
export async function fetchPrevisaoPico(): Promise<PrevisaoPico> {
  const { data, error } = await supabase.rpc('prever_picos_demanda', {});
  if (error) throw new Error(`Erro ao buscar previsão de picos: ${error.message}`);
  const result = Array.isArray(data) ? data[0] : data;
  return result as PrevisaoPico;
}
