// ============================================================
// ByteGreen — Tipos de dados dos contratos de API Supabase
// ============================================================

/** ENDPOINT 1 — calcular_energia_integral */
export interface EnergiaIntegral {
  energia_total_kwh: number;
}

/** ENDPOINT 2 — calcular_esg_diario */
export interface EsgDiario {
  data_registro: string;
  energia_kwh: number;
  co2_emitido_kg: number;
}

/** ENDPOINT 3 — dados_telemetria_lgpd */
export interface TelemetriaLgpd {
  timestamp: string;
  vm_id_protegido: string;
  cpu_usage: number;
  num_executed_instructions: number;
  power_consumption: number;
}

/** ENDPOINT — previsoes_energia (tabela SARIMAX) */
export interface PrevisaoEnergia {
  id: number;
  horario_previsto: string;
  potencia_prevista: number;
  risco_pico: boolean;
}

/** KPIs derivados das previsões */
export interface PrevisaoKpis {
  mediaPotencia: number;
  maxPotencia: number;
  horarioPico: string;
  totalRiscos: number;
  proximaPrevisao: PrevisaoEnergia | null;
}

/** Estado global do dashboard */
export interface DashboardData {
  energiaTotal: EnergiaIntegral | null;
  esgDiario: EsgDiario[];
  telemetria: TelemetriaLgpd[];
  previsoes: PrevisaoEnergia[];
}
