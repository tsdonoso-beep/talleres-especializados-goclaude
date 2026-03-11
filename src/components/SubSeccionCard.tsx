import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SubSeccion } from "@/data/modulosConfig";
import { ContenidoCard } from "@/components/ContenidoCard";

interface SubSeccionCardProps {
  subSeccion: SubSeccion;
  defaultOpen?: boolean;
  onContenidoClick?: (contenidoId: string) => void;
  getEstado?: (id: string) => { completed: boolean; inProgress: boolean };
}

export function SubSeccionCard({ subSeccion, defaultOpen = false, onContenidoClick, getEstado }: SubSeccionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50"
        style={{ borderLeft: `4px solid ${subSeccion.colorAccent}` }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white"
              style={{ background: subSeccion.colorAccent }}
            >
              {subSeccion.areaBadge}
            </span>
            <span className="text-[10px] text-muted-foreground">{subSeccion.contenidos.length} contenidos</span>
          </div>
          <h3 className="font-bold text-sm text-foreground">{subSeccion.titulo}</h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content */}
      {open && (
        <div className="p-4 pt-0 space-y-3">
          {subSeccion.contenidos
            .sort((a, b) => a.orden - b.orden)
            .map((item) => {
              const estado = getEstado?.(item.id) || { completed: false, inProgress: false };
              return (
                <ContenidoCard
                  key={item.id}
                  item={item}
                  completed={estado.completed}
                  inProgress={estado.inProgress}
                  onClick={() => onContenidoClick?.(item.id)}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
