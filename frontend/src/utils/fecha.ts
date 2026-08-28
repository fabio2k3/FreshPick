export function diasRestantes(fecha: string | null): number | null {
  if (!fecha) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const cad = new Date(fecha);
  cad.setHours(0, 0, 0, 0);
  return Math.round((cad.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

export type EstadoFrescura = "fresco" | "pronto" | "urgente" | "vencido" | "sin-fecha";

export function estadoFrescura(dias: number | null): EstadoFrescura {
  if (dias === null) return "sin-fecha";
  if (dias < 0) return "vencido";
  if (dias <= 1) return "urgente";
  if (dias <= 4) return "pronto";
  return "fresco";
}

export function textoSticker(dias: number | null): string {
  if (dias === null) return "—";
  if (dias < 0) return "venc.";
  if (dias === 0) return "hoy";
  return `${dias}d`;
}