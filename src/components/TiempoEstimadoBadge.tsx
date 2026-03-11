import { Clock } from "lucide-react";

interface TiempoEstimadoBadgeProps {
  tiempo: string;
  className?: string;
}

export function TiempoEstimadoBadge({ tiempo, className = "" }: TiempoEstimadoBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        background: "hsl(var(--tag-vid-bg))",
        color: "hsl(var(--tag-vid-text))",
      }}
    >
      <Clock className="h-3 w-3" />
      {tiempo}
    </span>
  );
}
