/**
 * Lógica matemática de amortización para reducción de créditos hipotecarios
 * Basado en el sistema de amortización francés (el estándar en créditos hipotecarios en Colombia)
 */

export interface SimulacionInput {
  saldoPendiente: number; // Monto actual que debe del crédito
  tasaInteresEA: number; // Tasa de interés Efectiva Anual (ej: 14.5 para 14.5%)
  plazoRestanteMeses: number; // Plazo restante en meses
  cuotaActualPura?: number; // Cuota mensual sin seguros (opcional, se calcula si no se provee)
  abonoMensualAdicional: number; // Abono extra que el cliente está dispuesto a hacer
}

export interface DetalleMes {
  mes: number;
  saldoInicial: number;
  cuotaInteres: number;
  cuotaCapital: number;
  cuotaTotal: number;
  saldoFinal: number;
}

export interface SimulacionResult {
  tasaMensual: number;
  cuotaOriginalCalculada: number;
  totalInteresesOriginal: number;
  totalInteresesNuevo: number;
  ahorroIntereses: number;
  plazoNuevoMeses: number;
  mesesAhorrados: number;
  porcentajePlazoAhorrado: number;
  amortizacionOriginal: DetalleMes[];
  amortizacionNueva: DetalleMes[];
}

/**
 * Convierte una tasa Efectiva Anual (E.A.) a Nominal Mensual Vencida (M.V.)
 */
export function eaToMv(tasaEA: number): number {
  const tasaDecimal = tasaEA / 100;
  return Math.pow(1 + tasaDecimal, 1 / 12) - 1;
}

/**
 * Calcula la cuota mensual pura (Capital + Interés) usando amortización francesa
 */
export function calcularCuotaMensual(
  saldo: number,
  tasaMensual: number,
  meses: number
): number {
  if (tasaMensual === 0) return saldo / meses;
  return (saldo * tasaMensual * Math.pow(1 + tasaMensual, meses)) / 
         (Math.pow(1 + tasaMensual, meses) - 1);
}

/**
 * Simula la amortización mensual completa (sistema francés)
 */
export function simularAmortizacion(
  saldoInicial: number,
  tasaMensual: number,
  plazoMeses: number,
  cuotaFija: number,
  abonoExtraMensual: number = 0
): DetalleMes[] {
  const cronograma: DetalleMes[] = [];
  let saldoActual = saldoInicial;
  let mes = 1;

  while (saldoActual > 0.01 && mes <= 600) { // Límite de 50 años para evitar loops infinitos
    const saldoInicialMes = saldoActual;
    const interesMes = saldoActual * tasaMensual;
    
    // Si es el último mes, ajustamos la cuota
    let cuotaTotal = cuotaFija + abonoExtraMensual;
    let capitalMes = cuotaTotal - interesMes;

    if (saldoActual + interesMes <= cuotaTotal) {
      cuotaTotal = saldoActual + interesMes;
      capitalMes = saldoActual;
      saldoActual = 0;
    } else {
      saldoActual = saldoActual - capitalMes;
    }

    cronograma.push({
      mes,
      saldoInicial: saldoInicialMes,
      cuotaInteres: interesMes,
      cuotaCapital: capitalMes,
      cuotaTotal,
      saldoFinal: saldoActual,
    });

    if (saldoActual === 0) break;
    mes++;
  }

  return cronograma;
}

/**
 * Realiza la simulación comparativa de reducción de crédito
 */
export function simularReduccionCredito(input: SimulacionInput): SimulacionResult {
  const {
    saldoPendiente,
    tasaInteresEA,
    plazoRestanteMeses,
    cuotaActualPura,
    abonoMensualAdicional,
  } = input;

  const tasaMensual = eaToMv(tasaInteresEA);

  // Si no se provee la cuota, se calcula la cuota pura de amortización
  const cuotaOriginalCalculada = cuotaActualPura || calcularCuotaMensual(saldoPendiente, tasaMensual, plazoRestanteMeses);

  // Simulación Original (Plan del Banco)
  const amortizacionOriginal = simularAmortizacion(
    saldoPendiente,
    tasaMensual,
    plazoRestanteMeses,
    cuotaOriginalCalculada,
    0
  );

  // Simulación Nueva (Con Abono Extra Ley de Vivienda)
  // El abono extra se suma directamente a la cuota mensual
  const amortizacionNueva = simularAmortizacion(
    saldoPendiente,
    tasaMensual,
    plazoRestanteMeses,
    cuotaOriginalCalculada,
    abonoMensualAdicional
  );

  // Totales de intereses pagados en cada plan
  const totalInteresesOriginal = amortizacionOriginal.reduce((acc, curr) => acc + curr.cuotaInteres, 0);
  const totalInteresesNuevo = amortizacionNueva.reduce((acc, curr) => acc + curr.cuotaInteres, 0);

  const ahorroIntereses = totalInteresesOriginal - totalInteresesNuevo;
  const plazoNuevoMeses = amortizacionNueva.length;
  const mesesAhorrados = plazoRestanteMeses - plazoNuevoMeses;
  const porcentajePlazoAhorrado = (mesesAhorrados / plazoRestanteMeses) * 100;

  return {
    tasaMensual,
    cuotaOriginalCalculada,
    totalInteresesOriginal,
    totalInteresesNuevo,
    ahorroIntereses: Math.max(0, ahorroIntereses),
    plazoNuevoMeses,
    mesesAhorrados: Math.max(0, mesesAhorrados),
    porcentajePlazoAhorrado: Math.max(0, porcentajePlazoAhorrado),
    amortizacionOriginal,
    amortizacionNueva,
  };
}

/**
 * Formatea valores numéricos a pesos colombianos (COP) o moneda general
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export interface AnalisisExtractoInput {
  valorDesembolso: number;
  saldoCapital: number;
  plazoTotalMeses: number;
  cuotasPagas: number;
  cuotaMensualCredito: number;
  cuotaMensualFRECH: number;       // 0 si no aplica FRECH
  cuotasSubsidiadasPagas: number;  // 0 si no aplica FRECH
  duracionSubsidioFRECH: number;   // por defecto 84 meses (7 años)
  ingresos: number;
  abonoExtra: number;
}

export interface AnalisisExtractoResult {
  // Tiempo
  tiempoPendienteMeses: number;
  tiempoPendienteAnos: number;

  // FRECH
  valorCuotasSubsidiadasPagas: number;
  cuotasPendientesSubsidio: number;
  valorCuotasPendientesSubsidio: number;
  valorTotalBeneficioFRECH: number;
  cuotasPendienteAsumirCliente: number;
  valorCuotasPendienteAsumirCliente: number;

  // Totales de Pago
  valorTotalEntregadoBancoFRECH: number;
  cuantoVaAPagarPorCredito: number;
  numeroVecesPagaCredito: number;
  dineroLlevadoAlBanco: number;
  dineroPendientePorPagar: number;

  // Amortización a Capital, Intereses y Seguros
  amortizadoCapital: number;
  porcentajeAmortizacionCapital: number;
  promedioCapitalPorCuota: number;
  amortizadoInteresesSeguros: number;
  porcentajeInteresesSeguros: number;

  // Cuota Inteligente
  ingresoInicialAproximado: number;
  nuevaCuotaInteligente: number;
  ingresoFinalDemostrar: number;
}

/**
 * Calcula el análisis completo del extracto bancario replicando
 * la hoja Excel de diagnóstico de Williams Cruz.
 * Incluye cálculos FRECH, amortización y cuota inteligente.
 */
export function calcularAnalisisExtracto(input: AnalisisExtractoInput): AnalisisExtractoResult {
  const {
    valorDesembolso,
    saldoCapital,
    plazoTotalMeses,
    cuotasPagas,
    cuotaMensualCredito,
    cuotaMensualFRECH,
    cuotasSubsidiadasPagas,
    duracionSubsidioFRECH,
    ingresos,
    abonoExtra,
  } = input;

  // ─── TIEMPO ───────────────────────────────────────────────
  const tiempoPendienteMeses = Math.max(0, plazoTotalMeses - cuotasPagas);
  const tiempoPendienteAnos = tiempoPendienteMeses / 12;

  // ─── FRECH ────────────────────────────────────────────────
  const valorCuotasSubsidiadasPagas = cuotasSubsidiadasPagas * cuotaMensualFRECH;
  const cuotasPendientesSubsidio = Math.max(0, duracionSubsidioFRECH - cuotasSubsidiadasPagas);
  const valorCuotasPendientesSubsidio = cuotasPendientesSubsidio * cuotaMensualFRECH;
  const valorTotalBeneficioFRECH = valorCuotasSubsidiadasPagas;

  // Cuotas que el cliente pagará SIN subsidio FRECH
  const cuotasPendienteAsumirCliente = Math.max(0, tiempoPendienteMeses - cuotasPendientesSubsidio);
  const valorCuotasPendienteAsumirCliente = cuotasPendienteAsumirCliente * cuotaMensualCredito;

  // ─── TOTALES DE PAGO ──────────────────────────────────────
  // Total que el banco ha recibido (cliente + gobierno)
  const valorTotalEntregadoBancoFRECH = (cuotasPagas * cuotaMensualCredito) + valorTotalBeneficioFRECH;

  // Dinero que el CLIENTE ha sacado de su bolsillo hasta hoy
  const dineroLlevadoAlBanco = (cuotasPagas * cuotaMensualCredito) - valorTotalBeneficioFRECH;

  // Dinero pendiente que el CLIENTE pagará de su bolsillo
  const dineroPendientePorPagar = (tiempoPendienteMeses * cuotaMensualCredito) - valorCuotasPendientesSubsidio;

  // Total de vida del crédito desde el bolsillo del cliente
  const cuantoVaAPagarPorCredito = dineroLlevadoAlBanco + dineroPendientePorPagar;

  // Cuántas veces va a pagar el valor de su vivienda
  const numeroVecesPagaCredito = valorDesembolso > 0 ? cuantoVaAPagarPorCredito / valorDesembolso : 0;

  // ─── AMORTIZACIÓN A CAPITAL, INTERESES Y SEGUROS ──────────
  const amortizadoCapital = Math.max(0, valorDesembolso - saldoCapital);
  const porcentajeAmortizacionCapital = dineroLlevadoAlBanco > 0
    ? (amortizadoCapital / dineroLlevadoAlBanco) * 100
    : 0;
  const promedioCapitalPorCuota = cuotasPagas > 0 ? amortizadoCapital / cuotasPagas : 0;

  const amortizadoInteresesSeguros = Math.max(0, dineroLlevadoAlBanco - amortizadoCapital);
  const porcentajeInteresesSeguros = dineroLlevadoAlBanco > 0
    ? (amortizadoInteresesSeguros / dineroLlevadoAlBanco) * 100
    : 0;

  // ─── CUOTA INTELIGENTE ────────────────────────────────────
  const ingresoInicialAproximado = cuotaMensualCredito > 0 ? cuotaMensualCredito / 0.30 : 0;
  const nuevaCuotaInteligente = cuotaMensualCredito + abonoExtra;
  const ingresoFinalDemostrar = nuevaCuotaInteligente > 0 ? nuevaCuotaInteligente / 0.30 : 0;

  return {
    tiempoPendienteMeses,
    tiempoPendienteAnos,
    valorCuotasSubsidiadasPagas,
    cuotasPendientesSubsidio,
    valorCuotasPendientesSubsidio,
    valorTotalBeneficioFRECH,
    cuotasPendienteAsumirCliente,
    valorCuotasPendienteAsumirCliente,
    valorTotalEntregadoBancoFRECH,
    cuantoVaAPagarPorCredito,
    numeroVecesPagaCredito,
    dineroLlevadoAlBanco,
    dineroPendientePorPagar,
    amortizadoCapital,
    porcentajeAmortizacionCapital,
    promedioCapitalPorCuota,
    amortizadoInteresesSeguros,
    porcentajeInteresesSeguros,
    ingresoInicialAproximado,
    nuevaCuotaInteligente,
    ingresoFinalDemostrar,
  };
}


