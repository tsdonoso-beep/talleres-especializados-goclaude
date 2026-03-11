import { Video } from "lucide-react";

interface VimeoPlaceholderProps {
  className?: string;
  label?: string;
}

export function VimeoPlaceholder({ className = "", label = "La transmisión en vivo se mostrará aquí" }: VimeoPlaceholderProps) {
  return (
    /* TODO: reemplazar con <iframe src="https://player.vimeo.com/video/{id}" ...> */
    <div
      className={`aspect-video w-full rounded-xl flex flex-col items-center justify-center gap-3 ${className}`}
      style={{ background: "hsl(var(--dk-base))" }}
    >
      <Video className="h-12 w-12" style={{ color: "hsl(var(--dk-muted))" }} />
      <p className="text-sm font-medium" style={{ color: "hsl(var(--dk-muted))" }}>
        {label}
      </p>
    </div>
  );
}
