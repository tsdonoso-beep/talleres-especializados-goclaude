import type { ContenidoItem, Modulo } from "@/data/modulosConfig";

export function calcularTiempo(item: ContenidoItem): string {
  switch (item.tipo) {
    case "PDF": {
      const mins = Math.ceil((item.pages || 5) * 2.5);
      return `${mins} min`;
    }
    case "VIDEO":
      return item.duracion || "—";
    case "INTERACTIVO":
      return `${item.estimatedMinutes || 10} min`;
    case "QUIZ":
      return `${Math.ceil((item.questions || 10) * 1.5)} min`;
    case "EN VIVO":
      return `${item.durationMinutes || 90} min`;
    default:
      return "—";
  }
}

export function calcularMinutos(item: ContenidoItem): number {
  switch (item.tipo) {
    case "PDF":
      return Math.ceil((item.pages || 5) * 2.5);
    case "VIDEO": {
      if (!item.duracion) return 0;
      const [m, s] = item.duracion.split(":").map(Number);
      return m + (s > 0 ? 1 : 0);
    }
    case "INTERACTIVO":
      return item.estimatedMinutes || 10;
    case "QUIZ":
      return Math.ceil((item.questions || 10) * 1.5);
    case "EN VIVO":
      return item.durationMinutes || 90;
    default:
      return 0;
  }
}

export function calcularTotalModulo(modulo: Modulo): number {
  const directMins = modulo.contenidos.reduce((acc, item) => acc + calcularMinutos(item), 0);
  const subMins = modulo.subSecciones?.reduce((acc, sub) =>
    acc + sub.contenidos.reduce((a, item) => a + calcularMinutos(item), 0), 0) || 0;
  return directMins + subMins;
}

export function minutosATexto(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
