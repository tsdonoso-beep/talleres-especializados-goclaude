import { useNavigate } from "react-router-dom";
import type { LiveSession } from "@/data/modulosConfig";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ArrowRight, Radio } from "lucide-react";

interface LiveSessionBannerProps {
  session: LiveSession;
  tallerSlug: string;
}

export function LiveSessionBanner({ session, tallerSlug }: LiveSessionBannerProps) {
  const navigate = useNavigate();
  const isActive = session.status === "active";

  return (
    <button
      onClick={() => navigate(`/taller/${tallerSlug}/modulo/${session.moduloId}/live`)}
      className="w-full text-left p-4 rounded-xl border transition-all hover:shadow-sm"
      style={{
        background: "hsl(var(--tag-pdf-bg))",
        borderColor: "hsl(0 80% 85%)",
      }}
    >
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "hsl(var(--tag-pdf-text))" }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "hsl(var(--tag-pdf-text))" }} />
          </span>
          <Radio className="h-4 w-4" style={{ color: "hsl(var(--tag-pdf-text))" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "hsl(var(--tag-pdf-text))" }}>
            {isActive ? "EN VIVO AHORA" : "PRÓXIMA SESIÓN"}
          </p>
          <p className="text-xs" style={{ color: "hsl(var(--tag-pdf-text))" }}>
            {session.titulo}
          </p>
        </div>

        {!isActive && (
          <div className="flex-shrink-0">
            <p className="text-[10px] mb-1" style={{ color: "hsl(var(--tag-pdf-text))" }}>Inicia en</p>
            <CountdownTimer targetDate={session.scheduledAt} className="!text-lg" />
          </div>
        )}

        <span
          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
          style={{
            background: "hsl(var(--tag-pdf-text))",
            color: "white",
          }}
        >
          {isActive ? "Unirse ahora" : "Ver detalles"} <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}
