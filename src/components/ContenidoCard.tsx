import { type TipoContenido, type ContenidoItem } from "@/data/modulosConfig";
import { calcularTiempo } from "@/lib/calcularTiempo";
import { TiempoEstimadoBadge } from "@/components/TiempoEstimadoBadge";
import { CheckCircle2, Circle, Loader2, ArrowRight } from "lucide-react";

const TAG_STYLES: Record<TipoContenido, { bg: string; text: string }> = {
  PDF: { bg: "var(--tag-pdf-bg)", text: "var(--tag-pdf-text)" },
  VIDEO: { bg: "var(--tag-vid-bg)", text: "var(--tag-vid-text)" },
  INTERACTIVO: { bg: "var(--tag-3d-bg)", text: "var(--tag-3d-text)" },
  QUIZ: { bg: "260 100% 97%", text: "220 80% 50%" },
  "EN VIVO": { bg: "var(--tag-pdf-bg)", text: "var(--tag-pdf-text)" },
};

interface ContenidoCardProps {
  item: ContenidoItem;
  completed?: boolean;
  inProgress?: boolean;
  onClick?: () => void;
}

export function ContenidoCard({ item, completed = false, inProgress = false, onClick }: ContenidoCardProps) {
  const tag = TAG_STYLES[item.tipo];
  const tiempo = calcularTiempo(item);

  const borderColor = completed
    ? "hsl(var(--g))"
    : inProgress
      ? "hsl(var(--tag-vid-text))"
      : undefined;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-card border border-border rounded-xl p-4 transition-all hover:shadow-sm hover:border-primary/30 ${
        completed || inProgress ? "border-l-[3px]" : ""
      }`}
      style={borderColor ? { borderLeftColor: borderColor } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: `hsl(${tag.bg})`,
                color: `hsl(${tag.text})`,
              }}
            >
              {item.tipo}
            </span>
            <TiempoEstimadoBadge tiempo={tiempo} />
          </div>
          <h4 className="font-semibold text-sm text-foreground leading-snug">{item.titulo}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.descripcion}</p>
        </div>

        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1">
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : inProgress ? (
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "hsl(var(--tag-vid-text))" }} />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/40" />
          )}
          <span className="text-[9px] text-muted-foreground">
            {completed ? "Completado" : inProgress ? "En curso" : "Pendiente"}
          </span>
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
          Abrir <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}
